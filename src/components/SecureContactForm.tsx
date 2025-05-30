
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { contactFormSchema, type ContactFormData } from "@/lib/validationSchemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const SecureContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate form submission delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Secure form submission:", data);
      
      toast({
        title: "تم إرسال الرسالة بنجاح",
        description: "شكراً لتواصلكم معنا، سنرد عليكم في أقرب وقت ممكن",
      });
      
      form.reset();
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "خطأ في إرسال الرسالة",
        description: "يرجى المحاولة مرة أخرى لاحقاً",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-none shadow-lg">
      <CardContent className="p-8">
        <h2 className="text-3xl font-bold text-deta-green mb-6 arabic-heading">
          أرسل لنا رسالة
        </h2>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاسم الأول *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="أدخل اسمك الأول" 
                        {...field}
                        maxLength={50}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاسم الأخير *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="أدخل اسمك الأخير" 
                        {...field}
                        maxLength={50}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البريد الإلكتروني *</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="أدخل بريدك الإلكتروني" 
                      {...field}
                      maxLength={100}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رقم الهاتف</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="أدخل رقم هاتفك" 
                      {...field}
                      maxLength={15}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الشركة/المؤسسة</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="أدخل اسم شركتك أو مؤسستك" 
                      {...field}
                      maxLength={100}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>موضوع الرسالة *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="أدخل موضوع رسالتك" 
                      {...field}
                      maxLength={200}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الرسالة *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="أدخل تفاصيل رسالتك أو استفسارك"
                      rows={6}
                      {...field}
                      maxLength={1000}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-deta-green hover:bg-deta-green/90" 
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "جاري الإرسال..." : "إرسال الرسالة"}
              <Send className="w-4 h-4 mr-2" />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SecureContactForm;
