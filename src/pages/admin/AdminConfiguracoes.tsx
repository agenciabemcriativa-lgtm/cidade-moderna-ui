import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Save } from "lucide-react";
import type { Json } from "@/integrations/supabase/types";

interface FooterConfig {
  endereco?: string;
  telefone?: string;
  email?: string;
  horario?: string;
  whatsapp?: string;
  facebook?: string;
  instagram?: string;
}

interface Configuracao {
  id: string;
  chave: string;
  valor: Json;
}

export default function AdminConfiguracoes() {
  const queryClient = useQueryClient();
  
  const [footerForm, setFooterForm] = useState({
    endereco: "Praça Agamenon Magalhães, S/N, Centro - Ipubi/PE",
    telefone: "(87) 3881-1156",
    email: "contato@ipubi.pe.gov.br",
    horario: "Segunda a Sexta: 08h às 14h",
    whatsapp: "",
    facebook: "",
    instagram: "",
  });

  const { data: configs, isLoading } = useQuery({
    queryKey: ["admin-configs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("configuracoes")
        .select("*");
      if (error) throw error;
      return data as Configuracao[];
    },
  });

  useEffect(() => {
    if (configs) {
      const footerConfig = configs.find(c => c.chave === "footer");
      if (footerConfig && footerConfig.valor && typeof footerConfig.valor === 'object') {
        setFooterForm(prev => ({
          ...prev,
          ...(footerConfig.valor as FooterConfig)
        }));
      }
    }
  }, [configs]);

  const saveMutation = useMutation({
    mutationFn: async ({ chave, valor }: { chave: string; valor: FooterConfig }) => {
      const existing = configs?.find(c => c.chave === chave);
      if (existing) {
        const { error } = await supabase
          .from("configuracoes")
          .update({ valor: valor as unknown as Json })
          .eq("chave", chave);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("configuracoes")
          .insert([{ chave, valor: valor as unknown as Json }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-configs"] });
      toast.success("Configurações salvas!");
    },
    onError: () => toast.error("Erro ao salvar"),
  });

  const handleSaveFooter = () => {
    saveMutation.mutate({ chave: "footer", valor: footerForm });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">Configure informações gerais do portal</p>
        </div>

        {isLoading ? (
          <p>Carregando...</p>
        ) : (
          <Tabs defaultValue="footer">
            <TabsList>
              <TabsTrigger value="footer">Rodapé</TabsTrigger>
              <TabsTrigger value="contato">Contato</TabsTrigger>
              <TabsTrigger value="redes">Redes Sociais</TabsTrigger>
            </TabsList>

            <TabsContent value="footer" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Rodapé</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Endereço</Label>
                    <Textarea
                      value={footerForm.endereco}
                      onChange={(e) => setFooterForm({ ...footerForm, endereco: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Telefone</Label>
                      <Input
                        value={footerForm.telefone}
                        onChange={(e) => setFooterForm({ ...footerForm, telefone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>WhatsApp</Label>
                      <Input
                        value={footerForm.whatsapp}
                        onChange={(e) => setFooterForm({ ...footerForm, whatsapp: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        value={footerForm.email}
                        onChange={(e) => setFooterForm({ ...footerForm, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Horário de Funcionamento</Label>
                      <Input
                        value={footerForm.horario}
                        onChange={(e) => setFooterForm({ ...footerForm, horario: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button onClick={handleSaveFooter}>
                    <Save className="h-4 w-4 mr-2" /> Salvar Alterações
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contato" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informações de Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Telefone Principal</Label>
                      <Input
                        value={footerForm.telefone}
                        onChange={(e) => setFooterForm({ ...footerForm, telefone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email Principal</Label>
                      <Input
                        value={footerForm.email}
                        onChange={(e) => setFooterForm({ ...footerForm, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button onClick={handleSaveFooter}>
                    <Save className="h-4 w-4 mr-2" /> Salvar Alterações
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="redes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Redes Sociais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Facebook</Label>
                      <Input
                        value={footerForm.facebook}
                        onChange={(e) => setFooterForm({ ...footerForm, facebook: e.target.value })}
                        placeholder="https://facebook.com/..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Instagram</Label>
                      <Input
                        value={footerForm.instagram}
                        onChange={(e) => setFooterForm({ ...footerForm, instagram: e.target.value })}
                        placeholder="https://instagram.com/..."
                      />
                    </div>
                  </div>
                  <Button onClick={handleSaveFooter}>
                    <Save className="h-4 w-4 mr-2" /> Salvar Alterações
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AdminLayout>
  );
}
