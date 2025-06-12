-- ===================================================================
-- إضافة حقل image_path لجدول المقالات
-- تاريخ: ديسمبر 2024
-- ===================================================================

-- إضافة حقل image_path لتخزين مسار الملف في Supabase Storage
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS image_path TEXT;

-- إنشاء فهرس للأداء على image_path
CREATE INDEX IF NOT EXISTS idx_articles_image_path 
ON articles (image_path) WHERE image_path IS NOT NULL;

-- إضافة تعليق للحقل الجديد
COMMENT ON COLUMN articles.image_path IS 'مسار الملف في Supabase Storage للصور المرفوعة';

-- إنشاء function لحذف صور المقالات من Storage عند حذف المقال
CREATE OR REPLACE FUNCTION delete_article_image()
RETURNS TRIGGER AS $$
BEGIN
    -- حذف الملف من Storage إذا كان موجوداً
    IF OLD.image_path IS NOT NULL THEN
        PERFORM storage.delete_object('media', OLD.image_path);
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- حذف trigger إذا كان موجوداً
DROP TRIGGER IF EXISTS on_article_deleted ON articles;

-- إنشاء trigger لحذف الملف تلقائياً عند حذف المقال
CREATE TRIGGER on_article_deleted
    AFTER DELETE ON articles
    FOR EACH ROW EXECUTE FUNCTION delete_article_image();

-- إنشاء function لحذف الصورة القديمة عند تحديث image_path
CREATE OR REPLACE FUNCTION cleanup_old_article_image()
RETURNS TRIGGER AS $$
BEGIN
    -- حذف الملف القديم من Storage إذا تم تغيير image_path
    IF OLD.image_path IS NOT NULL 
       AND OLD.image_path != NEW.image_path 
       AND NEW.image_path IS NOT NULL THEN
        PERFORM storage.delete_object('media', OLD.image_path);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- حذف trigger إذا كان موجوداً
DROP TRIGGER IF EXISTS on_article_image_updated ON articles;

-- إنشاء trigger لحذف الصورة القديمة عند التحديث
CREATE TRIGGER on_article_image_updated
    BEFORE UPDATE ON articles
    FOR EACH ROW EXECUTE FUNCTION cleanup_old_article_image();

-- التحقق من نجاح العملية
SELECT 'تم إضافة حقل image_path بنجاح' as status;
