import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { usePageTracking } from '@/hooks/usePageTracking';
import { CheckCircle, Package, User, Mail, Phone, MapPin, Building, FileText, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
          cities(name_ar, name_en),
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
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <Card>
              <CardContent className="pt-6">
                <p className="text-red-600">
                  {isRTL ? 'رقم الطلب مفقود' : 'Order ID is missing'}
                </p>
                <Link to="/order">
                  <Button className="mt-4">
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
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <Card>
              <CardContent className="pt-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-deta-green mx-auto"></div>
                <p className="mt-4">{isRTL ? 'جاري التحميل...' : 'Loading...'}</p>
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
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <Card>
              <CardContent className="pt-6">
                <p className="text-red-600">
                  {isRTL ? 'لم يتم العثور على الطلب' : 'Order not found'}
                </p>
                <Link to="/order">
                  <Button className="mt-4">
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Success Message */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-green-800 mb-2">
                  {isRTL ? 'تم إرسال طلبك بنجاح!' : 'Order Submitted Successfully!'}
                </h1>
                <p className="text-green-700">
                  {isRTL ? 'شكراً لك، سيتم التواصل معك قريباً' : 'Thank you, we will contact you soon'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {isRTL ? 'تفاصيل الطلب' : 'Order Details'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Order ID */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{isRTL ? 'رقم الطلب:' : 'Order ID:'}</p>
                  <p className="text-sm text-gray-600 font-mono">{order.id}</p>
                </div>
                <Button variant="outline" size="sm" onClick={copyOrderId}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              {/* Customer Information */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {isRTL ? 'معلومات العميل' : 'Customer Information'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">{isRTL ? 'الاسم:' : 'Name:'}</p>
                    <p className="text-gray-600">{order.customer_name}</p>
                  </div>
                  <div>
                    <p className="font-medium">{isRTL ? 'البريد الإلكتروني:' : 'Email:'}</p>
                    <p className="text-gray-600">{order.customer_email}</p>
                  </div>
                  <div>
                    <p className="font-medium">{isRTL ? 'الهاتف:' : 'Phone:'}</p>
                    <p className="text-gray-600">{order.customer_phone}</p>
                  </div>
                  {order.company_name && (
                    <div>
                      <p className="font-medium">{isRTL ? 'الشركة:' : 'Company:'}</p>
                      <p className="text-gray-600">{order.company_name}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {isRTL ? 'معلومات الموقع' : 'Location Information'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">{isRTL ? 'الدولة:' : 'Country:'}</p>
                    <p className="text-gray-600">
                      {order.countries ? (isRTL ? order.countries.name_ar : order.countries.name_en) : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">{isRTL ? 'المدينة:' : 'City:'}</p>
                    <p className="text-gray-600">
                      {order.cities ? (isRTL ? order.cities.name_ar : order.cities.name_en) : '-'}
                    </p>
                  </div>
                  {order.ports && (
                    <div className="md:col-span-2">
                      <p className="font-medium">{isRTL ? 'الميناء/المطار:' : 'Port/Airport:'}</p>
                      <p className="text-gray-600">
                        {isRTL ? order.ports.name_ar : order.ports.name_en}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {order.notes && (
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {isRTL ? 'الملاحظات' : 'Notes'}
                  </h3>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {order.notes}
                  </p>
                </div>
              )}

              {/* Status and Date */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="font-medium">{isRTL ? 'الحالة:' : 'Status:'}</p>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {isRTL ? 'قيد المراجعة' : 'Pending Review'}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="font-medium">{isRTL ? 'تاريخ الطلب:' : 'Order Date:'}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={copyTrackingLink}
              className="flex-1"
              variant="outline"
            >
              <Copy className="h-4 w-4 mr-2" />
              {isRTL ? 'نسخ رابط التتبع' : 'Copy Tracking Link'}
            </Button>
            
            <Link to={`/track-order?id=${orderId}&email=${order.customer_email}`} className="flex-1">
              <Button className="w-full bg-deta-green hover:bg-deta-green/90">
                <ExternalLink className="h-4 w-4 mr-2" />
                {isRTL ? 'تتبع الطلب' : 'Track Order'}
              </Button>
            </Link>
          </div>

          {/* Additional Information */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-blue-800 mb-2">
                {isRTL ? 'معلومات مهمة' : 'Important Information'}
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
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
