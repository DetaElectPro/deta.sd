import { z } from "zod";

// Contact form validation schema
export const contactFormSchema = z.object({
  firstName: z
    .string()
    .min(1, "الاسم الأول مطلوب")
    .max(50, "الاسم الأول يجب ألا يتجاوز 50 حرف")
    .regex(/^[\u0600-\u06FFa-zA-Z\s]+$/, "الاسم يجب أن يحتوي على أحرف عربية أو إنجليزية فقط"),
  
  lastName: z
    .string()
    .min(1, "الاسم الأخير مطلوب")
    .max(50, "الاسم الأخير يجب ألا يتجاوز 50 حرف")
    .regex(/^[\u0600-\u06FFa-zA-Z\s]+$/, "الاسم يجب أن يحتوي على أحرف عربية أو إنجليزية فقط"),
  
  email: z
    .string()
    .min(1, "البريد الإلكتروني مطلوب")
    .email("يرجى إدخال بريد إلكتروني صحيح")
    .max(100, "البريد الإلكتروني يجب ألا يتجاوز 100 حرف"),
  
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\+]?[0-9\s\-\(\)]{7,15}$/.test(val),
      "يرجى إدخال رقم هاتف صحيح"
    ),
  
  company: z
    .string()
    .max(100, "اسم الشركة يجب ألا يتجاوز 100 حرف")
    .optional(),
  
  subject: z
    .string()
    .min(1, "موضوع الرسالة مطلوب")
    .max(200, "موضوع الرسالة يجب ألا يتجاوز 200 حرف"),
  
  message: z
    .string()
    .min(10, "الرسالة يجب أن تحتوي على 10 أحرف على الأقل")
    .max(1000, "الرسالة يجب ألا تتجاوز 1000 حرف")
});

// Newsletter subscription schema
export const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, "البريد الإلكتروني مطلوب")
    .email("يرجى إدخال بريد إلكتروني صحيح")
    .max(100, "البريد الإلكتروني يجب ألا يتجاوز 100 حرف")
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type NewsletterData = z.infer<typeof newsletterSchema>;

// Order form validation schema
export const orderFormSchema = z.object({
  customerName: z
    .string()
    .min(1, "الاسم مطلوب")
    .max(100, "الاسم يجب ألا يتجاوز 100 حرف")
    .regex(/^[\u0600-\u06FFa-zA-Z\s]+$/, "الاسم يجب أن يحتوي على أحرف عربية أو إنجليزية فقط"),

  customerEmail: z
    .string()
    .min(1, "البريد الإلكتروني مطلوب")
    .email("يرجى إدخال بريد إلكتروني صحيح")
    .max(100, "البريد الإلكتروني يجب ألا يتجاوز 100 حرف"),

  customerPhone: z
    .string()
    .min(1, "رقم الهاتف مطلوب")
    .max(20, "رقم الهاتف يجب ألا يتجاوز 20 رقم")
    .regex(/^[\+]?[0-9\s\-\(\)]{7,15}$/, "يرجى إدخال رقم هاتف صحيح"),

  countryId: z
    .string()
    .min(1, "يرجى اختيار الدولة"),

  cityId: z
    .string()
    .min(1, "يرجى اختيار المدينة"),

  portId: z
    .string()
    .optional(),

  companyName: z
    .string()
    .max(100, "اسم الشركة يجب ألا يتجاوز 100 حرف")
    .optional(),

  notes: z
    .string()
    .max(1000, "الملاحظات يجب ألا تتجاوز 1000 حرف")
    .optional(),

  productId: z
    .string()
    .min(1, "معرف المنتج مطلوب"),

  productName: z
    .string()
    .min(1, "اسم المنتج مطلوب")
});

export type OrderFormData = z.infer<typeof orderFormSchema>;
