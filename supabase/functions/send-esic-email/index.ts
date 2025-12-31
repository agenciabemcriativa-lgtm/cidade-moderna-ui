import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ESicEmailRequest {
  tipo: 'nova_solicitacao' | 'resposta' | 'prorrogacao' | 'recurso';
  destinatario_email: string;
  destinatario_nome: string;
  protocolo: string;
  assunto?: string;
  data_limite?: string;
  tipo_resposta?: string;
  conteudo_resposta?: string;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const getEmailContent = (data: ESicEmailRequest): { subject: string; html: string } => {
  const baseUrl = "https://ipubi.pe.gov.br";
  
  switch (data.tipo) {
    case 'nova_solicitacao':
      return {
        subject: `[e-SIC] Solicitação Registrada - Protocolo ${data.protocolo}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
              .header { background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); color: white; padding: 30px; text-align: center; }
              .header h1 { margin: 0; font-size: 24px; }
              .content { padding: 30px; background: #f9f9f9; }
              .protocol-box { background: #e8f4fd; border: 2px solid #1e3a5f; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
              .protocol-number { font-size: 28px; font-weight: bold; color: #1e3a5f; }
              .info-box { background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #1e3a5f; }
              .footer { background: #333; color: white; padding: 20px; text-align: center; font-size: 12px; }
              .button { display: inline-block; background: #1e3a5f; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🏛️ Prefeitura Municipal de Ipubi</h1>
              <p style="margin: 10px 0 0 0;">Serviço de Informação ao Cidadão - e-SIC</p>
            </div>
            <div class="content">
              <p>Prezado(a) <strong>${data.destinatario_nome}</strong>,</p>
              <p>Sua solicitação de acesso à informação foi registrada com sucesso em nosso sistema.</p>
              
              <div class="protocol-box">
                <p style="margin: 0 0 10px 0; color: #666;">Número do Protocolo:</p>
                <div class="protocol-number">${data.protocolo}</div>
                <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">Guarde este número para acompanhamento</p>
              </div>

              <div class="info-box">
                <p style="margin: 0;"><strong>📋 Assunto:</strong> ${data.assunto || 'Não informado'}</p>
                <p style="margin: 10px 0 0 0;"><strong>📅 Prazo para Resposta:</strong> ${data.data_limite ? formatDate(data.data_limite) : '20 dias úteis'}</p>
              </div>

              <p>De acordo com a Lei de Acesso à Informação (Lei nº 12.527/2011), o prazo para resposta é de até <strong>20 dias úteis</strong>, podendo ser prorrogado por mais 10 dias mediante justificativa.</p>

              <p>Você pode acompanhar o andamento da sua solicitação através do portal:</p>
              <center>
                <a href="${baseUrl}/transparencia/e-sic/consultar" class="button">Consultar Solicitação</a>
              </center>
            </div>
            <div class="footer">
              <p>Este é um e-mail automático do Sistema e-SIC da Prefeitura de Ipubi.</p>
              <p>Em caso de dúvidas, entre em contato: sic@ipubi.pe.gov.br</p>
            </div>
          </body>
          </html>
        `
      };

    case 'resposta':
      return {
        subject: `[e-SIC] Sua Solicitação foi Respondida - Protocolo ${data.protocolo}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
              .header { background: linear-gradient(135deg, #166534 0%, #22c55e 100%); color: white; padding: 30px; text-align: center; }
              .header h1 { margin: 0; font-size: 24px; }
              .content { padding: 30px; background: #f9f9f9; }
              .protocol-box { background: #dcfce7; border: 2px solid #166534; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
              .protocol-number { font-size: 24px; font-weight: bold; color: #166534; }
              .response-box { background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #22c55e; }
              .footer { background: #333; color: white; padding: 20px; text-align: center; font-size: 12px; }
              .button { display: inline-block; background: #166534; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
              .status-badge { display: inline-block; background: #166534; color: white; padding: 5px 15px; border-radius: 20px; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>✅ Solicitação Respondida</h1>
              <p style="margin: 10px 0 0 0;">e-SIC - Prefeitura de Ipubi</p>
            </div>
            <div class="content">
              <p>Prezado(a) <strong>${data.destinatario_nome}</strong>,</p>
              <p>Informamos que sua solicitação de acesso à informação foi respondida.</p>
              
              <div class="protocol-box">
                <p style="margin: 0 0 10px 0; color: #666;">Protocolo:</p>
                <div class="protocol-number">${data.protocolo}</div>
                <p style="margin: 10px 0 0 0;"><span class="status-badge">${data.tipo_resposta || 'Respondida'}</span></p>
              </div>

              ${data.conteudo_resposta ? `
              <div class="response-box">
                <p style="margin: 0 0 10px 0;"><strong>📝 Resumo da Resposta:</strong></p>
                <p style="margin: 0; white-space: pre-line;">${data.conteudo_resposta.substring(0, 500)}${data.conteudo_resposta.length > 500 ? '...' : ''}</p>
              </div>
              ` : ''}

              <p>Para visualizar a resposta completa e eventuais anexos, acesse o portal:</p>
              <center>
                <a href="${baseUrl}/transparencia/e-sic/consultar" class="button">Ver Resposta Completa</a>
              </center>

              <p style="margin-top: 20px; font-size: 14px; color: #666;">
                <strong>Direito a Recurso:</strong> Caso não concorde com a resposta, você pode interpor recurso em até 10 dias, conforme previsto na Lei de Acesso à Informação.
              </p>
            </div>
            <div class="footer">
              <p>Este é um e-mail automático do Sistema e-SIC da Prefeitura de Ipubi.</p>
              <p>Em caso de dúvidas, entre em contato: sic@ipubi.pe.gov.br</p>
            </div>
          </body>
          </html>
        `
      };

    case 'prorrogacao':
      return {
        subject: `[e-SIC] Prazo Prorrogado - Protocolo ${data.protocolo}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
              .header { background: linear-gradient(135deg, #ea580c 0%, #f97316 100%); color: white; padding: 30px; text-align: center; }
              .header h1 { margin: 0; font-size: 24px; }
              .content { padding: 30px; background: #f9f9f9; }
              .protocol-box { background: #fff7ed; border: 2px solid #ea580c; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
              .protocol-number { font-size: 24px; font-weight: bold; color: #ea580c; }
              .info-box { background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #f97316; }
              .footer { background: #333; color: white; padding: 20px; text-align: center; font-size: 12px; }
              .button { display: inline-block; background: #ea580c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>⏳ Prazo Prorrogado</h1>
              <p style="margin: 10px 0 0 0;">e-SIC - Prefeitura de Ipubi</p>
            </div>
            <div class="content">
              <p>Prezado(a) <strong>${data.destinatario_nome}</strong>,</p>
              <p>Informamos que o prazo para resposta da sua solicitação foi prorrogado.</p>
              
              <div class="protocol-box">
                <p style="margin: 0 0 10px 0; color: #666;">Protocolo:</p>
                <div class="protocol-number">${data.protocolo}</div>
              </div>

              <div class="info-box">
                <p style="margin: 0;"><strong>📅 Novo Prazo:</strong> ${data.data_limite ? formatDate(data.data_limite) : '+10 dias úteis'}</p>
                ${data.conteudo_resposta ? `<p style="margin: 15px 0 0 0;"><strong>📝 Justificativa:</strong><br>${data.conteudo_resposta}</p>` : ''}
              </div>

              <p>Conforme a Lei nº 12.527/2011, o prazo pode ser prorrogado por até 10 dias úteis, mediante justificativa expressa.</p>

              <center>
                <a href="${baseUrl}/transparencia/e-sic/consultar" class="button">Acompanhar Solicitação</a>
              </center>
            </div>
            <div class="footer">
              <p>Este é um e-mail automático do Sistema e-SIC da Prefeitura de Ipubi.</p>
              <p>Em caso de dúvidas, entre em contato: sic@ipubi.pe.gov.br</p>
            </div>
          </body>
          </html>
        `
      };

    default:
      return {
        subject: `[e-SIC] Atualização - Protocolo ${data.protocolo}`,
        html: `
          <p>Prezado(a) ${data.destinatario_nome},</p>
          <p>Houve uma atualização na sua solicitação de protocolo ${data.protocolo}.</p>
          <p>Acesse o portal para mais informações.</p>
        `
      };
  }
};

const handler = async (req: Request): Promise<Response> => {
  console.log("Received e-SIC email request");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: ESicEmailRequest = await req.json();
    console.log(`Processing e-SIC email type: ${data.tipo} to: ${data.destinatario_email}`);

    const { subject, html } = getEmailContent(data);

    const emailResponse = await resend.emails.send({
      from: "e-SIC Ipubi <naoresponda@ipubi.pe.gov.br>",
      to: [data.destinatario_email],
      subject,
      html,
    });

    console.log("e-SIC email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, ...emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-esic-email function:", error);
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
