-- ===================================================================
-- تحديث شامل لقاعدة البيانات - نظام إدارة صور الخلفية المتحركة
-- تاريخ: ديسمبر 2024
-- ===================================================================

-- 1. إنشاء جدول صور الخلفية المتحركة
-- ===================================================================

CREATE TABLE IF NOT EXISTS background_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    file_path TEXT, -- مسار الملف في Supabase Storage
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- 2. إنشاء الفهارس للأداء
-- ===================================================================

CREATE INDEX IF NOT EXISTS idx_background_images_active_order 
ON background_images (is_active, display_order);

CREATE INDEX IF NOT EXISTS idx_background_images_order 
ON background_images (display_order);

CREATE INDEX IF NOT EXISTS idx_background_images_file_path 
ON background_images (file_path) WHERE file_path IS NOT NULL;

-- 3. إنشاء trigger لتحديث updated_at تلقائياً
-- ===================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_background_images_updated_at ON background_images;
CREATE TRIGGER update_background_images_updated_at 
    BEFORE UPDATE ON background_images 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 4. إنشاء Storage Buckets
-- ===================================================================

-- إنشاء bucket للصور إذا لم يكن موجوداً
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'background-images',
    'background-images',
    true,
    10485760, -- 10MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- إنشاء bucket للوسائط العامة إذا لم يكن موجوداً
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'media',
    'media',
    true,
    52428800, -- 50MB
    ARRAY[
        'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
        'video/mp4', 'video/webm', 'video/ogg',
        'application/pdf', 'text/plain', 'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
) ON CONFLICT (id) DO NOTHING;

-- 5. إنشاء سياسات الأمان لـ Storage
-- ===================================================================

-- حذف السياسات الموجودة إذا كانت موجودة
DROP POLICY IF EXISTS "Public Access Background Images" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload Background Images" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update Background Images" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete Background Images" ON storage.objects;
DROP POLICY IF EXISTS "Public Media Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Media Upload" ON storage.objects;
DROP POLICY IF EXISTS "Admin Media Update" ON storage.objects;
DROP POLICY IF EXISTS "Admin Media Delete" ON storage.objects;

-- سياسات Storage لصور الخلفية
CREATE POLICY "Public Access Background Images" ON storage.objects
FOR SELECT USING (bucket_id = 'background-images');

CREATE POLICY "Admin Upload Background Images" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'background-images' 
    AND EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

CREATE POLICY "Admin Update Background Images" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'background-images' 
    AND EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

CREATE POLICY "Admin Delete Background Images" ON storage.objects
FOR DELETE USING (
    bucket_id = 'background-images' 
    AND EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- سياسات Storage للوسائط العامة
CREATE POLICY "Public Media Access" ON storage.objects
FOR SELECT USING (bucket_id = 'media');

CREATE POLICY "Admin Media Upload" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'media' 
    AND EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

CREATE POLICY "Admin Media Update" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'media' 
    AND EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

CREATE POLICY "Admin Media Delete" ON storage.objects
FOR DELETE USING (
    bucket_id = 'media' 
    AND EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- 6. إنشاء function لحذف الملف من Storage عند حذف السجل
-- ===================================================================

CREATE OR REPLACE FUNCTION delete_storage_object()
RETURNS TRIGGER AS $$
BEGIN
    -- حذف الملف من Storage إذا كان موجوداً
    IF OLD.file_path IS NOT NULL THEN
        PERFORM storage.delete_object('background-images', OLD.file_path);
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- حذف trigger إذا كان موجوداً
DROP TRIGGER IF EXISTS on_background_image_deleted ON background_images;

-- إنشاء trigger لحذف الملف تلقائياً
CREATE TRIGGER on_background_image_deleted
    AFTER DELETE ON background_images
    FOR EACH ROW EXECUTE FUNCTION delete_storage_object();

-- 7. إضافة سياسات الأمان (RLS) لجدول background_images
-- ===================================================================

ALTER TABLE background_images ENABLE ROW LEVEL SECURITY;

-- حذف السياسات الموجودة
DROP POLICY IF EXISTS "Anyone can view active background images" ON background_images;
DROP POLICY IF EXISTS "Only admins can manage background images" ON background_images;

-- سياسة للقراءة - يمكن للجميع قراءة الصور النشطة
CREATE POLICY "Anyone can view active background images" ON background_images
    FOR SELECT USING (is_active = true);

-- سياسة للإدارة - فقط المدراء يمكنهم إدارة الصور
CREATE POLICY "Only admins can manage background images" ON background_images
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- 8. إدراج بيانات تجريبية (الصور الافتراضية الحالية)
-- ===================================================================

INSERT INTO background_images (title, description, url, is_active, display_order) VALUES
(
    'زراعة حديثة',
    'صورة تعبر عن التقنيات الزراعية الحديثة والمتطورة',
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2832&q=80',
    true,
    1
),
(
    'تكنولوجيا زراعية',
    'تطبيق التكنولوجيا في المجال الزراعي',
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80',
    true,
    2
),
(
    'صناعة الأغذية',
    'عمليات تصنيع وإنتاج الأغذية عالية الجودة',
    'https://images.unsplash.com/photo-1606836591695-4d58a1b335f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80',
    true,
    3
),
(
    'مجال التكنولوجيا',
    'الحلول التقنية والبرمجية المبتكرة',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2826&q=80',
    true,
    4
) ON CONFLICT (id) DO NOTHING;

-- ===================================================================
-- انتهاء التحديث
-- ===================================================================

-- التحقق من نجاح العملية
SELECT 'تم إنشاء الجدول بنجاح' as status, COUNT(*) as total_images 
FROM background_images;

SELECT 'تم إنشاء Storage Buckets بنجاح' as status, COUNT(*) as total_buckets 
FROM storage.buckets WHERE id IN ('background-images', 'media');

SELECT 'تم إنشاء سياسات الأمان بنجاح' as status, COUNT(*) as total_policies 
FROM pg_policies WHERE tablename IN ('background_images', 'objects');
