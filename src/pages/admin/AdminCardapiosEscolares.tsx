import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, FileText, ExternalLink } from "lucide-react";
import { useCardapiosEscolaresAdmin, CardapioEscolar, CATEGORIA_AVULSA } from "@/hooks/useCardapiosEscolares";

const mesesNomes = [
  { value: "1", label: "Janeiro" },
  { value: "2", label: "Fevereiro" },
  { value: "3", label: "Março" },
  { value: "4", label: "Abril" },
  { value: "5", label: "Maio" },
  { value: "6", label: "Junho" },
  { value: "7", label: "Julho" },
  { value: "8", label: "Agosto" },
  { value: "9", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

const categoriasList = [
  "Cardápios e Recomendações",
  "Educação Infantil",
  "Ensino Fundamental",
  "Creches",
  "Tempo Integral",
];

export default function AdminCardapiosEscolares() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    titulo: "",
    mes_referencia: String(new Date().getMonth() + 1),
    ano_referencia: String(currentYear),
    arquivo_nome: "",
    arquivo_url: "",
    ordem: 0,
    publicado: true,
    categoria: "Cardápios e Recomendações",
  });

  const { data: cardapios, isLoading } = useCardapiosEscolaresAdmin();

  const createMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      const { error } = await supabase.from("cardapios_escolares").insert([{
        ...data,
        mes_referencia: parseInt(data.mes_referencia),
        ano_referencia: parseInt(data.ano_referencia),
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cardapios-escolares-admin"] });
      toast.success("Cardápio criado com sucesso!");
      resetForm();
    },
    onError: () => toast.error("Erro ao criar cardápio"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof form }) => {
      const { error } = await supabase.from("cardapios_escolares").update({
        ...data,
        mes_referencia: parseInt(data.mes_referencia),
        ano_referencia: parseInt(data.ano_referencia),
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cardapios-escolares-admin"] });
      toast.success("Cardápio atualizado!");
      resetForm();
    },
    onError: () => toast.error("Erro ao atualizar"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cardapios_escolares").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cardapios-escolares-admin"] });
      toast.success("Cardápio excluído!");
    },
    onError: () => toast.error("Erro ao excluir"),
  });

  const resetForm = () => {
    setForm({
      titulo: "",
      mes_referencia: String(new Date().getMonth() + 1),
      ano_referencia: String(currentYear),
      arquivo_nome: "",
      arquivo_url: "",
      ordem: 0,
      publicado: true,
      categoria: "Cardápios e Recomendações",
    });
    setEditingId(null);
    setOpen(false);
  };

  const handleEdit = (cardapio: CardapioEscolar) => {
    setForm({
      titulo: cardapio.titulo,
      mes_referencia: String(cardapio.mes_referencia),
      ano_referencia: String(cardapio.ano_referencia),
      arquivo_nome: cardapio.arquivo_nome,
      arquivo_url: cardapio.arquivo_url,
      ordem: cardapio.ordem || 0,
      publicado: cardapio.publicado ?? true,
      categoria: cardapio.categoria || "Cardápios e Recomendações",
    });
    setEditingId(cardapio.id);
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

  // Separar itens avulsos e agrupar por categoria/mês
  const itensAvulsos = cardapios?.filter(c => c.categoria === CATEGORIA_AVULSA) || [];
  const itensAgrupados = cardapios?.filter(c => c.categoria !== CATEGORIA_AVULSA) || [];

  const groupedCardapios = itensAgrupados.reduce((acc, cardapio) => {
    const categoria = cardapio.categoria;
    if (!acc[categoria]) {
      acc[categoria] = {};
    }
    const key = `${cardapio.ano_referencia}-${cardapio.mes_referencia}`;
    if (!acc[categoria][key]) {
      acc[categoria][key] = {
        label: `${mesesNomes.find(m => m.value === String(cardapio.mes_referencia))?.label} ${cardapio.ano_referencia}`,
        itens: [],
      };
    }
    acc[categoria][key].itens.push(cardapio);
    return acc;
  }, {} as Record<string, Record<string, { label: string; itens: CardapioEscolar[] }>>);

  const sortedCategories = Object.keys(groupedCardapios).sort((a, b) => a.localeCompare(b));

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Cardápios Escolares</h1>
            <p className="text-muted-foreground">Gerencie os cardápios escolares organizados por mês</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" /> Novo Cardápio
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar Cardápio" : "Novo Cardápio"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select value={form.categoria} onValueChange={(v) => setForm({ ...form, categoria: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriasList.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Título do Cardápio</Label>
                  <Input
                    value={form.titulo}
                    onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                    placeholder="Ex: Cardápio Escolar, Cardápio Setor Creche..."
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Mês de Referência</Label>
                    <Select value={form.mes_referencia} onValueChange={(v) => setForm({ ...form, mes_referencia: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o mês" />
                      </SelectTrigger>
                      <SelectContent>
                        {mesesNomes.map((mes) => (
                          <SelectItem key={mes.value} value={mes.value}>
                            {mes.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Ano de Referência</Label>
                    <Select value={form.ano_referencia} onValueChange={(v) => setForm({ ...form, ano_referencia: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o ano" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={String(year)}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Nome do Arquivo</Label>
                  <Input
                    value={form.arquivo_nome}
                    onChange={(e) => setForm({ ...form, arquivo_nome: e.target.value })}
                    placeholder="Ex: cardapio-maio-2025.pdf"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>URL do Arquivo</Label>
                  <Input
                    value={form.arquivo_url}
                    onChange={(e) => setForm({ ...form, arquivo_url: e.target.value })}
                    placeholder="https://..."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ordem de Exibição</Label>
                  <Input
                    type="number"
                    value={form.ordem}
                    onChange={(e) => setForm({ ...form, ordem: parseInt(e.target.value) || 0 })}
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
                  {editingId ? "Salvar Alterações" : "Criar Cardápio"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <p>Carregando...</p>
        ) : (cardapios && cardapios.length > 0) ? (
          <div className="space-y-8">
            {/* Categoria Avulsa - Cardápios e Recomendações */}
            {itensAvulsos.length > 0 && (
              <Card>
                <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
                  <CardTitle className="text-lg">{CATEGORIA_AVULSA}</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-2">
                  {itensAvulsos.map((cardapio) => (
                    <div
                      key={cardapio.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                    >
                      <a
                        href={cardapio.arquivo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-foreground hover:text-primary transition-colors flex-1"
                      >
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{cardapio.titulo}</span>
                        <ExternalLink className="h-3 w-3 ml-1 opacity-50" />
                      </a>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded ${cardapio.publicado ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {cardapio.publicado ? "Publicado" : "Rascunho"}
                        </span>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(cardapio)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(cardapio.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Outras categorias agrupadas por mês */}
            {sortedCategories.map((categoria) => (
              <div key={categoria} className="space-y-4">
                <h2 className="text-xl font-bold text-foreground border-b-2 border-primary pb-2">
                  {categoria}
                </h2>
                {Object.entries(groupedCardapios[categoria]).map(([key, group]) => (
                  <Card key={key}>
                    <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
                      <CardTitle className="text-lg">Cardápio {group.label}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-2">
                      {group.itens.map((cardapio) => (
                        <div
                          key={cardapio.id}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                        >
                          <a
                            href={cardapio.arquivo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors flex-1"
                          >
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span>{cardapio.titulo}</span>
                            <ExternalLink className="h-3 w-3 ml-1 opacity-50" />
                          </a>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 text-xs rounded ${cardapio.publicado ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                              {cardapio.publicado ? "Publicado" : "Rascunho"}
                            </span>
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(cardapio)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(cardapio.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Nenhum cardápio cadastrado. Clique em "Novo Cardápio" para começar.
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
