import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: 'contact' | 'calculator';
  name: string;
  phone: string;
  company?: string;
  description?: string;
  calculatorData?: {
    projectType: string;
    complexity: string;
    timeline: string;
    features: string[];
    estimatedPrice: {
      min: number;
      max: number;
    };
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const emailData: EmailRequest = await req.json();

    let subject = "";
    let htmlContent = "";

    if (emailData.type === 'calculator') {
      subject = "Новая заявка с калькулятора стоимости";
      htmlContent = `
        <h2>Заявка с калькулятора стоимости</h2>
        <p><strong>Имя:</strong> ${emailData.name}</p>
        <p><strong>Телефон:</strong> ${emailData.phone}</p>
        ${emailData.company ? `<p><strong>Компания:</strong> ${emailData.company}</p>` : ''}
        ${emailData.description ? `<p><strong>Описание:</strong> ${emailData.description}</p>` : ''}
        
        <h3>Результаты калькулятора:</h3>
        <p><strong>Тип проекта:</strong> ${emailData.calculatorData?.projectType}</p>
        <p><strong>Сложность:</strong> ${emailData.calculatorData?.complexity}</p>
        <p><strong>Сроки:</strong> ${emailData.calculatorData?.timeline}</p>
        <p><strong>Дополнительные функции:</strong> ${emailData.calculatorData?.features.join(', ')}</p>
        <p><strong>Оценочная стоимость:</strong> ${emailData.calculatorData?.estimatedPrice.min.toLocaleString()} - ${emailData.calculatorData?.estimatedPrice.max.toLocaleString()} руб.</p>
      `;
    } else {
      subject = "Новая заявка с формы обратной связи";
      htmlContent = `
        <h2>Заявка с формы обратной связи</h2>
        <p><strong>Имя:</strong> ${emailData.name}</p>
        <p><strong>Телефон:</strong> ${emailData.phone}</p>
        ${emailData.company ? `<p><strong>Компания:</strong> ${emailData.company}</p>` : ''}
        ${emailData.description ? `<p><strong>Описание проекта:</strong> ${emailData.description}</p>` : ''}
      `;
    }

    const emailResponse = await resend.emails.send({
      from: "noreply@resend.dev", // Используем домен по умолчанию
      to: ["romprogramist@gmail.com"], // Временно используем ваш email
      subject: subject,
      html: htmlContent,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-email function:", error);
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