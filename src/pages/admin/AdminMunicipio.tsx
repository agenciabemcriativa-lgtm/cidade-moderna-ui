import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, MapPin, User } from "lucide-react";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

interface MunicipioItem {
  id: string;
  titulo: string;
  slug: string;
  ordem: number;
  ativo: boolean;
  conteudo?: string | null;
  foto_url?: string | null;
  nome_autoridade?: string | null;
  cargo?: string | null;
  telefone?: string | null;
  email?: string | null;
  endereco?: string | null;
}

export default function AdminMunicipio() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    titulo: "",
    slug: "",
    ordem: 0,
    ativo: true,
    conteudo: "",
    foto_url: "",
    nome_autoridade: "",
    cargo: "",
    telefone: "",
    email: "",
    endereco: "",
  });

  const { data: itens, isLoading } = useQuery({
    queryKey: ["municipio-itens-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("municipio_itens")
        .select("*")
        .order("ordem");
      if (error) throw error;
      return data as MunicipioItem[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from("municipio_itens").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["municipio-itens-admin"] });
      queryClient.invalidateQueries({ queryKey: ["municipio-itens"] });
      toast.success("Item criado com sucesso!");
      resetForm();
    },
    onError: () => toast.error("Erro ao criar item"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase.from("municipio_itens").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["municipio-itens-admin"] });
      queryClient.invalidateQueries({ queryKey: ["municipio-itens"] });
      toast.success("Item atualizado com sucesso!");
      resetForm();
    },
    onError: () => toast.error("Erro ao atualizar item"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("municipio_itens").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["municipio-itens-admin"] });
      queryClient.invalidateQueries({ queryKey: ["municipio-itens"] });
      toast.success("Item excluído com sucesso!");
    },
    onError: () => toast.error("Erro ao excluir item"),
  });

  const resetForm = () => {
    setFormData({
      titulo: "",
      slug: "",
      ordem: 0,
      ativo: true,
      conteudo: "",
      foto_url: "",
      nome_autoridade: "",
      cargo: "",
      telefone: "",
      email: "",
      endereco: "",
    });
    setEditingId(null);
    setDialogOpen(false);
  };

  const handleEdit = (item: MunicipioItem) => {
    setFormData({
      titulo: item.titulo,
      slug: item.slug,
      ordem: item.ordem ?? 0,
      ativo: item.ativo ?? true,
      conteudo: item.conteudo ?? "",
      foto_url: item.foto_url ?? "",
      nome_autoridade: item.nome_autoridade ?? "",
      cargo: item.cargo ?? "",
      telefone: item.telefone ?? "",
      email: item.email ?? "",
      endereco: item.endereco ?? "",
    });
    setEditingId(item.id);
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = formData.slug || formData.titulo.toLowerCase().replace(/\s+/g, "-").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const data = { ...formData, slug };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Município</h1>
            <p className="text-muted-foreground">Gerencie os itens do menu Município</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar Item" : "Novo Item"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Tabs defaultValue="basico" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basico">Básico</TabsTrigger>
                    <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
                    <TabsTrigger value="conteudo">Conteúdo</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basico" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="titulo">Título</Label>
                      <Input
                        id="titulo"
                        value={formData.titulo}
                        onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug (URL)</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="gerado-automaticamente"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="ordem">Ordem</Label>
                        <Input
                          id="ordem"
                          type="number"
                          value={formData.ordem}
                          onChange={(e) => setFormData({ ...formData, ordem: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-8">
                        <Switch
                          id="ativo"
                          checked={formData.ativo}
                          onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                        />
                        <Label htmlFor="ativo">Ativo</Label>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="detalhes" className="space-y-4 mt-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      Informações adicionais (opcional)
                    </p>
                    <div className="space-y-2">
                      <Label htmlFor="foto_url">URL da Imagem</Label>
                      <Input
                        id="foto_url"
                        value={formData.foto_url}
                        onChange={(e) => setFormData({ ...formData, foto_url: e.target.value })}
                        placeholder="https://exemplo.com/imagem.jpg"
                      />
                      {formData.foto_url && (
                        <div className="mt-2 w-32 h-24 bg-muted rounded-lg overflow-hidden">
                          <img src={formData.foto_url} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nome_autoridade">Nome (responsável)</Label>
                        <Input
                          id="nome_autoridade"
                          value={formData.nome_autoridade}
                          onChange={(e) => setFormData({ ...formData, nome_autoridade: e.target.value })}
                          placeholder="Ex: João da Silva"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cargo">Cargo</Label>
                        <Input
                          id="cargo"
                          value={formData.cargo}
                          onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                          placeholder="Ex: Coordenador"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="telefone">Telefone</Label>
                        <Input
                          id="telefone"
                          value={formData.telefone}
                          onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                          placeholder="(87) 3881-1156"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="contato@ipubi.pe.gov.br"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endereco">Endereço</Label>
                      <Input
                        id="endereco"
                        value={formData.endereco}
                        onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                        placeholder="Praça Agamenon Magalhães, S/N, Centro - Ipubi/PE"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="conteudo" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>Conteúdo da Página</Label>
                      <RichTextEditor
                        content={formData.conteudo}
                        onChange={(content) => setFormData({ ...formData, conteudo: content })}
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <Button type="submit" className="w-full">
                  {editingId ? "Atualizar" : "Criar"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Carregando...</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {itens?.map((item) => (
              <Card key={item.id} className={!item.ativo ? "opacity-60" : ""}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    {item.titulo}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm("Tem certeza que deseja excluir?")) {
                          deleteMutation.mutate(item.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {item.nome_autoridade && (
                    <div className="flex items-center gap-3 mb-3">
                      {item.foto_url ? (
                        <img src={item.foto_url} alt={item.nome_autoridade} className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                          <User className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-sm">{item.nome_autoridade}</p>
                        {item.cargo && <p className="text-xs text-muted-foreground">{item.cargo}</p>}
                      </div>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">Slug: {item.slug}</p>
                  <p className="text-sm text-muted-foreground">Ordem: {item.ordem}</p>
                  <p className="text-sm">
                    Status: <span className={item.ativo ? "text-green-600" : "text-red-600"}>{item.ativo ? "Ativo" : "Inativo"}</span>
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
