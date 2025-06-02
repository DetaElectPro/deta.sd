import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface Country {
  id: string;
  name_ar: string;
  name_en: string;
}

interface DeliveryMethod {
  id: string;
  name_ar: string;
  name_en: string;
}

interface Port {
  id: string;
  name_ar: string;
  name_en: string;
}

interface SudanCity {
  id: string;
  name_ar: string;
  name_en: string;
}

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
  const [countries, setCountries] = useState<Country[]>([]);
  const [deliveryMethods, setDeliveryMethods] = useState<DeliveryMethod[]>([]);
  const [ports, setPorts] = useState<Port[]>([]);
  const [sudanCities, setSudanCities] = useState<SudanCity[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<DeliveryMethod | null>(null);
  const [selectedPort, setSelectedPort] = useState<Port | null>(null);
  const [selectedSudanCity, setSelectedSudanCity] = useState<SudanCity | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .order('name_en', { ascending: true });

      if (error) {
        console.error('Error fetching countries:', error);
      } else {
        setCountries(data || []);
      }
    };

    const fetchDeliveryMethods = async () => {
      const { data, error } = await supabase
        .from('delivery_methods')
        .select('*')
        .order('name_en', { ascending: true });

      if (error) {
        console.error('Error fetching delivery methods:', error);
      } else {
        setDeliveryMethods(data || []);
      }
    };

    const fetchPorts = async () => {
      const { data, error } = await supabase
        .from('ports')
        .select('*')
        .order('name_en', { ascending: true });

      if (error) {
        console.error('Error fetching ports:', error);
      } else {
        setPorts(data || []);
      }
    };

    const fetchSudanCities = async () => {
      const { data, error } = await supabase
        .from('sudan_cities')
        .select('*')
        .order('name_en', { ascending: true });

      if (error) {
        console.error('Error fetching Sudan cities:', error);
      } else {
        setSudanCities(data || []);
      }
    };

    fetchCountries();
    fetchDeliveryMethods();
    fetchPorts();
    fetchSudanCities();
  }, []);

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
        const emailData = {
          orderId: data.id,
          customerName: orderData.customer_name,
          customerEmail: orderData.customer_email,
          customerPhone: orderData.customer_phone,
          companyName: orderData.company_name,
          notes: orderData.notes,
          language: currentLanguage,
          country: selectedCountry?.name_ar || selectedCountry?.name_en,
          deliveryMethod: selectedDeliveryMethod?.name_ar || selectedDeliveryMethod?.name_en
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
      setSelectedCountry(null);
      setSelectedDeliveryMethod(null);
      setSelectedPort(null);
      setSelectedSudanCity(null);
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
      country_id: selectedCountry?.id,
      delivery_method_id: selectedDeliveryMethod?.id,
      port_id: selectedPort?.id,
      sudan_city_id: selectedSudanCity?.id,
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
        <Select onValueChange={(value) => {
          const country = countries.find(c => c.id === value);
          setSelectedCountry(country || null);
        }}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={isRTL ? "اختر دولة" : "Select a country"} />
          </SelectTrigger>
          <SelectContent>
            {countries.map(country => (
              <SelectItem key={country.id} value={country.id}>
                {isRTL ? country.name_ar : country.name_en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="deliveryMethod">{isRTL ? "طريقة التوصيل" : "Delivery Method"}</Label>
        <Select onValueChange={(value) => {
          const method = deliveryMethods.find(m => m.id === value);
          setSelectedDeliveryMethod(method || null);
        }}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={isRTL ? "اختر طريقة التوصيل" : "Select a delivery method"} />
          </SelectTrigger>
          <SelectContent>
            {deliveryMethods.map(method => (
              <SelectItem key={method.id} value={method.id}>
                {isRTL ? method.name_ar : method.name_en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="port">{isRTL ? "الميناء" : "Port"}</Label>
        <Select onValueChange={(value) => {
          const port = ports.find(p => p.id === value);
          setSelectedPort(port || null);
        }}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={isRTL ? "اختر ميناء" : "Select a port"} />
          </SelectTrigger>
          <SelectContent>
            {ports.map(port => (
              <SelectItem key={port.id} value={port.id}>
                {isRTL ? port.name_ar : port.name_en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="sudanCity">{isRTL ? "المدينة في السودان" : "City in Sudan"}</Label>
        <Select onValueChange={(value) => {
          const city = sudanCities.find(city => city.id === value);
          setSelectedSudanCity(city || null);
        }}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={isRTL ? "اختر مدينة" : "Select a city"} />
          </SelectTrigger>
          <SelectContent>
            {sudanCities.map(city => (
              <SelectItem key={city.id} value={city.id}>
                {isRTL ? city.name_ar : city.name_en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
