import { useState } from "react";
import { AccessibilityBar } from "@/components/portal/AccessibilityBar";
import { TopBar } from "@/components/portal/TopBar";
import { Header } from "@/components/portal/Header";
import { Footer } from "@/components/portal/Footer";
import { Breadcrumbs } from "@/components/portal/Breadcrumbs";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const contactSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  email: z.string().email("E-mail inválido").max(255),
  telefone: z.string().optional(),
  assunto: z.string().min(3, "Assunto deve ter pelo menos 3 caracteres").max(200),
  mensagem: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres").max(2000),
});

export default function ContatoPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    assunto: "",
    mensagem: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      contactSchema.parse(formData);
      
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: formData,
      });

      if (error) {
        throw new Error(error.message || 'Erro ao enviar mensagem');
      }
      
      toast({
        title: "Mensagem enviada!",
        description: "Sua mensagem foi enviada com sucesso. Você receberá uma confirmação por e-mail.",
      });
      
      setFormData({ nome: "", email: "", telefone: "", assunto: "", mensagem: "" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Erro de validação",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/prefeituradeipubi", label: "Facebook", color: "bg-blue-600 hover:bg-blue-700" },
    { icon: Instagram, href: "https://www.instagram.com/prefeituraipubi/", label: "Instagram", color: "bg-gradient-to-br from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AccessibilityBar />
      <TopBar />
      <Header />
      
      <main className="flex-grow">
        {/* Breadcrumbs */}
        <div className="bg-gradient-to-r from-primary to-primary/90">
          <div className="container">
            <Breadcrumbs items={[{ label: "Contato" }]} variant="light" />
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary via-primary/90 to-secondary py-16">
          <div className="container">
            <div className="text-center text-primary-foreground">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Contato</h1>
              <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
                Entre em contato conosco. Estamos prontos para atendê-lo.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-16">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="bg-card border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">Endereço</h3>
                  <p className="text-muted-foreground text-sm">
                    Praça Professor Agamanon Magalhães, 56, Centro,<br />
                    Ipubi-PE - CEP: 56.260-000
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">Telefone</h3>
                  <p className="text-muted-foreground text-sm">
                    <a href="tel:+558738811156" className="hover:text-primary transition-colors">
                      (87) 3881-1156
                    </a>
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">Horário de Atendimento</h3>
                  <p className="text-muted-foreground text-sm">
                    Segunda a sexta-feira<br />
                    das 8h às 12h e das 14h às 17h
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Contact Form */}
              <Card className="bg-card border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary" />
                    Envie sua mensagem
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nome">Nome completo *</Label>
                        <Input
                          id="nome"
                          name="nome"
                          value={formData.nome}
                          onChange={handleChange}
                          placeholder="Seu nome"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="seu@email.com"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="telefone">Telefone</Label>
                        <Input
                          id="telefone"
                          name="telefone"
                          value={formData.telefone}
                          onChange={handleChange}
                          placeholder="(00) 00000-0000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="assunto">Assunto *</Label>
                        <Input
                          id="assunto"
                          name="assunto"
                          value={formData.assunto}
                          onChange={handleChange}
                          placeholder="Assunto da mensagem"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mensagem">Mensagem *</Label>
                      <Textarea
                        id="mensagem"
                        name="mensagem"
                        value={formData.mensagem}
                        onChange={handleChange}
                        placeholder="Digite sua mensagem..."
                        rows={5}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      <Send className="w-4 h-4 mr-2" />
                      {isSubmitting ? "Enviando..." : "Enviar mensagem"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Map & Social */}
              <div className="space-y-6">
                {/* Google Maps */}
                <Card className="bg-card border-none shadow-lg overflow-hidden">
                  <div className="aspect-video">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15798.088095254095!2d-40.14892!3d-7.65456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7a60e5f8b5f5f5f%3A0x1234567890abcdef!2sIpubi%2C%20PE!5e0!3m2!1spt-BR!2sbr!4v1234567890"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Localização da Prefeitura de Ipubi"
                    />
                  </div>
                </Card>

                {/* Social Media */}
                <Card className="bg-card border-none shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">Redes Sociais</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4">
                      Acompanhe nossas redes sociais e fique por dentro das novidades.
                    </p>
                    <div className="flex gap-3">
                      {socialLinks.map((social) => (
                        <a
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${social.color} text-white w-12 h-12 rounded-full flex items-center justify-center transition-all transform hover:scale-110`}
                          aria-label={social.label}
                        >
                          <social.icon className="w-5 h-5" />
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
