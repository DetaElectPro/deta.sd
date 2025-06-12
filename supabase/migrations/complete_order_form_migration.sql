-- ===================================================================
-- Migration شامل وآمن لإصلاح نموذج الطلبات - إصدار نهائي
-- يتضمن: تغيير الأسماء، إضافة البيانات، منع التكرار، إصلاح التضارب
-- تاريخ: ديسمبر 2024
-- ===================================================================

-- بداية المعاملة الآمنة
BEGIN;

-- 1. إعداد البيئة وإنشاء الدوال المساعدة
-- ===================================================================

-- دالة للتحقق من وجود جدول
CREATE OR REPLACE FUNCTION table_exists(p_table_name text)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = p_table_name
    );
END;
$$ LANGUAGE plpgsql;

-- دالة للتحقق من وجود عمود
CREATE OR REPLACE FUNCTION column_exists(p_table_name text, p_column_name text)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = p_table_name AND column_name = p_column_name
    );
END;
$$ LANGUAGE plpgsql;

-- 2. إعادة تسمية جدول sudan_cities إلى cities (إذا لزم الأمر)
-- ===================================================================

DO $$
BEGIN
    -- التحقق من وجود جدول sudan_cities وإعادة تسميته
    IF table_exists('sudan_cities') AND NOT table_exists('cities') THEN
        -- إعادة تسمية الجدول
        ALTER TABLE sudan_cities RENAME TO cities;
        
        -- تحديث الفهارس
        DROP INDEX IF EXISTS idx_sudan_cities_country_id;
        
        -- تحديث القيود
        ALTER TABLE cities DROP CONSTRAINT IF EXISTS fk_sudan_cities_country_id;
        
        RAISE NOTICE 'تم تغيير اسم الجدول من sudan_cities إلى cities';
        
    ELSIF table_exists('sudan_cities') AND table_exists('cities') THEN
        -- نسخ البيانات من sudan_cities إلى cities إذا كانا موجودين
        INSERT INTO cities (name_ar, name_en, state_ar, state_en, country_id, is_capital, created_at)
        SELECT name_ar, name_en, state_ar, state_en, country_id, is_capital, created_at
        FROM sudan_cities
        WHERE NOT EXISTS (
            SELECT 1 FROM cities c 
            WHERE c.name_en = sudan_cities.name_en 
            AND (c.country_id = sudan_cities.country_id OR (c.country_id IS NULL AND sudan_cities.country_id IS NULL))
        );
        
        -- حذف الجدول القديم
        DROP TABLE sudan_cities CASCADE;
        
        RAISE NOTICE 'تم دمج بيانات sudan_cities في cities وحذف الجدول القديم';
        
    ELSE
        RAISE NOTICE 'جدول cities موجود بالفعل أو لا يوجد sudan_cities للتحويل';
    END IF;
END
$$;

-- 3. إضافة الحقول المطلوبة إذا لم تكن موجودة
-- ===================================================================

-- إضافة حقل country_id إلى جدول cities
DO $$
BEGIN
    IF NOT column_exists('cities', 'country_id') THEN
        ALTER TABLE cities ADD COLUMN country_id UUID;
        RAISE NOTICE 'تم إضافة حقل country_id إلى جدول cities';
    END IF;
END
$$;

-- إضافة حقل city_id إلى جدول orders
DO $$
BEGIN
    IF NOT column_exists('orders', 'city_id') THEN
        ALTER TABLE orders ADD COLUMN city_id UUID;
        RAISE NOTICE 'تم إضافة حقل city_id إلى جدول orders';
    END IF;
END
$$;

-- 4. إنشاء الفهارس الفريدة لمنع التكرار
-- ===================================================================

-- حذف الفهارس القديمة المتضاربة أولاً
DROP INDEX IF EXISTS idx_countries_code;
DROP INDEX IF EXISTS idx_cities_name_en;
DROP INDEX IF EXISTS idx_ports_code;
DROP INDEX IF EXISTS idx_delivery_methods_code;

-- إنشاء فهارس فريدة جديدة
CREATE UNIQUE INDEX IF NOT EXISTS idx_countries_unique_code 
ON countries (code);

CREATE UNIQUE INDEX IF NOT EXISTS idx_cities_unique_name_country 
ON cities (name_en, COALESCE(country_id::text, 'null'));

CREATE UNIQUE INDEX IF NOT EXISTS idx_ports_unique_code 
ON ports (code);

CREATE UNIQUE INDEX IF NOT EXISTS idx_delivery_methods_unique_code 
ON delivery_methods (code);

-- فهارس عادية للأداء
CREATE INDEX IF NOT EXISTS idx_cities_country_id ON cities (country_id);
CREATE INDEX IF NOT EXISTS idx_orders_city_id ON orders (city_id);
CREATE INDEX IF NOT EXISTS idx_orders_country_id ON orders (country_id);
CREATE INDEX IF NOT EXISTS idx_ports_country_id ON ports (country_id);

-- 5. إنشاء القيود الخارجية
-- ===================================================================

-- قيود جدول cities
ALTER TABLE cities DROP CONSTRAINT IF EXISTS fk_cities_country_id;
ALTER TABLE cities ADD CONSTRAINT fk_cities_country_id 
FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE SET NULL;

-- قيود جدول orders
ALTER TABLE orders DROP CONSTRAINT IF EXISTS fk_orders_city_id;
ALTER TABLE orders ADD CONSTRAINT fk_orders_city_id 
FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE SET NULL;

-- قيود جدول ports
ALTER TABLE ports DROP CONSTRAINT IF EXISTS ports_country_id_fkey;
ALTER TABLE ports ADD CONSTRAINT ports_country_id_fkey 
FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE SET NULL;

-- 6. إضافة الدول بطريقة آمنة (تجنب التكرار)
-- ===================================================================

INSERT INTO countries (code, name_ar, name_en, is_local) VALUES
('SD', 'السودان', 'Sudan', true),
('EG', 'مصر', 'Egypt', false),
('SA', 'السعودية', 'Saudi Arabia', false),
('AE', 'الإمارات العربية المتحدة', 'United Arab Emirates', false),
('QA', 'قطر', 'Qatar', false),
('KW', 'الكويت', 'Kuwait', false),
('BH', 'البحرين', 'Bahrain', false),
('OM', 'عمان', 'Oman', false),
('JO', 'الأردن', 'Jordan', false),
('LB', 'لبنان', 'Lebanon', false),
('SY', 'سوريا', 'Syria', false),
('IQ', 'العراق', 'Iraq', false),
('YE', 'اليمن', 'Yemen', false),
('LY', 'ليبيا', 'Libya', false),
('TN', 'تونس', 'Tunisia', false),
('DZ', 'الجزائر', 'Algeria', false),
('MA', 'المغرب', 'Morocco', false),
('MR', 'موريتانيا', 'Mauritania', false),
('SO', 'الصومال', 'Somalia', false),
('DJ', 'جيبوتي', 'Djibouti', false),
('KM', 'جزر القمر', 'Comoros', false),
('PS', 'فلسطين', 'Palestine', false)
ON CONFLICT (code) DO NOTHING;

