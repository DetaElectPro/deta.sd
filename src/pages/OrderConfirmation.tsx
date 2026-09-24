
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { usePageTracking } from '@/hooks/usePageTracking';
import { CheckCircle, Package, User, Mail, Phone, MapPin, Building, FileText, Copy, ExternalLink, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

interface OrderDetails {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  company_name?: string;
  status: string;
  created_at: string;
  notes?: string;
  countries?: { name_ar: string; name_en: string };
  cities?: { name_ar: string; name_en: string };
  ports?: { name_ar: string; name_en: string };
}

const OrderConfirmation = () => {
  usePageTracking();
  const { isRTL } = useLanguage();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id');

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order-confirmation', orderId],
    queryFn: async () => {
      if (!orderId) throw new Error('Order ID is required');
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          countries(name_ar, name_en),
          cities!city_id(name_ar, name_en),
          ports(name_ar, name_en)
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;
      return data as OrderDetails;
    },
    enabled: !!orderId
  });

  const copyOrderId = () => {
    if (orderId) {
      navigator.clipboard.writeText(orderId);
      toast({
        title: isRTL ? "تم النسخ" : "Copied",
        description: isRTL ? "تم نسخ رقم الطلب" : "Order ID copied to clipboard"
      });
    }
  };

  const copyTrackingLink = () => {
    const trackingLink = `${window.location.origin}/track-order?id=${orderId}&email=${order?.customer_email}`;
    navigator.clipboard.writeText(trackingLink);
    toast({
      title: isRTL ? "تم النسخ" : "Copied",
      description: isRTL ? "تم نسخ رابط التتبع" : "Tracking link copied to clipboard"
    });
  };

  if (!orderId) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="rounded-3xl border border-slate-100 shadow-sm">
              <CardContent className="pt-6">
                <p className="text-red-600">
                  {isRTL ? 'رقم الطلب مفقود' : 'Order ID is missing'}
                </p>
                <Link to="/order">
                  <Button className="mt-4 rounded-full bg-deta-green hover:bg-deta-green/90">
                    {isRTL ? 'إنشاء طلب جديد' : 'Create New Order'}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="rounded-3xl border border-slate-100 shadow-sm">
              <CardContent className="pt-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-deta-green mx-auto"></div>
                <p className="mt-4 text-slate-600">{isRTL ? 'جاري التحميل...' : 'Loading...'}</p>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="rounded-3xl border border-slate-100 shadow-sm">
              <CardContent className="pt-6">
                <p className="text-red-600">
                  {isRTL ? 'لم يتم العثور على الطلب' : 'Order not found'}
                </p>
                <Link to="/order">
                  <Button className="mt-4 rounded-full bg-deta-green hover:bg-deta-green/90">
                    {isRTL ? 'إنشاء طلب جديد' : 'Create New Order'}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO
        title="تأكيد الطلب | مجموعة ديتا"
        description="تم استلام طلبكم بنجاح، تابعوا تفاصيل وحالة الطلب هنا."
        url="https://deta.sd/order-confirmation"
        canonical="https://deta.sd/order-confirmation"
        noindex
      />
      <Header />
      
      <div className="container mx-auto px-4 py-8 sm:py-10">
        <div className="max-w-2xl mx-auto space-y-5 sm:space-y-6">
          {/* Success Message */}
          <Card className="border-emerald-200 bg-gradient-to-bl from-emerald-50 to-green-50 rounded-3xl shadow-sm overflow-hidden">
            <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8">
              <div className="text-center">
                <span className="mx-auto mb-4 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-emerald-500/10">
                  <CheckCircle className="h-12 w-12 sm:h-14 sm:w-14 text-emerald-600" />
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-emerald-800 mb-2">
                  {isRTL ? 'تم إرسال طلبك بنجاح!' : 'Order Submitted Successfully!'}
                </h1>
                <p className="text-emerald-700 text-sm sm:text-base">
                  {isRTL ? 'شكراً لك، سيتم التواصل معك قريباً' : 'Thank you, we will contact you soon'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card className="rounded-3xl border border-slate-100 shadow-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-slate-900">
                <Package className="h-5 w-5 shrink-0 text-deta-green" />
                {isRTL ? 'تفاصيل الطلب' : 'Order Details'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-5">
              {/* Order ID */}
              <div className="flex items-center justify-between gap-3 p-3 sm:p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                <div className="min-w-0">
                  <p className="font-medium text-sm sm:text-base text-slate-900">{isRTL ? 'رقم الطلب:' : 'Order ID:'}</p>
                  <p className="text-xs sm:text-sm text-slate-600 font-mono break-all">{order.id}</p>
                </div>
                <Button variant="outline" size="sm" onClick={copyOrderId} className="rounded-full shrink-0">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              {/* Customer Information */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2 text-sm sm:text-base text-slate-900">
                  <User className="h-4 w-4 shrink-0 text-deta-green" />
                  {isRTL ? 'معلومات العميل' : 'Customer Information'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="rounded-2xl border border-slate-100 p-3">
                    <p className="font-medium text-slate-900">{isRTL ? 'الاسم:' : 'Name:'}</p>
                    <p className="text-slate-600 break-words">{order.customer_name}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 p-3">
                    <p className="font-medium flex items-center gap-1.5 text-slate-900">
                      <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      {isRTL ? 'البريد الإلكتروني:' : 'Email:'}
                    </p>
                    <p className="text-slate-600 break-all">{order.customer_email}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 p-3">
                    <p className="font-medium flex items-center gap-1.5 text-slate-900">
                      <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      {isRTL ? 'الهاتف:' : 'Phone:'}
                    </p>
                    <p className="text-slate-600" dir="ltr">{order.customer_phone}</p>
                  </div>
                  {order.company_name && (
                    <div className="rounded-2xl border border-slate-100 p-3">
                      <p className="font-medium flex items-center gap-1.5 text-slate-900">
                        <Building className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                        {isRTL ? 'الشركة:' : 'Company:'}
                      </p>
                      <p className="text-slate-600 break-words">{order.company_name}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2 text-sm sm:text-base text-slate-900">
                  <MapPin className="h-4 w-4 shrink-0 text-deta-green" />
                  {isRTL ? 'معلومات الموقع' : 'Location Information'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="rounded-2xl border border-slate-100 p-3">
                    <p className="font-medium text-slate-900">{isRTL ? 'الدولة:' : 'Country:'}</p>
                    <p className="text-slate-600">
                      {order.countries ? (isRTL ? order.countries.name_ar : order.countries.name_en) : '-'}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 p-3">
                    <p className="font-medium text-slate-900">{isRTL ? 'المدينة:' : 'City:'}</p>
                    <p className="text-slate-600">
                      {order.cities ? (isRTL ? order.cities.name_ar : order.cities.name_en) : '-'}
                    </p>
                  </div>
                  {order.ports && (
                    <div className="md:col-span-2 rounded-2xl border border-slate-100 p-3">
                      <p className="font-medium text-slate-900">{isRTL ? 'الميناء/المطار:' : 'Port/Airport:'}</p>
                      <p className="text-slate-600">
                        {isRTL ? order.ports.name_ar : order.ports.name_en}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {order.notes && (
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2 text-sm sm:text-base text-slate-900">
                    <FileText className="h-4 w-4 shrink-0 text-deta-green" />
                    {isRTL ? 'الملاحظات' : 'Notes'}
                  </h3>
                  <p className="text-sm text-slate-600 bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                    {order.notes}
                  </p>
                </div>
              )}

              {/* Status and Date */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
                <div>
                  <p className="font-medium text-sm sm:text-base text-slate-900">{isRTL ? 'الحالة:' : 'Status:'}</p>
                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 mt-1">
                    {isRTL ? 'قيد المراجعة' : 'Pending Review'}
                  </Badge>
                </div>
                <div className="text-end">
                  <p className="font-medium text-sm sm:text-base text-slate-900">{isRTL ? 'تاريخ الطلب:' : 'Order Date:'}</p>
                  <p className="text-xs sm:text-sm text-slate-600">
                    {new Date(order.created_at).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button 
              onClick={copyTrackingLink}
              className="flex-1 rounded-full"
              variant="outline"
            >
              <Copy className="h-4 w-4 me-2" />
              {isRTL ? 'نسخ رابط التتبع' : 'Copy Tracking Link'}
            </Button>
            
            <Link to={`/track-order?id=${orderId}&email=${order.customer_email}`} className="flex-1">
              <Button className="w-full bg-deta-green hover:bg-deta-green/90 rounded-full">
                <ExternalLink className="h-4 w-4 me-2" />
                {isRTL ? 'تتبع الطلب' : 'Track Order'}
              </Button>
            </Link>
          </div>

          {/* Additional Information */}
          <Card className="bg-blue-50/60 border-blue-100 rounded-3xl">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2 text-sm sm:text-base">
                <Info className="h-4 w-4 shrink-0" />
                {isRTL ? 'معلومات مهمة' : 'Important Information'}
              </h3>
              <ul className="text-xs sm:text-sm text-blue-800 space-y-1.5">
                <li>• {isRTL ? 'احتفظ برقم الطلب للمراجعة المستقبلية' : 'Keep your order ID for future reference'}</li>
                <li>• {isRTL ? 'سيتم التواصل معك خلال 24-48 ساعة' : 'We will contact you within 24-48 hours'}</li>
                <li>• {isRTL ? 'يمكنك تتبع حالة طلبك في أي وقت' : 'You can track your order status anytime'}</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;
