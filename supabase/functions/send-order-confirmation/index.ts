
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderConfirmationRequest {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  companyName?: string;
  notes?: string;
  language: string;
  country?: string;
  deliveryMethod?: string;
}

const getEmailTemplate = (order: OrderConfirmationRequest, isArabic: boolean) => {
  const title = isArabic ? "تأكيد الطلب" : "Order Confirmation";
  const greeting = isArabic 
    ? `عزيزي/عزيزتي ${order.customerName}،` 
    : `Dear ${order.customerName},`;
  
  const thankYou = isArabic
    ? "شكراً لك على طلبك. تم استلام طلبك بنجاح وسيتم معالجته قريباً."
    : "Thank you for your order. Your order has been received successfully and will be processed soon.";
    
  const orderDetails = isArabic ? "تفاصيل الطلب:" : "Order Details:";
  const orderNumber = isArabic ? "رقم الطلب:" : "Order Number:";
  const customerInfo = isArabic ? "معلومات العميل:" : "Customer Information:";
  const name = isArabic ? "الاسم:" : "Name:";
  const phone = isArabic ? "الهاتف:" : "Phone:";
  const company = isArabic ? "الشركة:" : "Company:";
  const country = isArabic ? "الدولة:" : "Country:";
  const delivery = isArabic ? "طريقة التسليم:" : "Delivery Method:";
  const notes = isArabic ? "ملاحظات:" : "Notes:";
  const trackOrder = isArabic ? "تتبع الطلب:" : "Track Your Order:";
  const trackLink = isArabic 
    ? "يمكنك تتبع حالة طلبك من خلال الرابط التالي:" 
    : "You can track your order status using the following link:";
  const support = isArabic ? "الدعم الفني:" : "Support:";
  const supportText = isArabic
    ? "إذا كان لديك أي استفسارات، يرجى التواصل معنا."
    : "If you have any questions, please don't hesitate to contact us.";
  const thanks = isArabic ? "شكراً لك،" : "Thank you,";
  const teamName = isArabic ? "فريق ديتا" : "DETA Team";

  return `
    <!DOCTYPE html>
    <html dir="${isArabic ? 'rtl' : 'ltr'}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body {
          font-family: ${isArabic ? '"Segoe UI", Tahoma, Arial, sans-serif' : 'Arial, sans-serif'};
          line-height: 1.6;
          color: #333;
          direction: ${isArabic ? 'rtl' : 'ltr'};
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .header {
          background-color: #059669;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background-color: white;
          padding: 30px;
          border-radius: 0 0 8px 8px;
        }
        .order-details {
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 6px;
          margin: 20px 0;
        }
        .detail-row {
          margin: 10px 0;
          padding: 8px 0;
          border-bottom: 1px solid #e9ecef;
        }
        .detail-label {
          font-weight: bold;
          color: #059669;
        }
        .track-button {
          display: inline-block;
          background-color: #059669;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e9ecef;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${title}</h1>
        </div>
        <div class="content">
          <p>${greeting}</p>
          <p>${thankYou}</p>
          
          <div class="order-details">
            <h3>${orderDetails}</h3>
            <div class="detail-row">
              <span class="detail-label">${orderNumber}</span> ${order.orderId}
            </div>
            <div class="detail-row">
              <span class="detail-label">${name}</span> ${order.customerName}
            </div>
            <div class="detail-row">
              <span class="detail-label">${phone}</span> ${order.customerPhone}
            </div>
            ${order.companyName ? `
              <div class="detail-row">
                <span class="detail-label">${company}</span> ${order.companyName}
              </div>
            ` : ''}
            ${order.country ? `
              <div class="detail-row">
                <span class="detail-label">${country}</span> ${order.country}
              </div>
            ` : ''}
            ${order.deliveryMethod ? `
              <div class="detail-row">
                <span class="detail-label">${delivery}</span> ${order.deliveryMethod}
              </div>
            ` : ''}
            ${order.notes ? `
              <div class="detail-row">
                <span class="detail-label">${notes}</span> ${order.notes}
              </div>
            ` : ''}
          </div>
          
          <h3>${trackOrder}</h3>
          <p>${trackLink}</p>
          <a href="${Deno.env.get('SITE_URL') || 'https://your-site.com'}/track-order" class="track-button">
            ${isArabic ? 'تتبع الطلب' : 'Track Order'}
          </a>
          
          <div class="footer">
            <p>${support}</p>
            <p>${supportText}</p>
            <p>${thanks}<br><strong>${teamName}</strong></p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const order: OrderConfirmationRequest = await req.json();
    const isArabic = order.language === 'ar';

    const emailHtml = getEmailTemplate(order, isArabic);
    const subject = isArabic 
      ? `تأكيد الطلب رقم ${order.orderId}` 
      : `Order Confirmation #${order.orderId}`;

    const emailResponse = await resend.emails.send({
      from: "DETA <orders@deta.com>",
      to: [order.customerEmail],
      subject: subject,
      html: emailHtml,
    });

    console.log("Order confirmation email sent:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending order confirmation:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
