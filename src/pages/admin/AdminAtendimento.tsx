import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

interface AtendimentoItem {
  id: string;
  titulo: string;
  slug: string;
  categoria: string;
  subcategoria: string | null;
  conteudo: string | null;
  endereco: string | null;
  telefone: string | null;
  email: string | null;
  horario: string | null;
  responsavel_nome: string | null;
  responsavel_cargo: string | null;
  foto_url: string | null;
  ordem: number;
  ativo: boolean;
}

const categorias = [
  "Saúde",
  "Assistência Social",
  "Educação",
  "Programas e Serviços",
];

const subcategoriasPorCategoria: Record<string, string[]> = {
  "Saúde": ["UBS", "CAPS", "Hospital", "Outro"],
  "Assistência Social": ["CRAS", "CREAS", "Outro"],
  "Educação": [],
  "Programas e Serviços": [],
};

export default function AdminAtendimento() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AtendimentoItem | null>(null);
  const [formData, setFormData] = useState({
    titulo: "",
    slug: "",
    categoria: "Saúde",
    subcategoria: "",
    conteudo: "",
    endereco: "",
    telefone: "",
    email: "",
    horario: "Segunda a Sexta: 08h às 14h",
    responsavel_nome: "",
    responsavel_cargo: "",
    foto_url: "",
    ordem: 0,
    ativo: true,
  });

  const { data: itens = [], isLoading } = useQuery({
    queryKey: ["admin-atendimento-itens"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("atendimento_itens")
        .select("*")
        .order("categoria")
        .order("ordem");
      if (error) throw error;
      return data as AtendimentoItem[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData & { slug: string }) => {
      if (editingItem) {
        const { error } = await supabase
          .from("atendimento_itens")
          .update(data)
          .eq("id", editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("atendimento_itens")
          .insert([data]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-atendimento-itens"] });
      toast({
        title: editingItem ? "Item atualizado!" : "Item criado!",
        description: "As alterações foram salvas com sucesso.",
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("atendimento_itens")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-atendimento-itens"] });
      toast({
        title: "Item excluído!",
        description: "O item foi removido com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      titulo: "",
      slug: "",
      categoria: "Saúde",
      subcategoria: "",
      conteudo: "",
      endereco: "",
      telefone: "",
      email: "",
      horario: "Segunda a Sexta: 08h às 14h",
      responsavel_nome: "",
      responsavel_cargo: "",
      foto_url: "",
      ordem: 0,
      ativo: true,
    });
    setEditingItem(null);
  };

  const handleEdit = (item: AtendimentoItem) => {
    setEditingItem(item);
    setFormData({
      titulo: item.titulo,
      slug: item.slug,
      categoria: item.categoria,
      subcategoria: item.subcategoria || "",
      conteudo: item.conteudo || "",
      endereco: item.endereco || "",
      telefone: item.telefone || "",
      email: item.email || "",
      horario: item.horario || "Segunda a Sexta: 08h às 14h",
      responsavel_nome: item.responsavel_nome || "",
      responsavel_cargo: item.responsavel_cargo || "",
      foto_url: item.foto_url || "",
      ordem: item.ordem,
      ativo: item.ativo,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = formData.slug || formData.titulo.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    saveMutation.mutate({
      ...formData,
      slug,
      subcategoria: formData.subcategoria || null,
    });
  };

  const generateSlug = (titulo: string) => {
    return titulo
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  };

  const getCategoryColor = (categoria: string) => {
    switch (categoria) {
      case "Saúde": return "bg-green-500";
      case "Assistência Social": return "bg-blue-500";
      case "Educação": return "bg-yellow-500";
      case "Programas e Serviços": return "bg-purple-500";
      default: return "bg-primary";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Atendimento ao Cidadão
            </h1>
            <p className="text-muted-foreground">
              Gerencie os serviços de atendimento ao cidadão
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Novo Serviço
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? "Editar Serviço" : "Novo Serviço"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Tabs defaultValue="basico">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basico">Informações Básicas</TabsTrigger>
                    <TabsTrigger value="contato">Contato</TabsTrigger>
                    <TabsTrigger value="conteudo">Conteúdo</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basico" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="titulo">Título *</Label>
                        <Input
                          id="titulo"
                          value={formData.titulo}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              titulo: e.target.value,
                              slug: formData.slug || generateSlug(e.target.value),
                            });
                          }}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="slug">Slug (URL)</Label>
                        <Input
                          id="slug"
                          value={formData.slug}
                          onChange={(e) =>
                            setFormData({ ...formData, slug: e.target.value })
                          }
                          placeholder="gerado-automaticamente"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="categoria">Categoria *</Label>
                        <Select
                          value={formData.categoria}
                          onValueChange={(value) =>
                            setFormData({ ...formData, categoria: value, subcategoria: "" })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categorias.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subcategoria">Subcategoria</Label>
                        <Select
                          value={formData.subcategoria}
                          onValueChange={(value) =>
                            setFormData({ ...formData, subcategoria: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione (opcional)" />
                          </SelectTrigger>
                          <SelectContent>
                            {subcategoriasPorCategoria[formData.categoria]?.map((sub) => (
                              <SelectItem key={sub} value={sub}>
                                {sub}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="ordem">Ordem</Label>
                        <Input
                          id="ordem"
                          type="number"
                          value={formData.ordem}
                          onChange={(e) =>
                            setFormData({ ...formData, ordem: parseInt(e.target.value) || 0 })
                          }
                        />
                      </div>
                      <div className="flex items-center space-x-2 pt-8">
                        <Switch
                          id="ativo"
                          checked={formData.ativo}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, ativo: checked })
                          }
                        />
                        <Label htmlFor="ativo">Ativo</Label>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="contato" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="endereco">Endereço</Label>
                      <Input
                        id="endereco"
                        value={formData.endereco}
                        onChange={(e) =>
                          setFormData({ ...formData, endereco: e.target.value })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="telefone">Telefone</Label>
                        <Input
                          id="telefone"
                          value={formData.telefone}
                          onChange={(e) =>
                            setFormData({ ...formData, telefone: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="horario">Horário de Funcionamento</Label>
                      <Input
                        id="horario"
                        value={formData.horario}
                        onChange={(e) =>
                          setFormData({ ...formData, horario: e.target.value })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="responsavel_nome">Nome do Responsável</Label>
                        <Input
                          id="responsavel_nome"
                          value={formData.responsavel_nome}
                          onChange={(e) =>
                            setFormData({ ...formData, responsavel_nome: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="responsavel_cargo">Cargo do Responsável</Label>
                        <Input
                          id="responsavel_cargo"
                          value={formData.responsavel_cargo}
                          onChange={(e) =>
                            setFormData({ ...formData, responsavel_cargo: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="foto_url">URL da Foto do Responsável</Label>
                      <Input
                        id="foto_url"
                        value={formData.foto_url}
                        onChange={(e) =>
                          setFormData({ ...formData, foto_url: e.target.value })
                        }
                        placeholder="https://..."
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="conteudo" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>Conteúdo da Página</Label>
                      <RichTextEditor
                        content={formData.conteudo}
                        onChange={(content) =>
                          setFormData({ ...formData, conteudo: content })
                        }
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={saveMutation.isPending}>
                    {saveMutation.isPending ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Subcategoria</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : itens.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Nenhum serviço cadastrado
                    </TableCell>
                  </TableRow>
                ) : (
                  itens.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.titulo}</TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(item.categoria)}>
                          {item.categoria}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.subcategoria || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={item.ativo ? "default" : "secondary"}>
                          {item.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(item)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (confirm("Tem certeza que deseja excluir este item?")) {
                                deleteMutation.mutate(item.id);
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
