import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/hooks/useLanguage';
import { useOrderDetails } from '@/hooks/useOrderDetails';
import { 
  ArrowLeft, 
  Package, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  FileText, 
  ShoppingCart,
  Loader2
} from 'lucide-react';

const OrderDetailsView = () => {
  const { id } = useParams<{ id: string }>();
  const { isRTL } = useLanguage();
  
  const { data: order, isLoading, error } = useOrderDetails(id);

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
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-blue-500';
      case 'shipped': return 'bg-purple-500';
      case 'delivered': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ms-2">{isRTL ? 'جاري التحميل...' : 'Loading...'}</span>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">
          {isRTL ? 'لم يتم العثور على الطلب' : 'Order not found'}
        </p>
        <Link to="/admin/orders">
          <Button>
            {isRTL ? 'العودة للطلبات' : 'Back to Orders'}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 min-w-0" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-4 min-w-0">
          <Link to="/admin/orders">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 me-2" />
              {isRTL ? 'العودة' : 'Back'}
            </Button>
          </Link>
          <h1 className="text-2xl font-bold truncate">
            {isRTL ? 'تفاصيل الطلب' : 'Order Details'}
          </h1>
        </div>
        <Badge className={`text-white shrink-0 ${getStatusColor(order.status)}`}>
          {getStatusText(order.status)}
        </Badge>
      </div>

      {/* Order Info */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Package className="h-5 w-5 shrink-0" />
            {isRTL ? 'معلومات الطلب' : 'Order Information'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="min-w-0">
              <p className="font-medium">{isRTL ? 'رقم الطلب:' : 'Order ID:'}</p>
              <p className="text-gray-600 font-mono text-sm break-all">{order.id}</p>
            </div>
            <div>
              <p className="font-medium">{isRTL ? 'تاريخ الطلب:' : 'Order Date:'}</p>
              <p className="text-gray-600">
                {new Date(order.created_at).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
              </p>
            </div>
            <div>
              <p className="font-medium">{isRTL ? 'آخر تحديث:' : 'Last Updated:'}</p>
              <p className="text-gray-600">
                {new Date(order.updated_at).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
              </p>
            </div>
            <div>
              <p className="font-medium">{isRTL ? 'إجمالي المبلغ:' : 'Total Amount:'}</p>
              <p className="text-gray-600 font-semibold">
                {order.total_amount ? `$${order.total_amount.toFixed(2)}` : isRTL ? 'غير محدد' : 'Not specified'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Information */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <User className="h-5 w-5 shrink-0" />
            {isRTL ? 'معلومات العميل' : 'Customer Information'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 min-w-0">
              <User className="h-4 w-4 shrink-0 text-gray-500" />
              <div className="min-w-0">
                <p className="font-medium">{isRTL ? 'الاسم:' : 'Name:'}</p>
                <p className="text-gray-600 truncate">{order.customer_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <Mail className="h-4 w-4 shrink-0 text-gray-500" />
              <div className="min-w-0">
                <p className="font-medium">{isRTL ? 'البريد الإلكتروني:' : 'Email:'}</p>
                <p className="text-gray-600 truncate break-all max-w-full">{order.customer_email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <Phone className="h-4 w-4 shrink-0 text-gray-500" />
              <div className="min-w-0">
                <p className="font-medium">{isRTL ? 'الهاتف:' : 'Phone:'}</p>
                <p className="text-gray-600 truncate" dir="ltr">{order.customer_phone}</p>
              </div>
            </div>
            {order.company_name && (
              <div className="flex items-center gap-2 min-w-0">
                <Building className="h-4 w-4 shrink-0 text-gray-500" />
                <div className="min-w-0">
                  <p className="font-medium">{isRTL ? 'الشركة:' : 'Company:'}</p>
                  <p className="text-gray-600 truncate">{order.company_name}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Location Information */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <MapPin className="h-5 w-5 shrink-0" />
            {isRTL ? 'معلومات الموقع' : 'Location Information'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {order.countries && (
              <div>
                <p className="font-medium">{isRTL ? 'الدولة:' : 'Country:'}</p>
                <p className="text-gray-600">
                  {isRTL ? order.countries.name_ar : order.countries.name_en}
                </p>
              </div>
            )}
            {order.cities && (
              <div>
                <p className="font-medium">{isRTL ? 'المدينة:' : 'City:'}</p>
                <p className="text-gray-600">
                  {isRTL ? order.cities.name_ar : order.cities.name_en}
                </p>
              </div>
            )}
            {order.ports && (
              <div>
                <p className="font-medium">{isRTL ? 'الميناء/المطار:' : 'Port/Airport:'}</p>
                <p className="text-gray-600">
                  {isRTL ? order.ports.name_ar : order.ports.name_en}
                </p>
              </div>
            )}
            {order.delivery_methods && (
              <div>
                <p className="font-medium">{isRTL ? 'طريقة التسليم:' : 'Delivery Method:'}</p>
                <p className="text-gray-600">
                  {isRTL ? order.delivery_methods.name_ar : order.delivery_methods.name_en}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      {order.order_items && order.order_items.length > 0 && (
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <ShoppingCart className="h-5 w-5 shrink-0" />
              {isRTL ? 'المنتجات المطلوبة' : 'Ordered Products'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 min-w-0">
              {order.order_items.map((item, index) => (
                <div key={item.id} className="border rounded-lg p-4 overflow-hidden">
                  <div className="flex flex-wrap items-start gap-4">
                    {item.product.image_url && (
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-16 h-16 shrink-0 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg">{item.product.name}</h3>
                      {item.product.description && (
                        <p className="text-gray-600 text-sm mt-1">{item.product.description}</p>
                      )}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                        <div>
                          <p className="font-medium">{isRTL ? 'الكمية:' : 'Quantity:'}</p>
                          <p className="text-gray-600">{item.quantity}</p>
                        </div>
                        <div>
                          <p className="font-medium">{isRTL ? 'الوحدة:' : 'Unit:'}</p>
                          <p className="text-gray-600">
                            {isRTL ? item.unit.name_ar : item.unit.name_en}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">{isRTL ? 'سعر الوحدة:' : 'Unit Price:'}</p>
                          <p className="text-gray-600">${item.unit_price?.toFixed(2) || '0.00'}</p>
                        </div>
                        <div>
                          <p className="font-medium">{isRTL ? 'الإجمالي:' : 'Total:'}</p>
                          <p className="text-gray-600 font-semibold">
                            ${item.total_price?.toFixed(2) || '0.00'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < order.order_items.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {order.notes && (
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <FileText className="h-5 w-5 shrink-0" />
              {isRTL ? 'ملاحظات العميل' : 'Customer Notes'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap break-words">{order.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-4">
        <Link to={`/track-order?id=${order.id}&email=${order.customer_email}`} target="_blank">
          <Button variant="outline">
            <Package className="h-4 w-4 me-2" />
            {isRTL ? 'فتح صفحة التتبع' : 'Open Tracking Page'}
          </Button>
        </Link>
        <Link to="/admin/orders">
          <Button>
            {isRTL ? 'العودة للطلبات' : 'Back to Orders'}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderDetailsView;
