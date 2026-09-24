
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, AlertCircle, MailCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { contactFormSchema, type ContactFormData } from "@/lib/validationSchemas";
import { useLanguage } from "@/hooks/useLanguage";
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
  const { t } = useLanguage();

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
    <Card className="border border-slate-100 shadow-lg rounded-3xl overflow-hidden">
      <div className="bg-gradient-to-bl from-emerald-950 via-deta-green to-deta-green-light px-6 sm:px-8 py-6 sm:py-7">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 border border-white/25 text-white mb-3">
          <MailCheck className="h-5 w-5" />
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-white arabic-heading">
          أرسل لنا رسالة
        </h2>
        <p className="text-white/85 text-sm sm:text-base mt-1">
          {t('contact.subtitle')}
        </p>
      </div>
      <CardContent className="p-5 sm:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('contact.firstName')} *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="أدخل اسمك الأول" 
                        {...field}
                        maxLength={50}
                        className="rounded-xl"
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
                    <FormLabel>{t('contact.lastName')} *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="أدخل اسمك الأخير" 
                        {...field}
                        maxLength={50}
                        className="rounded-xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('contact.email')} *</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="أدخل بريدك الإلكتروني" 
                        {...field}
                        maxLength={100}
                        className="rounded-xl"
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
                    <FormLabel>{t('contact.phone')}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="أدخل رقم هاتفك" 
                        {...field}
                        maxLength={15}
                        className="rounded-xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contact.company')}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="أدخل اسم شركتك أو مؤسستك" 
                      {...field}
                      maxLength={100}
                      className="rounded-xl"
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
                  <FormLabel>{t('contact.subject')} *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="أدخل موضوع رسالتك" 
                      {...field}
                      maxLength={200}
                      className="rounded-xl"
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
                  <FormLabel>{t('contact.message')} *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="أدخل تفاصيل رسالتك أو استفسارك"
                      rows={6}
                      {...field}
                      maxLength={1000}
                      className="rounded-2xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-deta-green hover:bg-deta-green/90 rounded-full shadow-md" 
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "جاري الإرسال..." : "إرسال الرسالة"}
              <Send className="w-4 h-4 me-2 rtl:rotate-180" />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SecureContactForm;
