import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  nome: string;
  email: string;
  telefone?: string;
  assunto: string;
  mensagem: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Received contact form request");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { nome, email, telefone, assunto, mensagem }: ContactEmailRequest = await req.json();

    console.log("Processing contact form from:", email);

    // Validate required fields
    if (!nome || !email || !assunto || !mensagem) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ error: "Campos obrigatórios não preenchidos" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error("Invalid email format:", email);
      return new Response(
        JSON.stringify({ error: "E-mail inválido" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Send email to the municipality
    const emailResponse = await resend.emails.send({
      from: "Portal Ipubi <naoresponda@ipubi.pe.gov.br>",
      to: ["contato@ipubi.pe.gov.br"],
      reply_to: email,
      subject: `[Contato Site] ${assunto}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0d5c91; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #0d5c91; }
            .message-box { background: white; padding: 15px; border-left: 4px solid #0d5c91; margin-top: 10px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Nova Mensagem do Portal</h2>
            </div>
            <div class="content">
              <div class="field">
                <span class="label">Nome:</span><br>
                ${nome}
              </div>
              <div class="field">
                <span class="label">E-mail:</span><br>
                <a href="mailto:${email}">${email}</a>
              </div>
              ${telefone ? `
              <div class="field">
                <span class="label">Telefone:</span><br>
                ${telefone}
              </div>
              ` : ''}
              <div class="field">
                <span class="label">Assunto:</span><br>
                ${assunto}
              </div>
              <div class="field">
                <span class="label">Mensagem:</span>
                <div class="message-box">
                  ${mensagem.replace(/\n/g, '<br>')}
                </div>
              </div>
            </div>
            <div class="footer">
              <p>Esta mensagem foi enviada através do formulário de contato do Portal da Prefeitura de Ipubi.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    // Send confirmation email to the sender
    await resend.emails.send({
      from: "Prefeitura de Ipubi <naoresponda@ipubi.pe.gov.br>",
      to: [email],
      subject: "Recebemos sua mensagem - Prefeitura de Ipubi",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0d5c91; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Prefeitura de Ipubi</h2>
            </div>
            <div class="content">
              <p>Olá <strong>${nome}</strong>,</p>
              <p>Recebemos sua mensagem com o assunto "<strong>${assunto}</strong>" e em breve entraremos em contato.</p>
              <p>Agradecemos o seu contato!</p>
              <p>Atenciosamente,<br>
              <strong>Prefeitura Municipal de Ipubi</strong></p>
            </div>
            <div class="footer">
              <p>Praça Professor Agamanon Magalhães, 56, Centro, Ipubi-PE</p>
              <p>Telefone: (87) 3881-1156</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Confirmation email sent to:", email);

    return new Response(
      JSON.stringify({ success: true, message: "E-mail enviado com sucesso" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Erro ao enviar e-mail" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