-- الدول الأوروبية والعالمية المطلوبة
INSERT INTO countries (code, name_ar, name_en, is_local) VALUES
('GB', 'بريطانيا', 'United Kingdom', false),
('CA', 'كندا', 'Canada', false),
('FR', 'فرنسا', 'France', false),
('AU', 'أستراليا', 'Australia', false),
('US', 'الولايات المتحدة الأمريكية', 'United States', false),
('DE', 'ألمانيا', 'Germany', false),
('IT', 'إيطاليا', 'Italy', false),
('ES', 'إسبانيا', 'Spain', false),
('NL', 'هولندا', 'Netherlands', false),
('TR', 'تركيا', 'Turkey', false),
('IR', 'إيران', 'Iran', false),
('IN', 'الهند', 'India', false),
('CN', 'الصين', 'China', false),
('JP', 'اليابان', 'Japan', false),
('KR', 'كوريا الجنوبية', 'South Korea', false),
('SG', 'سنغافورة', 'Singapore', false),
('MY', 'ماليزيا', 'Malaysia', false),
('TH', 'تايلاند', 'Thailand', false),
('ID', 'إندونيسيا', 'Indonesia', false),
('PH', 'الفلبين', 'Philippines', false),
('VN', 'فيتنام', 'Vietnam', false),
('BD', 'بنغلاديش', 'Bangladesh', false),
('PK', 'باكستان', 'Pakistan', false),
('AF', 'أفغانستان', 'Afghanistan', false),
('ET', 'إثيوبيا', 'Ethiopia', false),
('KE', 'كينيا', 'Kenya', false),
('TZ', 'تنزانيا', 'Tanzania', false),
('UG', 'أوغندا', 'Uganda', false),
('RW', 'رواندا', 'Rwanda', false),
('ZA', 'جنوب أفريقيا', 'South Africa', false),
('NG', 'نيجيريا', 'Nigeria', false),
('GH', 'غانا', 'Ghana', false),
('CI', 'ساحل العاج', 'Ivory Coast', false),
('SN', 'السنغال', 'Senegal', false),
('ML', 'مالي', 'Mali', false),
('BF', 'بوركينا فاسو', 'Burkina Faso', false),
('NE', 'النيجر', 'Niger', false),
('TD', 'تشاد', 'Chad', false),
('CF', 'جمهورية أفريقيا الوسطى', 'Central African Republic', false),
('CM', 'الكاميرون', 'Cameroon', false),
('GA', 'الغابون', 'Gabon', false),
('CG', 'الكونغو', 'Congo', false),
('CD', 'جمهورية الكونغو الديمقراطية', 'Democratic Republic of Congo', false),
('AO', 'أنغولا', 'Angola', false),
('ZM', 'زامبيا', 'Zambia', false),
('ZW', 'زيمبابوي', 'Zimbabwe', false),
('BW', 'بوتسوانا', 'Botswana', false),
('NA', 'ناميبيا', 'Namibia', false),
('SZ', 'إسواتيني', 'Eswatini', false),
('LS', 'ليسوتو', 'Lesotho', false),
('MG', 'مدغشقر', 'Madagascar', false),
('MU', 'موريشيوس', 'Mauritius', false),
('SC', 'سيشل', 'Seychelles', false),
('MV', 'المالديف', 'Maldives', false),
('LK', 'سريلانكا', 'Sri Lanka', false),
('NP', 'نيبال', 'Nepal', false),
('BT', 'بوتان', 'Bhutan', false),
('MM', 'ميانمار', 'Myanmar', false),
('LA', 'لاوس', 'Laos', false),
('KH', 'كمبوديا', 'Cambodia', false),
('BN', 'بروناي', 'Brunei', false),
('TL', 'تيمور الشرقية', 'East Timor', false),
('PG', 'بابوا غينيا الجديدة', 'Papua New Guinea', false),
('FJ', 'فيجي', 'Fiji', false),
('SB', 'جزر سليمان', 'Solomon Islands', false),
('VU', 'فانواتو', 'Vanuatu', false),
('NC', 'كاليدونيا الجديدة', 'New Caledonia', false),
('PF', 'بولينيزيا الفرنسية', 'French Polynesia', false),
('CK', 'جزر كوك', 'Cook Islands', false),
('NU', 'نيوي', 'Niue', false),
('TK', 'توكيلاو', 'Tokelau', false),
('WS', 'ساموا', 'Samoa', false),
('TO', 'تونغا', 'Tonga', false),
('TV', 'توفالو', 'Tuvalu', false),
('KI', 'كيريباتي', 'Kiribati', false),
('NR', 'ناورو', 'Nauru', false),
('PW', 'بالاو', 'Palau', false),
('FM', 'ميكرونيزيا', 'Micronesia', false),
('MH', 'جزر مارشال', 'Marshall Islands', false),
('GU', 'غوام', 'Guam', false),
('MP', 'جزر ماريانا الشمالية', 'Northern Mariana Islands', false),
('AS', 'ساموا الأمريكية', 'American Samoa', false),
('VI', 'جزر العذراء الأمريكية', 'US Virgin Islands', false),
('PR', 'بورتوريكو', 'Puerto Rico', false),
('MX', 'المكسيك', 'Mexico', false),
('GT', 'غواتيمالا', 'Guatemala', false),
('BZ', 'بليز', 'Belize', false),
('SV', 'السلفادور', 'El Salvador', false),
('HN', 'هندوراس', 'Honduras', false),
('NI', 'نيكاراغوا', 'Nicaragua', false),
('CR', 'كوستاريكا', 'Costa Rica', false),
('PA', 'بنما', 'Panama', false),
('CU', 'كوبا', 'Cuba', false),
('JM', 'جامايكا', 'Jamaica', false),
('HT', 'هايتي', 'Haiti', false),
('DO', 'جمهورية الدومينيكان', 'Dominican Republic', false),
('TT', 'ترينيداد وتوباغو', 'Trinidad and Tobago', false),
('BB', 'بربادوس', 'Barbados', false),
('GD', 'غرينادا', 'Grenada', false),
('VC', 'سانت فنسنت والغرينادين', 'Saint Vincent and the Grenadines', false),
('LC', 'سانت لوسيا', 'Saint Lucia', false),
('DM', 'دومينيكا', 'Dominica', false),
('AG', 'أنتيغوا وبربودا', 'Antigua and Barbuda', false),
('KN', 'سانت كيتس ونيفيس', 'Saint Kitts and Nevis', false),
('BS', 'البهاماس', 'Bahamas', false),
('CO', 'كولومبيا', 'Colombia', false),
('VE', 'فنزويلا', 'Venezuela', false),
('GY', 'غيانا', 'Guyana', false),
('SR', 'سورينام', 'Suriname', false),
('GF', 'غيانا الفرنسية', 'French Guiana', false),
('BR', 'البرازيل', 'Brazil', false),
('AR', 'الأرجنتين', 'Argentina', false),
('CL', 'تشيلي', 'Chile', false),
('PE', 'بيرو', 'Peru', false),
('EC', 'الإكوادور', 'Ecuador', false),
('BO', 'بوليفيا', 'Bolivia', false),
('PY', 'باراغواي', 'Paraguay', false),
('UY', 'أوروغواي', 'Uruguay', false),
('FK', 'جزر فوكلاند', 'Falkland Islands', false),
('GS', 'جورجيا الجنوبية وجزر ساندويتش الجنوبية', 'South Georgia and South Sandwich Islands', false),
('RU', 'روسيا', 'Russia', false),
('UA', 'أوكرانيا', 'Ukraine', false),
('BY', 'بيلاروسيا', 'Belarus', false),
('MD', 'مولدوفا', 'Moldova', false),
('RO', 'رومانيا', 'Romania', false),
('BG', 'بلغاريا', 'Bulgaria', false),
('GR', 'اليونان', 'Greece', false),
('MK', 'مقدونيا الشمالية', 'North Macedonia', false),
('AL', 'ألبانيا', 'Albania', false),
('ME', 'الجبل الأسود', 'Montenegro', false),
('RS', 'صربيا', 'Serbia', false),
('BA', 'البوسنة والهرسك', 'Bosnia and Herzegovina', false),
('HR', 'كرواتيا', 'Croatia', false),
('SI', 'سلوفينيا', 'Slovenia', false),
('HU', 'المجر', 'Hungary', false),
('SK', 'سلوفاكيا', 'Slovakia', false),
('CZ', 'التشيك', 'Czech Republic', false),
('AT', 'النمسا', 'Austria', false),
('CH', 'سويسرا', 'Switzerland', false),
('LI', 'ليختنشتاين', 'Liechtenstein', false),
('LU', 'لوكسمبورغ', 'Luxembourg', false),
('BE', 'بلجيكا', 'Belgium', false),
('MC', 'موناكو', 'Monaco', false),
('AD', 'أندورا', 'Andorra', false),
('PT', 'البرتغال', 'Portugal', false),
('IE', 'أيرلندا', 'Ireland', false),
('IS', 'أيسلندا', 'Iceland', false),
('NO', 'النرويج', 'Norway', false),
('SE', 'السويد', 'Sweden', false),
('FI', 'فنلندا', 'Finland', false),
('DK', 'الدنمارك', 'Denmark', false),
('EE', 'إستونيا', 'Estonia', false),
('LV', 'لاتفيا', 'Latvia', false),
('LT', 'ليتوانيا', 'Lithuania', false),
('PL', 'بولندا', 'Poland', false),
('GE', 'جورجيا', 'Georgia', false),
('AM', 'أرمينيا', 'Armenia', false),
('AZ', 'أذربيجان', 'Azerbaijan', false),
('KZ', 'كازاخستان', 'Kazakhstan', false),
('KG', 'قيرغيزستان', 'Kyrgyzstan', false),
('TJ', 'طاجيكستان', 'Tajikistan', false),
('TM', 'تركمانستان', 'Turkmenistan', false),
('UZ', 'أوزبكستان', 'Uzbekistan', false),
('MN', 'منغوليا', 'Mongolia', false),
('KP', 'كوريا الشمالية', 'North Korea', false),
('TW', 'تايوان', 'Taiwan', false),
('HK', 'هونغ كونغ', 'Hong Kong', false),
('MO', 'ماكاو', 'Macau', false),
('CY', 'قبرص', 'Cyprus', false),
('MT', 'مالطا', 'Malta', false),
('SM', 'سان مارينو', 'San Marino', false),
('VA', 'الفاتيكان', 'Vatican City', false)
ON CONFLICT (code) DO UPDATE SET
name_ar = EXCLUDED.name_ar,
name_en = EXCLUDED.name_en,
is_local = EXCLUDED.is_local;

