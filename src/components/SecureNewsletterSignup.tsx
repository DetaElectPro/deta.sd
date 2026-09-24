
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { newsletterSchema, type NewsletterData } from "@/lib/validationSchemas";

const SecureNewsletterSignup = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterData>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "تم الاشتراك بنجاح",
        description: "شكراً لاشتراككم في نشرتنا الإخبارية",
      });
      
      reset();
    } catch (error) {
      console.error("Newsletter signup error:", error);
      toast({
        title: "خطأ في الاشتراك",
        description: "يرجى المحاولة مرة أخرى لاحقاً",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3 sm:gap-4" noValidate={false}>
      <div className="flex-1">
        <Input
          type="email"
          placeholder="أدخل بريدك الإلكتروني"
          {...register("email")}
          maxLength={100}
          aria-invalid={errors.email ? true : undefined}
          className={`rounded-full bg-white/95 border-white/40 text-slate-900 placeholder:text-slate-400 focus-visible:ring-deta-gold ${errors.email ? "border-red-500" : ""}`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1 text-start">{errors.email.message}</p>
        )}
      </div>
      <Button 
        type="submit" 
        className="bg-deta-gold hover:bg-deta-gold/90 text-emerald-950 font-semibold rounded-full px-6 shrink-0"
        disabled={isSubmitting}
      >
        <Mail className="w-4 h-4 me-2" />
        {isSubmitting ? "جاري الاشتراك..." : "اشترك"}
      </Button>
    </form>
  );
};

export default SecureNewsletterSignup;
