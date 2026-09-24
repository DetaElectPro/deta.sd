
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { Loader2, Package, MessageCircle, Send, Radar } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  company_name?: string;
  status: string;
  total_amount?: number;
  created_at: string;
  language_code?: string;
  countries?: { name_ar: string; name_en: string };
  delivery_methods?: { name_ar: string; name_en: string };
  ports?: { name_ar: string; name_en: string };
  cities?: { name_ar: string; name_en: string };
  notes?: string;
}

interface OrderMessage {
  id: string;
  sender_type: string;
  sender_name: string;
  message: string;
  created_at: string;
}

const OrderTracking = () => {
  const { t, isRTL } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [customerName, setCustomerName] = useState('');

  // Auto-fill from URL parameters
  useEffect(() => {
    const urlOrderId = searchParams.get('id');
    const urlEmail = searchParams.get('email');

    if (urlOrderId) {
      setOrderNumber(urlOrderId);
    }
    if (urlEmail) {
      setCustomerEmail(urlEmail);
    }

    // Auto-search if both parameters are present
    if (urlOrderId && urlEmail) {
      searchOrderWithParams(urlOrderId, urlEmail);
    }
  }, [searchParams]);

  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['order-messages', foundOrder?.id],
    queryFn: async () => {
      if (!foundOrder?.id) return [];
      
      const { data, error } = await supabase
        .from('order_messages')
        .select('*')
        .eq('order_id', foundOrder.id)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!foundOrder?.id
  });

  const searchOrderWithParams = async (orderId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          countries(name_ar, name_en),
          delivery_methods(name_ar, name_en),
          ports(name_ar, name_en),
          cities!city_id(name_ar, name_en)
        `)
        .eq('id', orderId)
        .eq('customer_email', email)
        .single();

      if (error || !data) {
        toast({
          title: isRTL ? "لم يتم العثور على الطلب" : "Order not found",
          description: isRTL ? "تأكد من صحة رقم الطلب والبريد الإلكتروني" : "Please check your order number and email",
          variant: "destructive"
        });
        return;
      }

      setFoundOrder(data);
      setCustomerName(data.customer_name);
    } catch (error) {
      console.error('Error searching order:', error);
      toast({
        title: isRTL ? "خطأ في البحث" : "Search error",
        description: isRTL ? "حدث خطأ أثناء البحث عن الطلب" : "An error occurred while searching for the order",
        variant: "destructive"
      });
    }
  };

  const searchOrder = async () => {
    if (!orderNumber || !customerEmail) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "يرجى إدخال رقم الطلب والبريد الإلكتروني" : "Please enter order number and email",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          countries(name_ar, name_en),
          delivery_methods(name_ar, name_en),
          ports(name_ar, name_en),
          cities!city_id(name_ar, name_en)
        `)
        .eq('id', orderNumber)
        .eq('customer_email', customerEmail)
        .single();

      if (error || !data) {
        toast({
          title: isRTL ? "لم يتم العثور على الطلب" : "Order not found",
          description: isRTL ? "تأكد من صحة رقم الطلب والبريد الإلكتروني" : "Please check your order number and email",
          variant: "destructive"
        });
        return;
      }

      setFoundOrder(data);
      setCustomerName(data.customer_name);
      toast({
        title: isRTL ? "تم العثور على الطلب" : "Order found",
        description: isRTL ? "يمكنك الآن تتبع حالة طلبك" : "You can now track your order status"
      });
    } catch (error) {
      console.error('Error searching order:', error);
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "حدث خطأ في البحث" : "Error occurred while searching",
        variant: "destructive"
      });
    }
  };

  const sendMessage = useMutation({
    mutationFn: async () => {
      if (!newMessage.trim() || !foundOrder) return;
      
      const { error } = await supabase
        .from('order_messages')
        .insert({
          order_id: foundOrder.id,
          sender_type: 'customer',
          sender_name: customerName,
          message: newMessage.trim()
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-messages'] });
      setNewMessage('');
      toast({
        title: isRTL ? "تم الإرسال" : "Message sent",
        description: isRTL ? "تم إرسال رسالتك بنجاح" : "Your message has been sent successfully"
      });
    },
    onError: () => {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "حدث خطأ في إرسال الرسالة" : "Error sending message",
        variant: "destructive"
      });
    }
  });

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return isRTL ? 'في الانتظار' : 'Pending';
      case 'confirmed': return isRTL ? 'مؤكد' : 'Confirmed';
      case 'shipped': return isRTL ? 'تم الشحن' : 'Shipped';
      case 'delivered': return isRTL ? 'تم التسليم' : 'Delivered';
      case 'cancelled': return isRTL ? 'ملغي' : 'Cancelled';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-500 hover:bg-amber-600';
      case 'confirmed': return 'bg-blue-500 hover:bg-blue-600';
      case 'shipped': return 'bg-purple-500 hover:bg-purple-600';
      case 'delivered': return 'bg-emerald-500 hover:bg-emerald-600';
      case 'cancelled': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-slate-500 hover:bg-slate-600';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEO
        title="تتبع الطلب | مجموعة ديتا"
        description="تتبع حالة طلبك من مجموعة ديتا برقم الطلب والبريد الإلكتروني."
        url="https://deta.sd/track-order"
        canonical="https://deta.sd/track-order"
        noindex
      />
      <Header />
      
      {/* Page band */}
      <section className="relative overflow-hidden bg-gradient-to-bl from-emerald-950 via-deta-green to-deta-green-light py-10 sm:py-14">
        <div aria-hidden="true" className="absolute -top-20 -start-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="relative container mx-auto px-4 text-center text-white">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium sm:text-sm">
            <Radar className="h-4 w-4" />
            {t('tracking.title')}
          </span>
          <h1 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold arabic-heading">
            {t('tracking.title')}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-white/85 max-w-xl mx-auto">
            {t('tracking.subtitle')}
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8 sm:py-10">
        <div className="max-w-4xl mx-auto">
          {!foundOrder ? (
            <Card className="mb-8 rounded-3xl border border-slate-100 shadow-lg overflow-hidden">
              <CardHeader className="border-b border-slate-100 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-slate-900">
                  <Package className="h-5 w-5 shrink-0 text-deta-green" />
                  {isRTL ? 'البحث عن الطلب' : 'Find Your Order'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-5">
                <div>
                  <Label htmlFor="orderNumber">
                    {t('tracking.orderId')}
                  </Label>
                  <Input
                    id="orderNumber"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder={isRTL ? 'أدخل رقم الطلب' : 'Enter order number'}
                    className="mt-1.5 rounded-xl"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">
                    {t('tracking.email')}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder={isRTL ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                    className="mt-1.5 rounded-xl"
                  />
                </div>
                
                <Button onClick={searchOrder} className="w-full rounded-full bg-deta-green hover:bg-deta-green/90 shadow-md">
                  {t('tracking.track')}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-5 sm:space-y-6">
              {/* Order Details */}
              <Card className="rounded-3xl border border-slate-100 shadow-sm">
                <CardHeader className="border-b border-slate-100 pb-4">
                  <CardTitle className="flex items-center justify-between gap-3 text-lg sm:text-xl text-slate-900">
                    <span>{isRTL ? 'تفاصيل الطلب' : 'Order Details'}</span>
                    <Badge className={`text-white rounded-full shrink-0 ${getStatusColor(foundOrder.status)}`}>
                      {getStatusText(foundOrder.status)}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-slate-100 p-3">
                      <p className="font-medium text-sm text-slate-900">{isRTL ? 'رقم الطلب:' : 'Order Number:'}</p>
                      <p className="text-slate-600 text-sm font-mono break-all">{foundOrder.id}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-100 p-3">
                      <p className="font-medium text-sm text-slate-900">{isRTL ? 'اسم العميل:' : 'Customer Name:'}</p>
                      <p className="text-slate-600 text-sm break-words">{foundOrder.customer_name}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-100 p-3">
                      <p className="font-medium text-sm text-slate-900">{isRTL ? 'رقم الهاتف:' : 'Phone Number:'}</p>
                      <p className="text-slate-600 text-sm" dir="ltr">{foundOrder.customer_phone}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-100 p-3">
                      <p className="font-medium text-sm text-slate-900">{isRTL ? 'تاريخ الطلب:' : 'Order Date:'}</p>
                      <p className="text-slate-600 text-sm">
                        {new Date(foundOrder.created_at).toLocaleDateString(isRTL ? 'ar' : 'en')}
                      </p>
                    </div>
                    {foundOrder.company_name && (
                      <div className="rounded-2xl border border-slate-100 p-3">
                        <p className="font-medium text-sm text-slate-900">{isRTL ? 'اسم الشركة:' : 'Company Name:'}</p>
                        <p className="text-slate-600 text-sm break-words">{foundOrder.company_name}</p>
                      </div>
                    )}
                    {foundOrder.countries && (
                      <div className="rounded-2xl border border-slate-100 p-3">
                        <p className="font-medium text-sm text-slate-900">{isRTL ? 'الدولة:' : 'Country:'}</p>
                        <p className="text-slate-600 text-sm">
                          {isRTL ? foundOrder.countries.name_ar : foundOrder.countries.name_en}
                        </p>
                      </div>
                    )}
                  </div>
                  {foundOrder.notes && (
                    <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-100 p-3">
                      <p className="font-medium text-sm text-slate-900">{isRTL ? 'ملاحظات:' : 'Notes:'}</p>
                      <p className="text-slate-600 text-sm mt-1">{foundOrder.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Messages */}
              <Card className="rounded-3xl border border-slate-100 shadow-sm">
                <CardHeader className="border-b border-slate-100 pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-slate-900">
                    <MessageCircle className="h-5 w-5 shrink-0 text-deta-green" />
                    {t('tracking.messages')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5">
                  <div className="space-y-4">
                    {/* Messages List */}
                    <div className="max-h-96 overflow-y-auto space-y-3 rounded-2xl bg-slate-50/60 border border-slate-100 p-3 sm:p-4">
                      {messagesLoading ? (
                        <div className="text-center py-4">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto text-deta-green" />
                        </div>
                      ) : messages.length === 0 ? (
                        <p className="text-slate-500 text-center py-4 text-sm">
                          {isRTL ? 'لا توجد رسائل بعد' : 'No messages yet'}
                        </p>
                      ) : (
                        messages.map((message: OrderMessage) => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender_type === 'customer' ? 
                              (isRTL ? 'justify-start' : 'justify-end') : 
                              (isRTL ? 'justify-end' : 'justify-start')
                            }`}
                          >
                            <div
                              className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm ${
                                message.sender_type === 'customer'
                                  ? 'bg-deta-green text-white'
                                  : 'bg-white border border-slate-200 text-slate-800'
                              }`}
                            >
                              <p className="text-xs sm:text-sm font-medium mb-1">
                                {message.sender_name}
                                <span className="text-xs opacity-75 ms-2">
                                  {new Date(message.created_at).toLocaleTimeString(
                                    isRTL ? 'ar' : 'en',
                                    { hour: '2-digit', minute: '2-digit' }
                                  )}
                                </span>
                              </p>
                              <p className="text-sm break-words">{message.message}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Send Message */}
                    <div className="border-t border-slate-100 pt-4">
                      <div className="flex gap-2">
                        <Textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder={isRTL ? 'اكتب رسالتك...' : 'Type your message...'}
                          className="flex-1 rounded-2xl"
                          rows={2}
                        />
                        <Button
                          onClick={() => sendMessage.mutate()}
                          disabled={!newMessage.trim() || sendMessage.isPending}
                          size="sm"
                          className="self-end rounded-full bg-deta-green hover:bg-deta-green/90 h-10 w-10 p-0 shrink-0"
                        >
                          {sendMessage.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4 rtl:rotate-180" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={() => {
                  setFoundOrder(null);
                  setOrderNumber('');
                  setCustomerEmail('');
                }}
                variant="outline"
                className="w-full rounded-full"
              >
                {isRTL ? 'البحث عن طلب آخر' : 'Search Another Order'}
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderTracking;