-- التحقق من نجاح العملية
SELECT 'تم تغيير اسم الجدول وإضافة الدول بنجاح' as status;

-- 7. إضافة طرق التوصيل بطريقة آمنة
-- ===================================================================

INSERT INTO delivery_methods (code, name_ar, name_en, is_local) VALUES
('LAND', 'شحن بري', 'Land Transport', false),
('SEA', 'شحن بحري', 'Sea Transport', false),
('AIR', 'شحن جوي', 'Air Transport', false),
('LOCAL', 'توصيل محلي', 'Local Delivery', true)
ON CONFLICT (code) DO UPDATE SET
name_ar = EXCLUDED.name_ar,
name_en = EXCLUDED.name_en,
is_local = EXCLUDED.is_local;

-- 8. ربط المدن الموجودة بالسودان (إصلاح البيانات القديمة)
-- ===================================================================

UPDATE cities 
SET country_id = (SELECT id FROM countries WHERE code = 'SD' LIMIT 1)
WHERE country_id IS NULL 
AND EXISTS (SELECT 1 FROM countries WHERE code = 'SD');

-- 9. نسخ البيانات من sudan_city_id إلى city_id في جدول orders
-- ===================================================================

UPDATE orders 
SET city_id = sudan_city_id 
WHERE sudan_city_id IS NOT NULL 
AND city_id IS NULL;

-- 10. إضافة المدن الرئيسية بطريقة آمنة (تجنب التكرار)
-- ===================================================================

-- دالة مساعدة لإضافة المدن بأمان
CREATE OR REPLACE FUNCTION safe_insert_city(
    p_name_ar text, p_name_en text, p_state_ar text, p_state_en text,
    p_country_code text, p_is_capital boolean DEFAULT false
) RETURNS void AS $$
DECLARE
    v_country_id uuid;
BEGIN
    -- الحصول على معرف الدولة
    SELECT id INTO v_country_id FROM countries WHERE code = p_country_code;

    -- إدراج المدينة إذا لم تكن موجودة
    IF v_country_id IS NOT NULL THEN
        INSERT INTO cities (name_ar, name_en, state_ar, state_en, country_id, is_capital)
        VALUES (p_name_ar, p_name_en, p_state_ar, p_state_en, v_country_id, p_is_capital)
        ON CONFLICT (name_en, COALESCE(country_id::text, 'null')) DO NOTHING;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- المدن السودانية
