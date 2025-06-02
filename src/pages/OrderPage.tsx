
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OrderForm from '@/components/OrderForm';
import { useLanguage } from '@/hooks/useLanguage';

const OrderPage = () => {
  const { t, currentLanguage } = useLanguage();
  const isRTL = currentLanguage === 'ar';

  return (
    <div className={`min-h-screen flex flex-col ${isRTL ? 'rtl' : 'ltr'}`}>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className={`text-center mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
            <h1 className="text-3xl font-bold mb-4">
              {isRTL ? 'إنشاء طلب جديد' : 'Create New Order'}
            </h1>
            <p className="text-gray-600">
              {isRTL 
                ? 'املأ النموذج أدناه لإنشاء طلب جديد مع تحديد طريقة التسليم المناسبة'
                : 'Fill out the form below to create a new order with appropriate delivery method'
              }
            </p>
          </div>
          <OrderForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderPage;
