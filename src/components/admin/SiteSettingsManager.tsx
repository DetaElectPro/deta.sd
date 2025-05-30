
import { useState } from 'react';
import { useSiteSettings, useUpdateSiteSetting } from '@/hooks/useSiteSettings';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Save, Palette, Globe, Mail, Phone } from 'lucide-react';

export const SiteSettingsManager = () => {
  const { data: settings, isLoading } = useSiteSettings();
  const updateSetting = useUpdateSiteSetting();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (key: string) => {
    try {
      const value = formData[key] ?? settings?.[key] ?? '';
      await updateSetting.mutateAsync({ key, value });
      toast({
        title: "تم الحفظ بنجاح",
        description: "تم تحديث الإعداد بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ الإعداد",
        variant: "destructive",
      });
    }
  };

  const getValue = (key: string) => {
    return formData[key] ?? settings?.[key] ?? '';
  };

  if (isLoading) {
    return <div className="p-6">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 arabic-heading">إعدادات الموقع</h1>
        <p className="text-gray-600 mt-2">إدارة إعدادات الموقع العامة والألوان والمعلومات</p>
      </div>

      {/* إعدادات عامة */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="h-5 w-5 ml-2" />
            الإعدادات العامة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="site_title">عنوان الموقع</Label>
              <div className="flex space-x-2">
                <Input
                  id="site_title"
                  value={getValue('site_title')}
                  onChange={(e) => handleInputChange('site_title', e.target.value)}
                  placeholder="مجموعة ديتا"
                />
                <Button size="sm" onClick={() => handleSave('site_title')}>
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="google_analytics_id">معرف Google Analytics</Label>
              <div className="flex space-x-2">
                <Input
                  id="google_analytics_id"
                  value={getValue('google_analytics_id')}
                  onChange={(e) => handleInputChange('google_analytics_id', e.target.value)}
                  placeholder="GA-XXXXXXXXX"
                />
                <Button size="sm" onClick={() => handleSave('google_analytics_id')}>
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="site_description">وصف الموقع</Label>
            <div className="flex space-x-2">
              <Textarea
                id="site_description"
                value={getValue('site_description')}
                onChange={(e) => handleInputChange('site_description', e.target.value)}
                placeholder="وصف موجز عن الموقع"
                rows={3}
              />
              <Button size="sm" onClick={() => handleSave('site_description')}>
                <Save className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* إعدادات الألوان */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="h-5 w-5 ml-2" />
            ألوان الموقع
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="primary_color">اللون الأساسي</Label>
              <div className="flex space-x-2">
                <Input
                  id="primary_color"
                  type="color"
                  value={getValue('primary_color')}
                  onChange={(e) => handleInputChange('primary_color', e.target.value)}
                />
                <Input
                  value={getValue('primary_color')}
                  onChange={(e) => handleInputChange('primary_color', e.target.value)}
                  placeholder="#2D5016"
                />
                <Button size="sm" onClick={() => handleSave('primary_color')}>
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="secondary_color">اللون الثانوي</Label>
              <div className="flex space-x-2">
                <Input
                  id="secondary_color"
                  type="color"
                  value={getValue('secondary_color')}
                  onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                />
                <Input
                  value={getValue('secondary_color')}
                  onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                  placeholder="#4A7C59"
                />
                <Button size="sm" onClick={() => handleSave('secondary_color')}>
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="accent_color">لون التمييز</Label>
              <div className="flex space-x-2">
                <Input
                  id="accent_color"
                  type="color"
                  value={getValue('accent_color')}
                  onChange={(e) => handleInputChange('accent_color', e.target.value)}
                />
                <Input
                  value={getValue('accent_color')}
                  onChange={(e) => handleInputChange('accent_color', e.target.value)}
                  placeholder="#D4AF37"
                />
                <Button size="sm" onClick={() => handleSave('accent_color')}>
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* معلومات التواصل */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="h-5 w-5 ml-2" />
            معلومات التواصل
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contact_email">البريد الإلكتروني</Label>
              <div className="flex space-x-2">
                <Input
                  id="contact_email"
                  type="email"
                  value={getValue('contact_email')}
                  onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  placeholder="info@example.com"
                />
                <Button size="sm" onClick={() => handleSave('contact_email')}>
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="contact_phone">رقم الهاتف</Label>
              <div className="flex space-x-2">
                <Input
                  id="contact_phone"
                  value={getValue('contact_phone')}
                  onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                  placeholder="+249123456789"
                />
                <Button size="sm" onClick={() => handleSave('contact_phone')}>
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* وسائل التواصل الاجتماعي */}
      <Card>
        <CardHeader>
          <CardTitle>وسائل التواصل الاجتماعي</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="facebook_url">فيسبوك</Label>
              <div className="flex space-x-2">
                <Input
                  id="facebook_url"
                  value={getValue('facebook_url')}
                  onChange={(e) => handleInputChange('facebook_url', e.target.value)}
                  placeholder="https://facebook.com/company"
                />
                <Button size="sm" onClick={() => handleSave('facebook_url')}>
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="twitter_url">تويتر</Label>
              <div className="flex space-x-2">
                <Input
                  id="twitter_url"
                  value={getValue('twitter_url')}
                  onChange={(e) => handleInputChange('twitter_url', e.target.value)}
                  placeholder="https://twitter.com/company"
                />
                <Button size="sm" onClick={() => handleSave('twitter_url')}>
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="linkedin_url">لينكد إن</Label>
              <div className="flex space-x-2">
                <Input
                  id="linkedin_url"
                  value={getValue('linkedin_url')}
                  onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                  placeholder="https://linkedin.com/company"
                />
                <Button size="sm" onClick={() => handleSave('linkedin_url')}>
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