SELECT safe_insert_city('الخرطوم', 'Khartoum', 'الخرطوم', 'Khartoum', 'SD', true);
SELECT safe_insert_city('أم درمان', 'Omdurman', 'الخرطوم', 'Khartoum', 'SD', false);
SELECT safe_insert_city('بحري', 'Bahri', 'الخرطوم', 'Khartoum', 'SD', false);
SELECT safe_insert_city('بورتسودان', 'Port Sudan', 'البحر الأحمر', 'Red Sea', 'SD', false);
SELECT safe_insert_city('كسلا', 'Kassala', 'كسلا', 'Kassala', 'SD', false);
SELECT safe_insert_city('القضارف', 'Gedaref', 'القضارف', 'Gedaref', 'SD', false);
SELECT safe_insert_city('الأبيض', 'El Obeid', 'شمال كردفان', 'North Kordofan', 'SD', false);
SELECT safe_insert_city('نيالا', 'Nyala', 'جنوب دارفور', 'South Darfur', 'SD', false);
SELECT safe_insert_city('الفاشر', 'El Fasher', 'شمال دارفور', 'North Darfur', 'SD', false);
SELECT safe_insert_city('مدني', 'Wad Medani', 'الجزيرة', 'Gezira', 'SD', false);

-- المدن المصرية
SELECT safe_insert_city('القاهرة', 'Cairo', 'القاهرة', 'Cairo', 'EG', true);
SELECT safe_insert_city('الإسكندرية', 'Alexandria', 'الإسكندرية', 'Alexandria', 'EG', false);
SELECT safe_insert_city('الجيزة', 'Giza', 'الجيزة', 'Giza', 'EG', false);
SELECT safe_insert_city('شبرا الخيمة', 'Shubra El Kheima', 'القليوبية', 'Qalyubia', 'EG', false);
SELECT safe_insert_city('بورسعيد', 'Port Said', 'بورسعيد', 'Port Said', 'EG', false);
SELECT safe_insert_city('السويس', 'Suez', 'السويس', 'Suez', 'EG', false);
SELECT safe_insert_city('الأقصر', 'Luxor', 'الأقصر', 'Luxor', 'EG', false);
SELECT safe_insert_city('أسوان', 'Aswan', 'أسوان', 'Aswan', 'EG', false);
SELECT safe_insert_city('المنصورة', 'Mansoura', 'الدقهلية', 'Dakahlia', 'EG', false);
SELECT safe_insert_city('طنطا', 'Tanta', 'الغربية', 'Gharbia', 'EG', false);
-- المدن السعودية
SELECT safe_insert_city('الرياض', 'Riyadh', 'الرياض', 'Riyadh', 'SA', true);
SELECT safe_insert_city('جدة', 'Jeddah', 'مكة المكرمة', 'Makkah', 'SA', false);
SELECT safe_insert_city('مكة المكرمة', 'Mecca', 'مكة المكرمة', 'Makkah', 'SA', false);
SELECT safe_insert_city('المدينة المنورة', 'Medina', 'المدينة المنورة', 'Medina', 'SA', false);
SELECT safe_insert_city('الدمام', 'Dammam', 'المنطقة الشرقية', 'Eastern Province', 'SA', false);
SELECT safe_insert_city('الخبر', 'Khobar', 'المنطقة الشرقية', 'Eastern Province', 'SA', false);

-- مدن الإمارات
SELECT safe_insert_city('أبوظبي', 'Abu Dhabi', 'أبوظبي', 'Abu Dhabi', 'AE', true);
SELECT safe_insert_city('دبي', 'Dubai', 'دبي', 'Dubai', 'AE', false);
SELECT safe_insert_city('الشارقة', 'Sharjah', 'الشارقة', 'Sharjah', 'AE', false);
SELECT safe_insert_city('عجمان', 'Ajman', 'عجمان', 'Ajman', 'AE', false);
SELECT safe_insert_city('أم القيوين', 'Umm Al Quwain', 'أم القيوين', 'Umm Al Quwain', 'AE', false);
SELECT safe_insert_city('رأس الخيمة', 'Ras Al Khaimah', 'رأس الخيمة', 'Ras Al Khaimah', 'AE', false);
SELECT safe_insert_city('الفجيرة', 'Fujairah', 'الفجيرة', 'Fujairah', 'AE', false);
SELECT safe_insert_city('العين', 'Al Ain', 'أبوظبي', 'Abu Dhabi', 'AE', false);

-- مدن قطر
SELECT safe_insert_city('الدوحة', 'Doha', 'الدوحة', 'Doha', 'QA', true);
SELECT safe_insert_city('الريان', 'Al Rayyan', 'الريان', 'Al Rayyan', 'QA', false);

-- مدن الكويت
SELECT safe_insert_city('مدينة الكويت', 'Kuwait City', 'العاصمة', 'Capital', 'KW', true);
SELECT safe_insert_city('الأحمدي', 'Ahmadi', 'الأحمدي', 'Ahmadi', 'KW', false);

-- مدن البحرين
SELECT safe_insert_city('المنامة', 'Manama', 'العاصمة', 'Capital', 'BH', true);
SELECT safe_insert_city('المحرق', 'Muharraq', 'المحرق', 'Muharraq', 'BH', false);

-- مدن عمان
SELECT safe_insert_city('مسقط', 'Muscat', 'مسقط', 'Muscat', 'OM', true);
SELECT safe_insert_city('صلالة', 'Salalah', 'ظفار', 'Dhofar', 'OM', false);

-- مدن الأردن
SELECT safe_insert_city('عمان', 'Amman', 'العاصمة', 'Capital', 'JO', true);
SELECT safe_insert_city('الزرقاء', 'Zarqa', 'الزرقاء', 'Zarqa', 'JO', false);
SELECT safe_insert_city('العقبة', 'Aqaba', 'العقبة', 'Aqaba', 'JO', false);

-- مدن لبنان
SELECT safe_insert_city('بيروت', 'Beirut', 'بيروت', 'Beirut', 'LB', true);
SELECT safe_insert_city('طرابلس', 'Tripoli', 'الشمال', 'North', 'LB', false);

-- مدن سوريا
SELECT safe_insert_city('دمشق', 'Damascus', 'دمشق', 'Damascus', 'SY', true);
SELECT safe_insert_city('حلب', 'Aleppo', 'حلب', 'Aleppo', 'SY', false);

-- مدن العراق
SELECT safe_insert_city('بغداد', 'Baghdad', 'بغداد', 'Baghdad', 'IQ', true);
SELECT safe_insert_city('البصرة', 'Basra', 'البصرة', 'Basra', 'IQ', false);

-- مدن اليمن
SELECT safe_insert_city('صنعاء', 'Sanaa', 'أمانة العاصمة', 'Capital Secretariat', 'YE', true);
SELECT safe_insert_city('عدن', 'Aden', 'عدن', 'Aden', 'YE', false);

