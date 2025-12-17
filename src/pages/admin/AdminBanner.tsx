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

interface BannerSlide {
  id: string;
  titulo: string;
  subtitulo: string | null;
  descricao: string | null;
  cta_texto: string | null;
  cta_link: string | null;
  bg_class: string | null;
  bg_color: string | null;
  bg_image_url: string | null;
  bg_image_opacity: number | null;
  bg_image_position: string | null;
  ordem: number;
  ativo: boolean;
}

export default function AdminBanner() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    titulo: "",
    subtitulo: "",
    descricao: "",
    cta_texto: "Saiba Mais",
    cta_link: "#",
    bg_class: "",
    bg_color: "#005EA6",
    bg_image_url: "",
    bg_image_opacity: 1,
    bg_image_position: "center",
    ordem: 0,
    ativo: true,
  });

  const { data: slides, isLoading } = useQuery({
    queryKey: ["admin-banner"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("banner_slides")
        .select("*")
        .order("ordem");
      if (error) throw error;
      return data as BannerSlide[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      const { error } = await supabase.from("banner_slides").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-banner"] });
      toast.success("Slide criado!");
      resetForm();
    },
    onError: () => toast.error("Erro ao criar"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof form }) => {
      const { error } = await supabase.from("banner_slides").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-banner"] });
      toast.success("Slide atualizado!");
      resetForm();
    },
    onError: () => toast.error("Erro ao atualizar"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("banner_slides").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-banner"] });
      toast.success("Slide excluído!");
    },
    onError: () => toast.error("Erro ao excluir"),
  });

  const resetForm = () => {
    setForm({
      titulo: "",
      subtitulo: "",
      descricao: "",
      cta_texto: "Saiba Mais",
      cta_link: "#",
      bg_class: "",
      bg_color: "#005EA6",
      bg_image_url: "",
      bg_image_opacity: 1,
      bg_image_position: "center",
      ordem: 0,
      ativo: true,
    });
    setEditingId(null);
    setOpen(false);
  };

  const handleEdit = (item: BannerSlide) => {
    setForm({
      titulo: item.titulo,
      subtitulo: item.subtitulo || "",
      descricao: item.descricao || "",
      cta_texto: item.cta_texto || "Saiba Mais",
      cta_link: item.cta_link || "#",
      bg_class: item.bg_class || "",
      bg_color: item.bg_color || "#005EA6",
      bg_image_url: item.bg_image_url || "",
      bg_image_opacity: item.bg_image_opacity ?? 1,
      bg_image_position: item.bg_image_position || "center",
      ordem: item.ordem,
      ativo: item.ativo,
    });
    setEditingId(item.id);
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Banner Principal</h1>
            <p className="text-muted-foreground">Gerencie os slides do carousel</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" /> Novo Slide
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar Slide" : "Novo Slide"}</DialogTitle>
              </DialogHeader>
              
              {/* Preview em tempo real */}
              <div className="mb-4">
                <Label className="text-sm font-medium mb-2 block">Preview</Label>
                <div 
                  className={`${form.bg_class || ""} relative rounded-lg overflow-hidden`}
                  style={!form.bg_class && form.bg_color ? { backgroundColor: form.bg_color } : undefined}
                >
                  {/* Background Image Layer */}
                  {form.bg_image_url && (
                    <div 
                      className="absolute inset-0 bg-cover bg-no-repeat"
                      style={{
                        backgroundImage: `url(${form.bg_image_url})`,
                        backgroundPosition: form.bg_image_position || "center",
                        opacity: form.bg_image_opacity ?? 1,
                      }}
                    />
                  )}
                  <div className="relative z-10 py-8 px-6 text-center">
                    {form.subtitulo && (
                      <span className="inline-block px-3 py-1 bg-yellow-500 text-yellow-900 text-xs font-bold uppercase tracking-wider rounded-full mb-2">
                        {form.subtitulo}
                      </span>
                    )}
                    <h2 className="text-xl md:text-2xl font-black text-white leading-tight mb-2">
                      {form.titulo || "Título do Banner"}
                    </h2>
                    <p className="text-sm text-white/90 mb-4 max-w-md mx-auto">
                      {form.descricao || "Descrição do banner aparecerá aqui..."}
                    </p>
                    <button className="px-4 py-2 bg-yellow-500 text-yellow-900 text-sm font-bold rounded-lg">
                      {form.cta_texto || "Saiba Mais"}
                    </button>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Título</Label>
                  <Input
                    value={form.titulo}
                    onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtítulo</Label>
                  <Input
                    value={form.subtitulo}
                    onChange={(e) => setForm({ ...form, subtitulo: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Textarea
                    value={form.descricao}
                    onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Texto do Botão</Label>
                    <Input
                      value={form.cta_texto}
                      onChange={(e) => setForm({ ...form, cta_texto: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Link do Botão</Label>
                    <Input
                      value={form.cta_link}
                      onChange={(e) => setForm({ ...form, cta_link: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Cor de Fundo (Hexadecimal)</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={form.bg_color}
                        onChange={(e) => setForm({ ...form, bg_color: e.target.value })}
                        className="w-16 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        value={form.bg_color}
                        onChange={(e) => setForm({ ...form, bg_color: e.target.value })}
                        placeholder="#005EA6"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Classe CSS (opcional, sobrescreve a cor)</Label>
                    <Input
                      value={form.bg_class}
                      onChange={(e) => setForm({ ...form, bg_class: e.target.value })}
                      placeholder="hero-gradient ou bg-primary"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>URL da Imagem de Fundo (opcional)</Label>
                  <Input
                    value={form.bg_image_url}
                    onChange={(e) => setForm({ ...form, bg_image_url: e.target.value })}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Opacidade da Imagem (0 a 1)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      value={form.bg_image_opacity}
                      onChange={(e) => setForm({ ...form, bg_image_opacity: parseFloat(e.target.value) || 1 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Posição da Imagem</Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      value={form.bg_image_position}
                      onChange={(e) => setForm({ ...form, bg_image_position: e.target.value })}
                    >
                      <option value="center">Centro</option>
                      <option value="top">Superior</option>
                      <option value="bottom">Inferior</option>
                      <option value="left">Esquerda</option>
                      <option value="right">Direita</option>
                      <option value="top left">Superior Esquerda</option>
                      <option value="top right">Superior Direita</option>
                      <option value="bottom left">Inferior Esquerda</option>
                      <option value="bottom right">Inferior Direita</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Ordem</Label>
                  <Input
                    type="number"
                    value={form.ordem}
                    onChange={(e) => setForm({ ...form, ordem: parseInt(e.target.value) })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.ativo}
                    onCheckedChange={(checked) => setForm({ ...form, ativo: checked })}
                  />
                  <Label>Ativo</Label>
                </div>
                <Button type="submit" className="w-full">
                  {editingId ? "Salvar Alterações" : "Criar Slide"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <p>Carregando...</p>
        ) : (
          <div className="grid gap-4">
            {slides?.map((item) => (
              <Card key={item.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg">{item.titulo}</CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Ordem: {item.ordem}</span>
                    <span className={`px-2 py-1 text-xs rounded ${item.ativo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                      {item.ativo ? "Ativo" : "Inativo"}
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(item.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.subtitulo}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
