import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { usePageTracking } from '@/hooks/usePageTracking';
import { useCountries } from '@/hooks/useCountries';
import { useCities } from '@/hooks/useCities';
import { usePorts } from '@/hooks/usePorts';
import { useOrderSubmission } from '@/hooks/useOrderSubmission';
import { orderFormSchema, OrderFormData } from '@/lib/validationSchemas';
import { Loader2, Package, User, Mail, Phone, MapPin, Building, FileText } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const OrderPage = () => {
  usePageTracking();
  const { isRTL, currentLanguage } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedCountryId, setSelectedCountryId] = useState<string>('');

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      countryId: '',
      cityId: '',
      portId: '',
      companyName: '',
      notes: ''
    }
  });

  // Fetch data
  const { data: countries = [], isLoading: countriesLoading } = useCountries();
  const { data: cities = [], isLoading: citiesLoading } = useCities(selectedCountryId);
  const { data: ports = [], isLoading: portsLoading } = usePorts(selectedCountryId);
  const orderSubmission = useOrderSubmission();

  // Handle country selection
  const handleCountryChange = (countryId: string) => {
    setSelectedCountryId(countryId);
    form.setValue('countryId', countryId);
    form.setValue('cityId', '');
    form.setValue('portId', '');
  };

  const onSubmit = async (data: OrderFormData) => {
    try {
      const orderData = {
        ...data,
        languageCode: currentLanguage
      };

      const result = await orderSubmission.mutateAsync(orderData);
      
      toast({
        title: isRTL ? "تم إرسال الطلب بنجاح" : "Order submitted successfully",
        description: isRTL ? "سيتم التواصل معك قريباً" : "We will contact you soon"
      });

      // Navigate to confirmation page with order ID
      navigate(`/order-confirmation?id=${result.id}`);
    } catch (error) {
      console.error('Error submitting order:', error);
      toast({
        title: isRTL ? "خطأ في إرسال الطلب" : "Error submitting order",
        description: isRTL ? "يرجى المحاولة مرة أخرى" : "Please try again",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-center">
                <Package className="h-6 w-6" />
                {isRTL ? 'استلام طلب جديد' : 'New Order Request'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Customer Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {isRTL ? 'معلومات العميل' : 'Customer Information'}
                    </h3>
                    
                    <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {isRTL ? 'الاسم الكامل' : 'Full Name'}
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={isRTL ? 'أدخل اسمك الكامل' : 'Enter your full name'} 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="customerEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {isRTL ? 'البريد الإلكتروني' : 'Email Address'}
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="email"
                              placeholder={isRTL ? 'أدخل بريدك الإلكتروني' : 'Enter your email'} 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="customerPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {isRTL ? 'رقم الهاتف' : 'Phone Number'}
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={isRTL ? 'أدخل رقم هاتفك' : 'Enter your phone number'} 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            {isRTL ? 'اسم الشركة (اختياري)' : 'Company Name (Optional)'}
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={isRTL ? 'أدخل اسم الشركة' : 'Enter company name'} 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Location Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      {isRTL ? 'معلومات الموقع' : 'Location Information'}
                    </h3>

                    <FormField
                      control={form.control}
                      name="countryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{isRTL ? 'الدولة' : 'Country'}</FormLabel>
                          <Select onValueChange={handleCountryChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={isRTL ? 'اختر الدولة' : 'Select country'} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {countriesLoading ? (
                                <SelectItem value="loading" disabled>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                </SelectItem>
                              ) : (
                                countries.map((country) => (
                                  <SelectItem key={country.id} value={country.id}>
                                    {isRTL ? country.name_ar : country.name_en}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cityId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{isRTL ? 'المدينة' : 'City'}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} disabled={!selectedCountryId}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={isRTL ? 'اختر المدينة' : 'Select city'} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {citiesLoading ? (
                                <SelectItem value="loading" disabled>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                </SelectItem>
                              ) : cities.length === 0 ? (
                                <SelectItem value="no-cities" disabled>
                                  {isRTL ? 'لا توجد مدن متاحة' : 'No cities available'}
                                </SelectItem>
                              ) : (
                                cities.map((city) => (
                                  <SelectItem key={city.id} value={city.id}>
                                    {isRTL ? city.name_ar : city.name_en}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="portId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{isRTL ? 'الميناء/المطار (اختياري)' : 'Port/Airport (Optional)'}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} disabled={!selectedCountryId}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={isRTL ? 'اختر الميناء أو المطار' : 'Select port or airport'} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {portsLoading ? (
                                <SelectItem value="loading" disabled>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                </SelectItem>
                              ) : ports.length === 0 ? (
                                <SelectItem value="no-ports" disabled>
                                  {isRTL ? 'لا توجد مواني متاحة' : 'No ports available'}
                                </SelectItem>
                              ) : (
                                ports.map((port) => (
                                  <SelectItem key={port.id} value={port.id}>
                                    {isRTL ? port.name_ar : port.name_en} ({port.port_type})
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Notes */}
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          {isRTL ? 'ملاحظات إضافية (اختياري)' : 'Additional Notes (Optional)'}
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder={isRTL ? 'أضف أي ملاحظات إضافية' : 'Add any additional notes'} 
                            rows={4}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full bg-deta-green hover:bg-deta-green/90" 
                    disabled={orderSubmission.isPending}
                  >
                    {orderSubmission.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        {isRTL ? 'جاري الإرسال...' : 'Submitting...'}
                      </>
                    ) : (
                      <>
                        <Package className="h-4 w-4 mr-2" />
                        {isRTL ? 'إرسال الطلب' : 'Submit Order'}
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderPage;