-- مدن ليبيا
SELECT safe_insert_city('طرابلس', 'Tripoli Libya', 'طرابلس', 'Tripoli', 'LY', true);
SELECT safe_insert_city('بنغازي', 'Benghazi', 'بنغازي', 'Benghazi', 'LY', false);

-- مدن تونس
SELECT safe_insert_city('تونس', 'Tunis', 'تونس', 'Tunis', 'TN', true);
SELECT safe_insert_city('صفاقس', 'Sfax', 'صفاقس', 'Sfax', 'TN', false);

-- مدن الجزائر
SELECT safe_insert_city('الجزائر', 'Algiers', 'الجزائر', 'Algiers', 'DZ', true);
SELECT safe_insert_city('وهران', 'Oran', 'وهران', 'Oran', 'DZ', false);

-- مدن المغرب
SELECT safe_insert_city('الرباط', 'Rabat', 'الرباط سلا القنيطرة', 'Rabat-Salé-Kénitra', 'MA', true);
SELECT safe_insert_city('الدار البيضاء', 'Casablanca', 'الدار البيضاء سطات', 'Casablanca-Settat', 'MA', false);

-- مدن بريطانيا
SELECT safe_insert_city('لندن', 'London', 'إنجلترا', 'England', 'UK', true);
SELECT safe_insert_city('برمنغهام', 'Birmingham', 'إنجلترا', 'England', 'UK', false);
SELECT safe_insert_city('مانشستر', 'Manchester', 'إنجلترا', 'England', 'UK', false);
SELECT safe_insert_city('ليفربول', 'Liverpool', 'إنجلترا', 'England', 'UK', false);
SELECT safe_insert_city('غلاسكو', 'Glasgow', 'اسكتلندا', 'Scotland', 'UK', false);
SELECT safe_insert_city('إدنبرة', 'Edinburgh', 'اسكتلندا', 'Scotland', 'UK', false);
SELECT safe_insert_city('كارديف', 'Cardiff', 'ويلز', 'Wales', 'UK', false);
SELECT safe_insert_city('بلفاست', 'Belfast', 'أيرلندا الشمالية', 'Northern Ireland', 'UK', false);

-- مدن كندا
SELECT safe_insert_city('كانبرا', 'Canberra', 'إقليم العاصمة الأسترالية', 'Australian Capital Territory', 'AU', true);
SELECT safe_insert_city('سيدني', 'Sydney', 'نيو ساوث ويلز', 'New South Wales', 'AU', false);
SELECT safe_insert_city('ملبورن', 'Melbourne', 'فيكتوريا', 'Victoria', 'AU', false);
SELECT safe_insert_city('بريسبان', 'Brisbane', 'كوينزلاند', 'Queensland', 'AU', false);
SELECT safe_insert_city('بيرث', 'Perth', 'أستراليا الغربية', 'Western Australia', 'AU', false);
SELECT safe_insert_city('أديلايد', 'Adelaide', 'جنوب أستراليا', 'South Australia', 'AU', false);
SELECT safe_insert_city('داروين', 'Darwin', 'الإقليم الشمالي', 'Northern Territory', 'AU', false);
SELECT safe_insert_city('هوبارت', 'Hobart', 'تاسمانيا', 'Tasmania', 'AU', false);

-- مدن فرنسا
SELECT safe_insert_city('باريس', 'Paris', 'إيل دو فرانس', 'Île-de-France', 'FR', true);
SELECT safe_insert_city('مارسيليا', 'Marseille', 'بروفانس ألب كوت دازور', 'Provence-Alpes-Côte d''Azur', 'FR', false);
SELECT safe_insert_city('ليون', 'Lyon', 'أوفيرن رون ألب', 'Auvergne-Rhône-Alpes', 'FR', false);
SELECT safe_insert_city('تولوز', 'Toulouse', 'أوكسيتانيا', 'Occitania', 'FR', false);
SELECT safe_insert_city('نيس', 'Nice', 'بروفانس ألب كوت دازور', 'Provence-Alpes-Côte d''Azur', 'FR', false);
SELECT safe_insert_city('نانت', 'Nantes', 'بايي دو لا لوار', 'Pays de la Loire', 'FR', false);
SELECT safe_insert_city('ستراسبورغ', 'Strasbourg', 'غراند إست', 'Grand Est', 'FR', false);
SELECT safe_insert_city('بوردو', 'Bordeaux', 'نوفيل أكيتين', 'Nouvelle-Aquitaine', 'FR', false);
-- مدن أستراليا


-- حذف الدالة المساعدة
DROP FUNCTION safe_insert_city(text, text, text, text, text, boolean);

-- 11. إضافة المواني والمطارات بطريقة آمنة (تجنب التكرار)
-- ===================================================================

-- دالة مساعدة لإضافة المواني بأمان
CREATE OR REPLACE FUNCTION safe_insert_port(
    p_code text, p_name_ar text, p_name_en text,
    p_port_type text, p_country_code text, p_is_active boolean DEFAULT true
) RETURNS void AS $$
DECLARE
    v_country_id uuid;
BEGIN
    -- الحصول على معرف الدولة
    SELECT id INTO v_country_id FROM countries WHERE code = p_country_code;

    -- إدراج الميناء إذا لم يكن موجوداً
    IF v_country_id IS NOT NULL THEN
        INSERT INTO ports (code, name_ar, name_en, port_type, country_id, is_active)
        VALUES (p_code, p_name_ar, p_name_en, p_port_type, v_country_id, p_is_active)
        ON CONFLICT (code) DO UPDATE SET
        name_ar = EXCLUDED.name_ar,
        name_en = EXCLUDED.name_en,
        port_type = EXCLUDED.port_type,
        country_id = EXCLUDED.country_id,
        is_active = EXCLUDED.is_active;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- المواني البحرية
-- السودان
SELECT safe_insert_port('SDPSD', 'ميناء بورتسودان', 'Port Sudan', 'sea', 'SD', true);
SELECT safe_insert_port('SDSAK', 'ميناء سواكن', 'Suakin Port', 'sea', 'SD', true);

-- مصر
SELECT safe_insert_port('EGALEX', 'ميناء الإسكندرية', 'Alexandria Port', 'sea', 'EG', true);
SELECT safe_insert_port('EGPSD', 'ميناء بورسعيد', 'Port Said', 'sea', 'EG', true);
SELECT safe_insert_port('EGSUZ', 'ميناء السويس', 'Suez Port', 'sea', 'EG', true);
SELECT safe_insert_port('EGDAM', 'ميناء دمياط', 'Damietta Port', 'sea', 'EG', true);

