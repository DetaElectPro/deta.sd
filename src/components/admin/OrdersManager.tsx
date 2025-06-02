import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, Edit, Trash2, MessageCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import OrderMessagesDialog from './OrderMessagesDialog';

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  company_name?: string;
  status: string;
  total_amount?: number;
  created_at: string;
  countries?: { name_ar: string; name_en: string };
  delivery_methods?: { name_ar: string; name_en: string };
  ports?: { name_ar: string; name_en: string };
  sudan_cities?: { name_ar: string; name_en: string };
  notes?: string;
}

const OrdersManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [messagesDialogOpen, setMessagesDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders', statusFilter, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('orders')
        .select(`
          *,
          countries(name_ar, name_en),
          delivery_methods(name_ar, name_en),
          ports(name_ar, name_en),
          sudan_cities(name_ar, name_en)
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (searchTerm) {
        query = query.or(`customer_name.ilike.%${searchTerm}%,customer_email.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const updateOrderStatus = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: "تم التحديث",
        description: "تم تحديث حالة الطلب بنجاح"
      });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحديث حالة الطلب",
        variant: "destructive"
      });
    }
  });

  const deleteOrder = useMutation({
    mutationFn: async (orderId: string) => {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: "تم الحذف",
        description: "تم حذف الطلب بنجاح"
      });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "حدث خطأ في حذف الطلب",
        variant: "destructive"
      });
    }
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-blue-500';
      case 'shipped': return 'bg-purple-500';
      case 'delivered': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'في الانتظار';
      case 'confirmed': return 'مؤكد';
      case 'shipped': return 'تم الشحن';
      case 'delivered': return 'تم التسليم';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  const openMessagesDialog = (orderId: string) => {
    setSelectedOrderId(orderId);
    setMessagesDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة الطلبات</h2>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <Input
          placeholder="البحث بالاسم أو البريد الإلكتروني..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="تصفية حسب الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="pending">في الانتظار</SelectItem>
            <SelectItem value="confirmed">مؤكد</SelectItem>
            <SelectItem value="shipped">تم الشحن</SelectItem>
            <SelectItem value="delivered">تم التسليم</SelectItem>
            <SelectItem value="cancelled">ملغي</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="font-semibold text-lg">{order.customer_name}</h3>
                    <Badge className={`text-white ${getStatusBadgeColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">البريد الإلكتروني:</span> {order.customer_email}
                    </div>
                    <div>
                      <span className="font-medium">الهاتف:</span> {order.customer_phone}
                    </div>
                    <div>
                      <span className="font-medium">تاريخ الطلب:</span> {new Date(order.created_at).toLocaleDateString('ar')}
                    </div>
                    {order.company_name && (
                      <div>
                        <span className="font-medium">الشركة:</span> {order.company_name}
                      </div>
                    )}
                    {order.countries && (
                      <div>
                        <span className="font-medium">الدولة:</span> {order.countries.name_ar}
                      </div>
                    )}
                    {order.delivery_methods && (
                      <div>
                        <span className="font-medium">طريقة التسليم:</span> {order.delivery_methods.name_ar}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openMessagesDialog(order.id)}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>تفاصيل الطلب</DialogTitle>
                      </DialogHeader>
                      {selectedOrder && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="font-medium">اسم العميل:</label>
                              <p>{selectedOrder.customer_name}</p>
                            </div>
                            <div>
                              <label className="font-medium">البريد الإلكتروني:</label>
                              <p>{selectedOrder.customer_email}</p>
                            </div>
                            <div>
                              <label className="font-medium">رقم الهاتف:</label>
                              <p>{selectedOrder.customer_phone}</p>
                            </div>
                            {selectedOrder.company_name && (
                              <div>
                                <label className="font-medium">اسم الشركة:</label>
                                <p>{selectedOrder.company_name}</p>
                              </div>
                            )}
                          </div>
                          
                          {selectedOrder.notes && (
                            <div>
                              <label className="font-medium">ملاحظات:</label>
                              <p className="mt-1 p-2 bg-gray-50 rounded">{selectedOrder.notes}</p>
                            </div>
                          )}

                          <div className="flex gap-2">
                            <Select
                              value={selectedOrder.status}
                              onValueChange={(value) => 
                                updateOrderStatus.mutate({ orderId: selectedOrder.id, status: value })
                              }
                            >
                              <SelectTrigger className="w-48">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">في الانتظار</SelectItem>
                                <SelectItem value="confirmed">مؤكد</SelectItem>
                                <SelectItem value="shipped">تم الشحن</SelectItem>
                                <SelectItem value="delivered">تم التسليم</SelectItem>
                                <SelectItem value="cancelled">ملغي</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (window.confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
                        deleteOrder.mutate(order.id);
                      }
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">لا توجد طلبات</p>
        </div>
      )}
    </div>
  );
};

export default OrdersManager;
