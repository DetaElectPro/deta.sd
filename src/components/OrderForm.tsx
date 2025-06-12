import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';
import { useCountries, usePorts, useCitiesByCountry, useDeliveryMethods } from '@/hooks/useCountries';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

import { SearchableSelect } from "@/components/ui/searchable-select"
import { Textarea } from "@/components/ui/textarea"



const OrderForm = () => {
  const { currentLanguage, isRTL } = useLanguage();
  const { toast } = useToast();
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: ''
  });
  const [notes, setNotes] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<string>('');
  const [selectedPort, setSelectedPort] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');

  // استخدام hooks للبيانات
  const { data: countries = [] } = useCountries();
  const { data: deliveryMethods = [] } = useDeliveryMethods();
  const { data: cities = [] } = useCitiesByCountry(selectedCountry || undefined);

  // تحديد نوع الميناء بناءً على طريقة التوصيل
  const getPortType = (deliveryMethodCode: string) => {
    switch (deliveryMethodCode) {
      case 'SEA': return 'sea';
      case 'AIR': return 'air';
      case 'LAND': return 'land';
      default: return undefined;
    }
  };

  const selectedDeliveryMethodData = deliveryMethods.find(dm => dm.id === selectedDeliveryMethod);
  const portType = selectedDeliveryMethodData ? getPortType(selectedDeliveryMethodData.code) : undefined;
  const { data: ports = [] } = usePorts(selectedCountry || undefined, portType);

  // إعادة تعيين الاختيارات عند تغيير الدولة
  useEffect(() => {
    if (selectedCountry) {
      setSelectedPort('');
      setSelectedCity('');
    }
  }, [selectedCountry]);

  // إعادة تعيين الميناء عند تغيير طريقة التوصيل
  useEffect(() => {
    if (selectedDeliveryMethod) {
      setSelectedPort('');
    }
  }, [selectedDeliveryMethod]);

  const submitOrder = useMutation({
    mutationFn: async (orderData: any) => {
      console.log('Submitting order:', orderData);

      // Add language to order data
      const orderWithLanguage = {
        ...orderData,
        language_code: currentLanguage
      };

      const { data, error } = await supabase
        .from('orders')
        .insert([orderWithLanguage])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Order created:', data);

      // Send confirmation email
      try {
        const selectedCountryData = countries.find(c => c.id === selectedCountry);
        const selectedDeliveryMethodData = deliveryMethods.find(dm => dm.id === selectedDeliveryMethod);

        const emailData = {
          orderId: data.id,
          customerName: orderData.customer_name,
          customerEmail: orderData.customer_email,
          customerPhone: orderData.customer_phone,
          companyName: orderData.company_name,
          notes: orderData.notes,
          language: currentLanguage,
          country: selectedCountryData ? (isRTL ? selectedCountryData.name_ar : selectedCountryData.name_en) : '',
          deliveryMethod: selectedDeliveryMethodData ? (isRTL ? selectedDeliveryMethodData.name_ar : selectedDeliveryMethodData.name_en) : ''
        };

        await fetch('/functions/v1/send-order-confirmation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailData)
        });

        console.log('Confirmation email sent');
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
        // Don't fail the order if email fails
      }

      return data;
    },
    onSuccess: (data) => {
      console.log('Order submitted successfully:', data);
      toast({
        title: isRTL ? "تم إرسال الطلب بنجاح" : "Order submitted successfully",
        description: isRTL ?
          `رقم الطلب: ${data.id}. سيتم التواصل معك قريباً.` :
          `Order ID: ${data.id}. We will contact you soon.`
      });
      // Reset form
      setCustomerInfo({
        name: '',
        email: '',
        phone: '',
        companyName: ''
      });
      setSelectedCountry('');
      setSelectedDeliveryMethod('');
      setSelectedPort('');
      setSelectedCity('');
      setNotes('');
    },
    onError: (error) => {
      console.error('Error submitting order:', error);
      toast({
        title: isRTL ? "خطأ في إرسال الطلب" : "Error submitting order",
        description: isRTL ? "حدث خطأ، يرجى المحاولة مرة أخرى" : "An error occurred, please try again",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const orderData = {
      customer_name: customerInfo.name,
      customer_email: customerInfo.email,
      customer_phone: customerInfo.phone,
      company_name: customerInfo.companyName,
      country_id: selectedCountry || null,
      delivery_method_id: selectedDeliveryMethod || null,
      port_id: selectedPort || null,
      city_id: selectedCity || null,
      notes: notes
    };

    submitOrder.mutate(orderData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6">
      <div>
        <Label htmlFor="name">{isRTL ? "الاسم" : "Name"}</Label>
        <Input
          type="text"
          id="name"
          value={customerInfo.name}
          onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="email">{isRTL ? "البريد الإلكتروني" : "Email"}</Label>
        <Input
          type="email"
          id="email"
          value={customerInfo.email}
          onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="phone">{isRTL ? "رقم الهاتف" : "Phone Number"}</Label>
        <Input
          type="tel"
          id="phone"
          value={customerInfo.phone}
          onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="companyName">{isRTL ? "اسم الشركة (اختياري)" : "Company Name (Optional)"}</Label>
        <Input
          type="text"
          id="companyName"
          value={customerInfo.companyName}
          onChange={(e) => setCustomerInfo({ ...customerInfo, companyName: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="country">{isRTL ? "الدولة" : "Country"}</Label>
        <SearchableSelect
          options={countries.map(country => ({
            value: country.id,
            label: isRTL ? country.name_ar : country.name_en,
            searchText: `${country.name_ar} ${country.name_en} ${country.code}`
          }))}
          value={selectedCountry}
          onValueChange={setSelectedCountry}
          placeholder={isRTL ? "اختر دولة..." : "Select a country..."}
          searchPlaceholder={isRTL ? "البحث عن دولة..." : "Search for country..."}
          emptyText={isRTL ? "لا توجد دول" : "No countries found"}
        />
      </div>

      <div>
        <Label htmlFor="deliveryMethod">{isRTL ? "طريقة التوصيل" : "Delivery Method"}</Label>
        <SearchableSelect
          options={deliveryMethods.map(method => ({
            value: method.id,
            label: isRTL ? method.name_ar : method.name_en,
            searchText: `${method.name_ar} ${method.name_en} ${method.code}`
          }))}
          value={selectedDeliveryMethod}
          onValueChange={setSelectedDeliveryMethod}
          placeholder={isRTL ? "اختر طريقة التوصيل..." : "Select delivery method..."}
          searchPlaceholder={isRTL ? "البحث عن طريقة التوصيل..." : "Search for delivery method..."}
          emptyText={isRTL ? "لا توجد طرق توصيل" : "No delivery methods found"}
        />
      </div>

      {selectedDeliveryMethod && ports.length > 0 && (
        <div>
          <Label htmlFor="port">
            {isRTL ?
              (portType === 'sea' ? "الميناء البحري" :
               portType === 'air' ? "المطار" :
               portType === 'land' ? "المنفذ البري" : "الميناء") :
              (portType === 'sea' ? "Sea Port" :
               portType === 'air' ? "Airport" :
               portType === 'land' ? "Land Border" : "Port")
            }
          </Label>
          <SearchableSelect
            options={ports.map(port => ({
              value: port.id,
              label: isRTL ? port.name_ar : port.name_en,
              searchText: `${port.name_ar} ${port.name_en} ${port.code} ${port.countries?.name_ar || ''} ${port.countries?.name_en || ''}`
            }))}
            value={selectedPort}
            onValueChange={setSelectedPort}
            placeholder={isRTL ? "اختر ميناء..." : "Select a port..."}
            searchPlaceholder={isRTL ? "البحث عن ميناء..." : "Search for port..."}
            emptyText={isRTL ? "لا توجد مواني" : "No ports found"}
          />
        </div>
      )}

      {selectedCountry && cities.length > 0 && (
        <div>
          <Label htmlFor="city">{isRTL ? "المدينة" : "City"}</Label>
          <SearchableSelect
            options={cities.map(city => ({
              value: city.id,
              label: isRTL ? city.name_ar : city.name_en,
              searchText: `${city.name_ar} ${city.name_en} ${city.state_ar} ${city.state_en}`
            }))}
            value={selectedCity}
            onValueChange={setSelectedCity}
            placeholder={isRTL ? "اختر مدينة..." : "Select a city..."}
            searchPlaceholder={isRTL ? "البحث عن مدينة..." : "Search for city..."}
            emptyText={isRTL ? "لا توجد مدن" : "No cities found"}
          />
        </div>
      )}

      <div>
        <Label htmlFor="notes">{isRTL ? "ملاحظات" : "Notes"}</Label>
        <Textarea
          id="notes"
          placeholder={isRTL ? "أدخل ملاحظاتك هنا..." : "Enter your notes here..."}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <Button type="submit" disabled={submitOrder.isPending}>
        {submitOrder.isPending ? (
          <>
            {isRTL ? "إرسال..." : "Submitting..."}
            <svg className="animate-spin h-5 w-5 ml-2" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
          </>
        ) : (
          isRTL ? "إرسال الطلب" : "Submit Order"
        )}
      </Button>
    </form>
  );
};

export default OrderForm;
