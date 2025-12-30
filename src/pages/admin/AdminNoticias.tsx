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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";

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
  data_publicacao: string | null;
}

// Categorias pré-definidas com suas respectivas cores
const categoriasConfig: Record<string, string> = {
  "Geral": "bg-primary",
  "Saúde": "bg-green-500",
  "Educação": "bg-cyan-500",
  "Esportes": "bg-orange-500",
  "Administração": "bg-amber-800",
  "Obras": "bg-yellow-500",
  "Assistência Social": "bg-purple-500",
  "Cultura": "bg-pink-500",
};

const categoriasList = Object.keys(categoriasConfig);

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
    data_publicacao: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  });

  const { data: noticias, isLoading } = useQuery({
    queryKey: ["admin-noticias"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("noticias")
        .select("*")
        .order("data_publicacao", { ascending: false });
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
      data_publicacao: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    });
    setEditingId(null);
    setOpen(false);
  };

  const handleCategoriaChange = (categoria: string) => {
    const cor = categoriasConfig[categoria] || "bg-primary";
    setForm({ ...form, categoria, categoria_cor: cor });
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
      data_publicacao: noticia.data_publicacao 
        ? format(new Date(noticia.data_publicacao), "yyyy-MM-dd'T'HH:mm")
        : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
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

  const formatDisplayDate = (dateStr: string | null) => {
    if (!dateStr) return "Sem data";
    try {
      return format(new Date(dateStr), "dd/MM/yyyy 'às' HH:mm");
    } catch {
      return "Data inválida";
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
                    <Select value={form.categoria} onValueChange={handleCategoriaChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoriasList.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            <div className="flex items-center gap-2">
                              <span className={`w-3 h-3 rounded-full ${categoriasConfig[cat]}`} />
                              {cat}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Data de Publicação</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="datetime-local"
                        value={form.data_publicacao}
                        onChange={(e) => setForm({ ...form, data_publicacao: e.target.value })}
                        className="pl-10"
                      />
                    </div>
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
                  <Label>Conteúdo</Label>
                  <RichTextEditor
                    content={form.conteudo}
                    onChange={(content) => setForm({ ...form, conteudo: content })}
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
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 text-xs text-white rounded ${noticia.categoria_cor}`}>
                      {noticia.categoria}
                    </span>
                    <CardTitle className="text-lg">{noticia.titulo}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDisplayDate(noticia.data_publicacao)}
                    </span>
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