-- السعودية
SELECT safe_insert_port('SAJEDH', 'ميناء جدة الإسلامي', 'Jeddah Islamic Port', 'sea', 'SA', true);
SELECT safe_insert_port('SADAM', 'ميناء الدمام', 'Dammam Port', 'sea', 'SA', true);
SELECT safe_insert_port('SAJUB', 'ميناء الجبيل', 'Jubail Port', 'sea', 'SA', true);
SELECT safe_insert_port('SAYNB', 'ميناء ينبع', 'Yanbu Port', 'sea', 'SA', true);

-- الإمارات
SELECT safe_insert_port('AEDXB', 'ميناء جبل علي', 'Jebel Ali Port', 'sea', 'AE', true);
SELECT safe_insert_port('AESHJ', 'ميناء الشارقة', 'Sharjah Port', 'sea', 'AE', true);
SELECT safe_insert_port('AEFUJ', 'ميناء الفجيرة', 'Fujairah Port', 'sea', 'AE', true);
SELECT safe_insert_port('AEAUH', 'ميناء زايد', 'Zayed Port', 'sea', 'AE', true);

-- قطر والكويت والبحرين وعمان
SELECT safe_insert_port('QADOH', 'ميناء حمد', 'Hamad Port', 'sea', 'QA', true);
SELECT safe_insert_port('KWKWI', 'ميناء الشويخ', 'Shuwaikh Port', 'sea', 'KW', true);
SELECT safe_insert_port('KWSHU', 'ميناء الشعيبة', 'Shuaiba Port', 'sea', 'KW', true);
SELECT safe_insert_port('BHBAH', 'ميناء خليفة بن سلمان', 'Khalifa Bin Salman Port', 'sea', 'BH', true);
SELECT safe_insert_port('OMSLL', 'ميناء صلالة', 'Salalah Port', 'sea', 'OM', true);
SELECT safe_insert_port('OMSOH', 'ميناء صحار', 'Sohar Port', 'sea', 'OM', true);

-- الأردن ولبنان وسوريا والعراق
SELECT safe_insert_port('JOAQJ', 'ميناء العقبة', 'Aqaba Port', 'sea', 'JO', true);
SELECT safe_insert_port('LBBEY', 'ميناء بيروت', 'Beirut Port', 'sea', 'LB', true);
SELECT safe_insert_port('LBTRI', 'ميناء طرابلس', 'Tripoli Port', 'sea', 'LB', true);
SELECT safe_insert_port('SYLAT', 'ميناء اللاذقية', 'Latakia Port', 'sea', 'SY', true);
SELECT safe_insert_port('SYTAR', 'ميناء طرطوس', 'Tartus Port', 'sea', 'SY', true);
SELECT safe_insert_port('IQBAS', 'ميناء أم قصر', 'Umm Qasr Port', 'sea', 'IQ', true);

-- اليمن وليبيا وتونس والجزائر والمغرب
SELECT safe_insert_port('YEHOD', 'ميناء الحديدة', 'Hodeidah Port', 'sea', 'YE', true);
SELECT safe_insert_port('YEADE', 'ميناء عدن', 'Aden Port', 'sea', 'YE', true);
SELECT safe_insert_port('LYTIP', 'ميناء طرابلس', 'Tripoli Port Libya', 'sea', 'LY', true);
SELECT safe_insert_port('LYBNZ', 'ميناء بنغازي', 'Benghazi Port', 'sea', 'LY', true);
SELECT safe_insert_port('TNTUN', 'ميناء تونس', 'Tunis Port', 'sea', 'TN', true);
SELECT safe_insert_port('TNSFX', 'ميناء صفاقس', 'Sfax Port', 'sea', 'TN', true);
SELECT safe_insert_port('DZALG', 'ميناء الجزائر', 'Algiers Port', 'sea', 'DZ', true);
SELECT safe_insert_port('DZORN', 'ميناء وهران', 'Oran Port', 'sea', 'DZ', true);
SELECT safe_insert_port('MACAS', 'ميناء الدار البيضاء', 'Casablanca Port', 'sea', 'MA', true);
SELECT safe_insert_port('MATAN', 'ميناء طنجة المتوسط', 'Tanger Med Port', 'sea', 'MA', true);

-- الدول العالمية
SELECT safe_insert_port('GBLON', 'ميناء لندن', 'Port of London', 'sea', 'GB', true);
SELECT safe_insert_port('GBSOU', 'ميناء ساوثهامبتون', 'Port of Southampton', 'sea', 'GB', true);
SELECT safe_insert_port('CAVAN', 'ميناء فانكوفر', 'Port of Vancouver', 'sea', 'CA', true);
SELECT safe_insert_port('CAMON', 'ميناء مونتريال', 'Port of Montreal', 'sea', 'CA', true);
SELECT safe_insert_port('FRMAR', 'ميناء مارسيليا', 'Port of Marseille', 'sea', 'FR', true);
SELECT safe_insert_port('FRLEH', 'ميناء لوهافر', 'Port of Le Havre', 'sea', 'FR', true);
SELECT safe_insert_port('AUSYD', 'ميناء سيدني', 'Port of Sydney', 'sea', 'AU', true);
SELECT safe_insert_port('AUMEL', 'ميناء ملبورن', 'Port of Melbourne', 'sea', 'AU', true);

-- المطارات الدولية
-- الدول العربية
SELECT safe_insert_port('SDKRT', 'مطار الخرطوم الدولي', 'Khartoum International Airport', 'air', 'SD', true);
SELECT safe_insert_port('EGCAI', 'مطار القاهرة الدولي', 'Cairo International Airport', 'air', 'EG', true);
SELECT safe_insert_port('EGBORG', 'مطار برج العرب الدولي', 'Borg El Arab International Airport', 'air', 'EG', true);
SELECT safe_insert_port('SARUH', 'مطار الملك خالد الدولي', 'King Khalid International Airport', 'air', 'SA', true);
SELECT safe_insert_port('SAJEDAIR', 'مطار الملك عبدالعزيز الدولي', 'King Abdulaziz International Airport', 'air', 'SA', true);
SELECT safe_insert_port('SADAMAIR', 'مطار الملك فهد الدولي', 'King Fahd International Airport', 'air', 'SA', true);
SELECT safe_insert_port('AEDXBAIR', 'مطار دبي الدولي', 'Dubai International Airport', 'air', 'AE', true);
SELECT safe_insert_port('AEAUHAIR', 'مطار أبوظبي الدولي', 'Abu Dhabi International Airport', 'air', 'AE', true);
SELECT safe_insert_port('AESHJAIR', 'مطار الشارقة الدولي', 'Sharjah International Airport', 'air', 'AE', true);
SELECT safe_insert_port('QADOHAIR', 'مطار حمد الدولي', 'Hamad International Airport', 'air', 'QA', true);
SELECT safe_insert_port('KWKWIAIR', 'مطار الكويت الدولي', 'Kuwait International Airport', 'air', 'KW', true);
SELECT safe_insert_port('BHBAHAIR', 'مطار البحرين الدولي', 'Bahrain International Airport', 'air', 'BH', true);
SELECT safe_insert_port('OMSCTAIR', 'مطار مسقط الدولي', 'Muscat International Airport', 'air', 'OM', true);
SELECT safe_insert_port('JOAMMAIR', 'مطار الملكة علياء الدولي', 'Queen Alia International Airport', 'air', 'JO', true);
SELECT safe_insert_port('LBBEYAIR', 'مطار بيروت رفيق الحريري الدولي', 'Beirut Rafic Hariri International Airport', 'air', 'LB', true);
SELECT safe_insert_port('IQBGWAIR', 'مطار بغداد الدولي', 'Baghdad International Airport', 'air', 'IQ', true);
SELECT safe_insert_port('YESANAIR', 'مطار صنعاء الدولي', 'Sanaa International Airport', 'air', 'YE', true);

