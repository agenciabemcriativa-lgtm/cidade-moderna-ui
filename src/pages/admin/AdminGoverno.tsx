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
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Landmark } from "lucide-react";

interface GovernoItem {
  id: string;
  titulo: string;
  slug: string;
  ordem: number;
  ativo: boolean;
}

export default function AdminGoverno() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    titulo: "",
    slug: "",
    ordem: 0,
    ativo: true,
  });

  const { data: itens, isLoading } = useQuery({
    queryKey: ["governo-itens-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("governo_itens")
        .select("*")
        .order("ordem");
      if (error) throw error;
      return data as GovernoItem[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from("governo_itens").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["governo-itens-admin"] });
      queryClient.invalidateQueries({ queryKey: ["governo-itens"] });
      toast.success("Item criado com sucesso!");
      resetForm();
    },
    onError: () => toast.error("Erro ao criar item"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase.from("governo_itens").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["governo-itens-admin"] });
      queryClient.invalidateQueries({ queryKey: ["governo-itens"] });
      toast.success("Item atualizado com sucesso!");
      resetForm();
    },
    onError: () => toast.error("Erro ao atualizar item"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("governo_itens").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["governo-itens-admin"] });
      queryClient.invalidateQueries({ queryKey: ["governo-itens"] });
      toast.success("Item excluído com sucesso!");
    },
    onError: () => toast.error("Erro ao excluir item"),
  });

  const resetForm = () => {
    setFormData({ titulo: "", slug: "", ordem: 0, ativo: true });
    setEditingId(null);
    setDialogOpen(false);
  };

  const handleEdit = (item: GovernoItem) => {
    setFormData({
      titulo: item.titulo,
      slug: item.slug,
      ordem: item.ordem,
      ativo: item.ativo,
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
            <h1 className="text-3xl font-bold text-foreground">O Governo</h1>
            <p className="text-muted-foreground">Gerencie os itens do menu O Governo</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar Item" : "Novo Item"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                <div className="space-y-2">
                  <Label htmlFor="ordem">Ordem</Label>
                  <Input
                    id="ordem"
                    type="number"
                    value={formData.ordem}
                    onChange={(e) => setFormData({ ...formData, ordem: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="ativo"
                    checked={formData.ativo}
                    onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                  />
                  <Label htmlFor="ativo">Ativo</Label>
                </div>
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
                    <Landmark className="w-5 h-5 text-primary" />
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
