import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Secretaria {
  id: string;
  slug: string;
  nome: string;
  icone: string | null;
  secretario_nome: string | null;
  secretario_foto: string | null;
  secretario_biografia: string | null;
  endereco: string | null;
  telefone: string | null;
  email: string | null;
  horario: string | null;
  ordem: number;
  ativo: boolean;
}

export default function AdminSecretarias() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    nome: "",
    slug: "",
    icone: "Building2",
    secretario_nome: "",
    secretario_foto: "",
    secretario_biografia: "",
    endereco: "",
    telefone: "",
    email: "",
    horario: "Segunda a Sexta: 08h às 14h",
    ordem: 0,
    ativo: true,
  });

  const { data: secretarias, isLoading } = useQuery({
    queryKey: ["admin-secretarias"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("secretarias")
        .select("*")
        .order("ordem");
      if (error) throw error;
      return data as Secretaria[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      const { error } = await supabase.from("secretarias").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-secretarias"] });
      toast.success("Secretaria criada!");
      resetForm();
    },
    onError: () => toast.error("Erro ao criar"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof form }) => {
      const { error } = await supabase.from("secretarias").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-secretarias"] });
      toast.success("Secretaria atualizada!");
      resetForm();
    },
    onError: () => toast.error("Erro ao atualizar"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("secretarias").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-secretarias"] });
      toast.success("Secretaria excluída!");
    },
    onError: () => toast.error("Erro ao excluir"),
  });

  const resetForm = () => {
    setForm({
      nome: "",
      slug: "",
      icone: "Building2",
      secretario_nome: "",
      secretario_foto: "",
      secretario_biografia: "",
      endereco: "",
      telefone: "",
      email: "",
      horario: "Segunda a Sexta: 08h às 14h",
      ordem: 0,
      ativo: true,
    });
    setEditingId(null);
    setOpen(false);
  };

  const handleEdit = (item: Secretaria) => {
    setForm({
      nome: item.nome,
      slug: item.slug,
      icone: item.icone || "Building2",
      secretario_nome: item.secretario_nome || "",
      secretario_foto: item.secretario_foto || "",
      secretario_biografia: item.secretario_biografia || "",
      endereco: item.endereco || "",
      telefone: item.telefone || "",
      email: item.email || "",
      horario: item.horario || "Segunda a Sexta: 08h às 14h",
      ordem: item.ordem,
      ativo: item.ativo,
    });
    setEditingId(item.id);
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = form.slug || form.nome.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
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
            <h1 className="text-3xl font-bold">Secretarias</h1>
            <p className="text-muted-foreground">Gerencie as secretarias municipais</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" /> Nova Secretaria
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar Secretaria" : "Nova Secretaria"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome</Label>
                    <Input
                      value={form.nome}
                      onChange={(e) => setForm({ ...form, nome: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Slug</Label>
                    <Input
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Ícone (Lucide)</Label>
                    <Input
                      value={form.icone}
                      onChange={(e) => setForm({ ...form, icone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Ordem</Label>
                    <Input
                      type="number"
                      value={form.ordem}
                      onChange={(e) => setForm({ ...form, ordem: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-4">Secretário(a)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nome</Label>
                      <Input
                        value={form.secretario_nome}
                        onChange={(e) => setForm({ ...form, secretario_nome: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>URL da Foto</Label>
                      <Input
                        value={form.secretario_foto}
                        onChange={(e) => setForm({ ...form, secretario_foto: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 mt-4">
                    <Label>Biografia</Label>
                    <RichTextEditor
                      content={form.secretario_biografia}
                      onChange={(content) => setForm({ ...form, secretario_biografia: content })}
                    />
                  </div>
                </div>
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-4">Contato</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Endereço</Label>
                      <Input
                        value={form.endereco}
                        onChange={(e) => setForm({ ...form, endereco: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Telefone</Label>
                      <Input
                        value={form.telefone}
                        onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Horário</Label>
                      <Input
                        value={form.horario}
                        onChange={(e) => setForm({ ...form, horario: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.ativo}
                    onCheckedChange={(checked) => setForm({ ...form, ativo: checked })}
                  />
                  <Label>Ativo</Label>
                </div>
                <Button type="submit" className="w-full">
                  {editingId ? "Salvar Alterações" : "Criar Secretaria"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <p>Carregando...</p>
        ) : (
          <div className="grid gap-4">
            {secretarias?.map((item) => (
              <Card key={item.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg">{item.nome}</CardTitle>
                  <div className="flex items-center gap-2">
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
                  <p className="text-sm text-muted-foreground">
                    {item.secretario_nome ? `Secretário(a): ${item.secretario_nome}` : "Sem secretário cadastrado"}
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