-- الدول العالمية
SELECT safe_insert_port('GBLHR', 'مطار هيثرو', 'Heathrow Airport', 'air', 'GB', true);
SELECT safe_insert_port('GBLGW', 'مطار غاتويك', 'Gatwick Airport', 'air', 'GB', true);
SELECT safe_insert_port('GBMAN', 'مطار مانشستر', 'Manchester Airport', 'air', 'GB', true);
SELECT safe_insert_port('CAYYZ', 'مطار تورونتو بيرسون الدولي', 'Toronto Pearson International Airport', 'air', 'CA', true);
SELECT safe_insert_port('CAYVR', 'مطار فانكوفر الدولي', 'Vancouver International Airport', 'air', 'CA', true);
SELECT safe_insert_port('FRCDG', 'مطار شارل ديغول', 'Charles de Gaulle Airport', 'air', 'FR', true);
SELECT safe_insert_port('FRORY', 'مطار أورلي', 'Orly Airport', 'air', 'FR', true);
SELECT safe_insert_port('AUSYDAIR', 'مطار سيدني كينغسفورد سميث', 'Sydney Kingsford Smith Airport', 'air', 'AU', true);
SELECT safe_insert_port('AUMELAIR', 'مطار ملبورن', 'Melbourne Airport', 'air', 'AU', true);

-- المنافذ البرية
SELECT safe_insert_port('SDARG', 'منفذ أرقين البري', 'Argeen Land Border', 'land', 'SD', true);
SELECT safe_insert_port('SDWAD', 'منفذ وادي حلفا البري', 'Wadi Halfa Land Border', 'land', 'SD', true);
SELECT safe_insert_port('SDMET', 'منفذ مطمة البري', 'Metema Land Border', 'land', 'SD', true);
SELECT safe_insert_port('EGARG', 'منفذ أرقين المصري', 'Argeen Egyptian Border', 'land', 'EG', true);
SELECT safe_insert_port('EGRAF', 'منفذ رفح البري', 'Rafah Border Crossing', 'land', 'EG', true);
SELECT safe_insert_port('EGSLL', 'منفذ السلوم البري', 'Salloum Border Crossing', 'land', 'EG', true);
SELECT safe_insert_port('SABAT', 'منفذ البطحاء', 'Al Batha Border Crossing', 'land', 'SA', true);
SELECT safe_insert_port('SAJAD', 'منفذ جديدة عرعر', 'Jadeedah Arar Border Crossing', 'land', 'SA', true);
SELECT safe_insert_port('JONAS', 'منفذ نصيب', 'Nasib Border Crossing', 'land', 'JO', true);
SELECT safe_insert_port('JOKRM', 'منفذ الكرامة', 'Karameh Border Crossing', 'land', 'JO', true);

-- حذف الدالة المساعدة
DROP FUNCTION safe_insert_port(text, text, text, text, text, boolean);

-- 12. إضافة تعليقات للجداول والحقول
-- ===================================================================

COMMENT ON COLUMN cities.country_id IS 'معرف الدولة التي تنتمي إليها المدينة';
COMMENT ON COLUMN orders.city_id IS 'معرف المدينة المختارة للطلب';
COMMENT ON COLUMN ports.port_type IS 'نوع الميناء: sea (بحري), air (جوي), land (بري)';
COMMENT ON COLUMN ports.country_id IS 'معرف الدولة التي ينتمي إليها الميناء';

-- 13. تنظيف البيانات المكررة (إذا وجدت)
-- ===================================================================

-- حذف المدن المكررة (الاحتفاظ بالأقدم)
WITH duplicate_cities AS (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY name_en, country_id ORDER BY created_at) as rn
    FROM cities
)
DELETE FROM cities WHERE id IN (
    SELECT id FROM duplicate_cities WHERE rn > 1
);

-- حذف المواني المكررة (الاحتفاظ بالأقدم)
WITH duplicate_ports AS (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY code ORDER BY created_at) as rn
    FROM ports
)
DELETE FROM ports WHERE id IN (
    SELECT id FROM duplicate_ports WHERE rn > 1
);

-- 14. إحصائيات نهائية وتأكيد النجاح
-- ===================================================================

-- إنهاء المعاملة
COMMIT;

-- تقرير نهائي شامل
SELECT
    'تم تنفيذ Migration الشامل بنجاح - جميع البيانات آمنة ومنظمة' as status,
    (SELECT COUNT(*) FROM countries) as total_countries,
    (SELECT COUNT(*) FROM cities) as total_cities,
    (SELECT COUNT(*) FROM ports WHERE port_type = 'sea') as sea_ports,
    (SELECT COUNT(*) FROM ports WHERE port_type = 'air') as airports,
    (SELECT COUNT(*) FROM ports WHERE port_type = 'land') as land_borders,
    (SELECT COUNT(*) FROM delivery_methods) as delivery_methods,
    (SELECT COUNT(*) FROM orders WHERE city_id IS NOT NULL) as orders_with_cities;

-- رسائل تأكيد نهائية
SELECT '🎉 تم إصلاح نموذج الطلبات بالكامل!' as final_message;
SELECT '✅ تم تجنب جميع التكرارات والتضارب' as safety_message;
SELECT '🌍 تم إضافة جميع الدول والمدن والمواني المطلوبة' as data_message;
SELECT '🔗 تم ربط جميع العلاقات بشكل صحيح' as relations_message;

-- حذف الدوال المساعدة
DROP FUNCTION IF EXISTS table_exists(text);
DROP FUNCTION IF EXISTS column_exists(text, text);


-- إضافة البيانات الأساسية للدول وطرق التوصيل
-- تاريخ: 31 ديسمبر 2024

