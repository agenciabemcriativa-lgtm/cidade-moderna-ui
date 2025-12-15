import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Noticia {
  id: string;
  slug: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  categoria: string;
  categoria_cor: string;
  imagem_url: string | null;
  publicado: boolean;
}

export default function AdminNoticias() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    titulo: "",
    slug: "",
    resumo: "",
    conteudo: "",
    categoria: "Geral",
    categoria_cor: "bg-primary",
    imagem_url: "",
    publicado: false,
  });

  const { data: noticias, isLoading } = useQuery({
    queryKey: ["admin-noticias"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("noticias")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Noticia[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      const { error } = await supabase.from("noticias").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-noticias"] });
      toast.success("Notícia criada com sucesso!");
      resetForm();
    },
    onError: () => toast.error("Erro ao criar notícia"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof form }) => {
      const { error } = await supabase.from("noticias").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-noticias"] });
      toast.success("Notícia atualizada!");
      resetForm();
    },
    onError: () => toast.error("Erro ao atualizar"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("noticias").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-noticias"] });
      toast.success("Notícia excluída!");
    },
    onError: () => toast.error("Erro ao excluir"),
  });

  const resetForm = () => {
    setForm({
      titulo: "",
      slug: "",
      resumo: "",
      conteudo: "",
      categoria: "Geral",
      categoria_cor: "bg-primary",
      imagem_url: "",
      publicado: false,
    });
    setEditingId(null);
    setOpen(false);
  };

  const handleEdit = (noticia: Noticia) => {
    setForm({
      titulo: noticia.titulo,
      slug: noticia.slug,
      resumo: noticia.resumo,
      conteudo: noticia.conteudo,
      categoria: noticia.categoria,
      categoria_cor: noticia.categoria_cor,
      imagem_url: noticia.imagem_url || "",
      publicado: noticia.publicado,
    });
    setEditingId(noticia.id);
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = form.slug || form.titulo.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
    const data = { ...form, slug };
    
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
            <h1 className="text-3xl font-bold">Notícias</h1>
            <p className="text-muted-foreground">Gerencie as notícias do portal</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" /> Nova Notícia
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar Notícia" : "Nova Notícia"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Título</Label>
                    <Input
                      value={form.titulo}
                      onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Slug (URL)</Label>
                    <Input
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      placeholder="gerado-automaticamente"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <Input
                      value={form.categoria}
                      onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Cor da Categoria</Label>
                    <Input
                      value={form.categoria_cor}
                      onChange={(e) => setForm({ ...form, categoria_cor: e.target.value })}
                      placeholder="bg-primary"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>URL da Imagem</Label>
                  <Input
                    value={form.imagem_url}
                    onChange={(e) => setForm({ ...form, imagem_url: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Resumo</Label>
                  <Textarea
                    value={form.resumo}
                    onChange={(e) => setForm({ ...form, resumo: e.target.value })}
                    rows={2}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Conteúdo (HTML)</Label>
                  <Textarea
                    value={form.conteudo}
                    onChange={(e) => setForm({ ...form, conteudo: e.target.value })}
                    rows={6}
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.publicado}
                    onCheckedChange={(checked) => setForm({ ...form, publicado: checked })}
                  />
                  <Label>Publicado</Label>
                </div>
                <Button type="submit" className="w-full">
                  {editingId ? "Salvar Alterações" : "Criar Notícia"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <p>Carregando...</p>
        ) : (
          <div className="grid gap-4">
            {noticias?.map((noticia) => (
              <Card key={noticia.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg">{noticia.titulo}</CardTitle>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded ${noticia.publicado ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {noticia.publicado ? "Publicado" : "Rascunho"}
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(noticia)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(noticia.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{noticia.resumo}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
