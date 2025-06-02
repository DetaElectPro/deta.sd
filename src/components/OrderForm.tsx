
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCountries, usePorts, useSudanCities, useDeliveryMethods } from '@/hooks/useCountries';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const orderSchema = z.object({
  customer_name: z.string().min(2, 'اسم العميل مطلوب'),
  customer_email: z.string().email('البريد الإلكتروني غير صحيح'),
  customer_phone: z.string().min(10, 'رقم الهاتف مطلوب'),
  company_name: z.string().optional(),
  country_id: z.string().optional(),
  delivery_method_id: z.string().min(1, 'طريقة التسليم مطلوبة'),
  port_id: z.string().optional(),
  sudan_city_id: z.string().optional(),
  notes: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

export const OrderForm = () => {
  const { currentLanguage } = useLanguage();
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<string>('');
  const [showPorts, setShowPorts] = useState(false);
  const [showSudanCities, setShowSudanCities] = useState(false);
  
  const { data: countries, isLoading: countriesLoading } = useCountries();
  const { data: ports, isLoading: portsLoading } = usePorts(selectedCountry);
  const { data: sudanCities, isLoading: citiesLoading } = useSudanCities();
  const { data: deliveryMethods, isLoading: deliveryLoading } = useDeliveryMethods();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
  });

  const watchedDeliveryMethod = watch('delivery_method_id');
  const watchedCountry = watch('country_id');

  useEffect(() => {
    if (deliveryMethods?.length > 0) {
      const selectedMethod = deliveryMethods.find(method => method.id === watchedDeliveryMethod);
      if (selectedMethod) {
        setShowPorts(!selectedMethod.is_local && selectedMethod.code === 'SEA');
        setShowSudanCities(selectedMethod.is_local);
      }
    }
  }, [watchedDeliveryMethod, deliveryMethods]);

  useEffect(() => {
    setSelectedCountry(watchedCountry || '');
  }, [watchedCountry]);

  const onSubmit = async (data: OrderFormData) => {
    try {
      console.log('Submitting order:', data);
      
      const { data: orderData, error } = await supabase
        .from('orders')
        .insert({
          customer_name: data.customer_name,
          customer_email: data.customer_email,
          customer_phone: data.customer_phone,
          company_name: data.company_name || null,
          country_id: data.country_id || null,
          delivery_method_id: data.delivery_method_id,
          port_id: data.port_id || null,
          sudan_city_id: data.sudan_city_id || null,
          notes: data.notes || null,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating order:', error);
        toast.error('حدث خطأ في إنشاء الطلب');
        return;
      }

      console.log('Order created successfully:', orderData);
      toast.success('تم إنشاء الطلب بنجاح');
      reset();
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('حدث خطأ غير متوقع');
    }
  };

  const isRTL = currentLanguage === 'ar';

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className={`text-2xl ${isRTL ? 'text-right' : 'text-left'}`}>
          {isRTL ? 'طلب جديد' : 'New Order'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
          {/* معلومات العميل */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {isRTL ? 'معلومات العميل' : 'Customer Information'}
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="customer_name">
                {isRTL ? 'اسم العميل *' : 'Customer Name *'}
              </Label>
              <Input
                id="customer_name"
                {...register('customer_name')}
                className={isRTL ? 'text-right' : 'text-left'}
                placeholder={isRTL ? 'أدخل اسم العميل' : 'Enter customer name'}
              />
              {errors.customer_name && (
                <p className="text-sm text-red-500">{errors.customer_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer_email">
                {isRTL ? 'البريد الإلكتروني *' : 'Email *'}
              </Label>
              <Input
                id="customer_email"
                type="email"
                {...register('customer_email')}
                className={isRTL ? 'text-right' : 'text-left'}
                placeholder={isRTL ? 'أدخل البريد الإلكتروني' : 'Enter email address'}
              />
              {errors.customer_email && (
                <p className="text-sm text-red-500">{errors.customer_email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer_phone">
                {isRTL ? 'رقم الهاتف *' : 'Phone Number *'}
              </Label>
              <Input
                id="customer_phone"
                {...register('customer_phone')}
                className={isRTL ? 'text-right' : 'text-left'}
                placeholder={isRTL ? 'أدخل رقم الهاتف' : 'Enter phone number'}
              />
              {errors.customer_phone && (
                <p className="text-sm text-red-500">{errors.customer_phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_name">
                {isRTL ? 'اسم الشركة (اختياري)' : 'Company Name (Optional)'}
              </Label>
              <Input
                id="company_name"
                {...register('company_name')}
                className={isRTL ? 'text-right' : 'text-left'}
                placeholder={isRTL ? 'أدخل اسم الشركة' : 'Enter company name'}
              />
            </div>
          </div>

          {/* معلومات التسليم */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {isRTL ? 'معلومات التسليم' : 'Delivery Information'}
            </h3>

            <div className="space-y-2">
              <Label>
                {isRTL ? 'طريقة التسليم *' : 'Delivery Method *'}
              </Label>
              <Select
                onValueChange={(value) => {
                  setValue('delivery_method_id', value);
                  setSelectedDeliveryMethod(value);
                }}
              >
                <SelectTrigger className={isRTL ? 'text-right' : 'text-left'}>
                  <SelectValue placeholder={isRTL ? 'اختر طريقة التسليم' : 'Select delivery method'} />
                </SelectTrigger>
                <SelectContent>
                  {deliveryMethods?.map((method) => (
                    <SelectItem key={method.id} value={method.id}>
                      {isRTL ? method.name_ar : method.name_en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.delivery_method_id && (
                <p className="text-sm text-red-500">{errors.delivery_method_id.message}</p>
              )}
            </div>

            {!showSudanCities && (
              <div className="space-y-2">
                <Label>
                  {isRTL ? 'الدولة' : 'Country'}
                </Label>
                <Select
                  onValueChange={(value) => setValue('country_id', value)}
                >
                  <SelectTrigger className={isRTL ? 'text-right' : 'text-left'}>
                    <SelectValue placeholder={isRTL ? 'اختر الدولة' : 'Select country'} />
                  </SelectTrigger>
                  <SelectContent>
                    {countries?.map((country) => (
                      <SelectItem key={country.id} value={country.id}>
                        {isRTL ? country.name_ar : country.name_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {showPorts && selectedCountry && (
              <div className="space-y-2">
                <Label>
                  {isRTL ? 'الميناء' : 'Port'}
                </Label>
                <Select
                  onValueChange={(value) => setValue('port_id', value)}
                >
                  <SelectTrigger className={isRTL ? 'text-right' : 'text-left'}>
                    <SelectValue placeholder={isRTL ? 'اختر الميناء' : 'Select port'} />
                  </SelectTrigger>
                  <SelectContent>
                    {ports?.map((port) => (
                      <SelectItem key={port.id} value={port.id}>
                        {isRTL ? port.name_ar : port.name_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {showSudanCities && (
              <div className="space-y-2">
                <Label>
                  {isRTL ? 'المدينة السودانية' : 'Sudan City'}
                </Label>
                <Select
                  onValueChange={(value) => setValue('sudan_city_id', value)}
                >
                  <SelectTrigger className={isRTL ? 'text-right' : 'text-left'}>
                    <SelectValue placeholder={isRTL ? 'اختر المدينة' : 'Select city'} />
                  </SelectTrigger>
                  <SelectContent>
                    {sudanCities?.map((city) => (
                      <SelectItem key={city.id} value={city.id}>
                        {isRTL ? `${city.name_ar} - ${city.state_ar}` : `${city.name_en} - ${city.state_en}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* ملاحظات */}
          <div className="space-y-2">
            <Label htmlFor="notes">
              {isRTL ? 'ملاحظات' : 'Notes'}
            </Label>
            <Textarea
              id="notes"
              {...register('notes')}
              className={isRTL ? 'text-right' : 'text-left'}
              placeholder={isRTL ? 'أدخل أي ملاحظات إضافية' : 'Enter additional notes'}
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? (isRTL ? 'جاري الإرسال...' : 'Submitting...') 
              : (isRTL ? 'إرسال الطلب' : 'Submit Order')
            }
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