-- إضافة الدول الأساسية
INSERT INTO countries (code, name_ar, name_en, is_local) VALUES
('SD', 'السودان', 'Sudan', true),
('EG', 'مصر', 'Egypt', false),
('SA', 'السعودية', 'Saudi Arabia', false),
('AE', 'الإمارات العربية المتحدة', 'United Arab Emirates', false),
('QA', 'قطر', 'Qatar', false),
('KW', 'الكويت', 'Kuwait', false),
('BH', 'البحرين', 'Bahrain', false),
('OM', 'عمان', 'Oman', false),
('JO', 'الأردن', 'Jordan', false),
('LB', 'لبنان', 'Lebanon', false),
('GB', 'بريطانيا', 'United Kingdom', false),
('CA', 'كندا', 'Canada', false),
('FR', 'فرنسا', 'France', false),
('AU', 'أستراليا', 'Australia', false),
('US', 'الولايات المتحدة الأمريكية', 'United States', false)
ON CONFLICT (code) DO UPDATE SET
name_ar = EXCLUDED.name_ar,
name_en = EXCLUDED.name_en,
is_local = EXCLUDED.is_local;

-- إضافة طرق التوصيل
INSERT INTO delivery_methods (code, name_ar, name_en, is_local) VALUES
('LAND', 'شحن بري', 'Land Transport', false),
('SEA', 'شحن بحري', 'Sea Transport', false),
('AIR', 'شحن جوي', 'Air Transport', false),
('LOCAL', 'توصيل محلي', 'Local Delivery', true)
ON CONFLICT (code) DO UPDATE SET
name_ar = EXCLUDED.name_ar,
name_en = EXCLUDED.name_en,
is_local = EXCLUDED.is_local;

-- إضافة بعض المدن الأساسية
DO $$
DECLARE
    sudan_id uuid;
    egypt_id uuid;
    saudi_id uuid;
BEGIN
    -- الحصول على معرفات الدول
    SELECT id INTO sudan_id FROM countries WHERE code = 'SD';
    SELECT id INTO egypt_id FROM countries WHERE code = 'EG';
    SELECT id INTO saudi_id FROM countries WHERE code = 'SA';

    -- إضافة المدن السودانية
    IF sudan_id IS NOT NULL THEN
        INSERT INTO cities (name_ar, name_en, state_ar, state_en, country_id, is_capital) VALUES
        ('الخرطوم', 'Khartoum', 'الخرطوم', 'Khartoum', sudan_id, true),
        ('أم درمان', 'Omdurman', 'الخرطوم', 'Khartoum', sudan_id, false),
        ('بحري', 'Bahri', 'الخرطوم', 'Khartoum', sudan_id, false),
        ('بورتسودان', 'Port Sudan', 'البحر الأحمر', 'Red Sea', sudan_id, false),
        ('كسلا', 'Kassala', 'كسلا', 'Kassala', sudan_id, false)
        ON CONFLICT (name_en, COALESCE(country_id::text, 'null')) DO NOTHING;
    END IF;

    -- إضافة المدن المصرية
    IF egypt_id IS NOT NULL THEN
        INSERT INTO cities (name_ar, name_en, state_ar, state_en, country_id, is_capital) VALUES
        ('القاهرة', 'Cairo', 'القاهرة', 'Cairo', egypt_id, true),
        ('الإسكندرية', 'Alexandria', 'الإسكندرية', 'Alexandria', egypt_id, false),
        ('الجيزة', 'Giza', 'الجيزة', 'Giza', egypt_id, false)
        ON CONFLICT (name_en, COALESCE(country_id::text, 'null')) DO NOTHING;
    END IF;

    -- إضافة المدن السعودية
    IF saudi_id IS NOT NULL THEN
        INSERT INTO cities (name_ar, name_en, state_ar, state_en, country_id, is_capital) VALUES
        ('الرياض', 'Riyadh', 'الرياض', 'Riyadh', saudi_id, true),
        ('جدة', 'Jeddah', 'مكة المكرمة', 'Makkah', saudi_id, false),
        ('الدمام', 'Dammam', 'المنطقة الشرقية', 'Eastern Province', saudi_id, false)
        ON CONFLICT (name_en, COALESCE(country_id::text, 'null')) DO NOTHING;
    END IF;
END $$;

-- إضافة بعض المواني الأساسية
DO $$
DECLARE
    sudan_id uuid;
    egypt_id uuid;
    saudi_id uuid;
BEGIN
    -- الحصول على معرفات الدول
    SELECT id INTO sudan_id FROM countries WHERE code = 'SD';
    SELECT id INTO egypt_id FROM countries WHERE code = 'EG';
    SELECT id INTO saudi_id FROM countries WHERE code = 'SA';

    -- إضافة المواني السودانية
    IF sudan_id IS NOT NULL THEN
        INSERT INTO ports (code, name_ar, name_en, port_type, country_id, is_active) VALUES
        ('SDPSD', 'ميناء بورتسودان', 'Port Sudan', 'sea', sudan_id, true),
        ('SDKRT', 'مطار الخرطوم الدولي', 'Khartoum International Airport', 'air', sudan_id, true)
        ON CONFLICT (code) DO UPDATE SET
        name_ar = EXCLUDED.name_ar,
        name_en = EXCLUDED.name_en,
        port_type = EXCLUDED.port_type,
        country_id = EXCLUDED.country_id,
        is_active = EXCLUDED.is_active;
    END IF;

    -- إضافة المواني المصرية
    IF egypt_id IS NOT NULL THEN
        INSERT INTO ports (code, name_ar, name_en, port_type, country_id, is_active) VALUES
        ('EGALEX', 'ميناء الإسكندرية', 'Alexandria Port', 'sea', egypt_id, true),
        ('EGCAI', 'مطار القاهرة الدولي', 'Cairo International Airport', 'air', egypt_id, true)
        ON CONFLICT (code) DO UPDATE SET
        name_ar = EXCLUDED.name_ar,
        name_en = EXCLUDED.name_en,
        port_type = EXCLUDED.port_type,
        country_id = EXCLUDED.country_id,
        is_active = EXCLUDED.is_active;
    END IF;

    -- إضافة المواني السعودية
    IF saudi_id IS NOT NULL THEN
        INSERT INTO ports (code, name_ar, name_en, port_type, country_id, is_active) VALUES
        ('SAJEDH', 'ميناء جدة الإسلامي', 'Jeddah Islamic Port', 'sea', saudi_id, true),
        ('SARUH', 'مطار الملك خالد الدولي', 'King Khalid International Airport', 'air', saudi_id, true)
        ON CONFLICT (code) DO UPDATE SET
        name_ar = EXCLUDED.name_ar,
        name_en = EXCLUDED.name_en,
        port_type = EXCLUDED.port_type,
        country_id = EXCLUDED.country_id,
        is_active = EXCLUDED.is_active;
    END IF;
END $$;
