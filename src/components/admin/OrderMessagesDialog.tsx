
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Send, MessageCircle } from 'lucide-react';

interface OrderMessagesDialogProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface OrderMessage {
  id: string;
  sender_type: string;
  sender_name: string;
  message: string;
  created_at: string;
}

const OrderMessagesDialog = ({ orderId, isOpen, onClose }: OrderMessagesDialogProps) => {
  const { toast } = useToast();
  const { userProfile } = useAuth();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState('');

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['order-messages', orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('order_messages')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: isOpen && !!orderId
  });

  const sendMessage = useMutation({
    mutationFn: async () => {
      if (!newMessage.trim()) return;
      
      const { error } = await supabase
        .from('order_messages')
        .insert({
          order_id: orderId,
          sender_type: 'admin',
          sender_name: userProfile?.full_name || 'مشرف',
          message: newMessage.trim()
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-messages'] });
      setNewMessage('');
      toast({
        title: "تم الإرسال",
        description: "تم إرسال الرسالة بنجاح"
      });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "حدث خطأ في إرسال الرسالة",
        variant: "destructive"
      });
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            رسائل الطلب
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-96">
          {/* Messages List */}
          <div className="flex-1 overflow-y-auto space-y-3 p-4 border rounded-lg bg-gray-50">
            {isLoading ? (
              <div className="text-center py-4">
                <Loader2 className="h-6 w-6 animate-spin mx-auto" />
              </div>
            ) : messages.length === 0 ? (
              <p className="text-gray-500 text-center py-4">لا توجد رسائل</p>
            ) : (
              messages.map((message: OrderMessage) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender_type === 'admin' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender_type === 'admin'
                        ? 'bg-deta-green text-white'
                        : 'bg-blue-500 text-white'
                    }`}
                  >
                    <p className="text-sm font-medium mb-1">
                      {message.sender_name}
                      <span className="text-xs opacity-75 mr-2">
                        {new Date(message.created_at).toLocaleTimeString('ar', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </p>
                    <p>{message.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Send Message */}
          <div className="border-t pt-4 mt-4">
            <div className="flex gap-2">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="اكتب رسالتك..."
                className="flex-1"
                rows={2}
              />
              <Button
                onClick={() => sendMessage.mutate()}
                disabled={!newMessage.trim() || sendMessage.isPending}
                size="sm"
                className="self-end"
              >
                {sendMessage.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderMessagesDialog;
