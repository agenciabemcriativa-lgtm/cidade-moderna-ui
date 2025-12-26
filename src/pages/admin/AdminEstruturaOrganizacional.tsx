import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Building2, GitBranch, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  useOrgaosAdministracaoAdmin,
  useCreateOrgao,
  useUpdateOrgao,
  useDeleteOrgao,
  useUnidadesVinculadasAdmin,
  useCreateUnidade,
  useUpdateUnidade,
  useDeleteUnidade,
  useCreateUnidadeItem,
  useUpdateUnidadeItem,
  useDeleteUnidadeItem,
  OrgaoAdministracao,
  UnidadeVinculada,
  UnidadeVinculadaItem,
} from "@/hooks/useEstruturaOrganizacional";

const iconeOptions = [
  { value: "Building2", label: "Prédio" },
  { value: "Users", label: "Usuários" },
  { value: "Wallet", label: "Carteira" },
  { value: "Heart", label: "Coração" },
  { value: "GraduationCap", label: "Educação" },
  { value: "HandHeart", label: "Mão com Coração" },
  { value: "HardHat", label: "Capacete" },
  { value: "Wheat", label: "Agricultura" },
  { value: "Shield", label: "Escudo" },
  { value: "FileText", label: "Documento" },
  { value: "Briefcase", label: "Pasta" },
  { value: "Scale", label: "Balança" },
];

export default function AdminEstruturaOrganizacional() {
  const { data: orgaos, isLoading: loadingOrgaos } = useOrgaosAdministracaoAdmin();
  const { data: unidades, isLoading: loadingUnidades } = useUnidadesVinculadasAdmin();

  const createOrgao = useCreateOrgao();
  const updateOrgao = useUpdateOrgao();
  const deleteOrgao = useDeleteOrgao();

  const createUnidade = useCreateUnidade();
  const updateUnidade = useUpdateUnidade();
  const deleteUnidade = useDeleteUnidade();

  const createUnidadeItem = useCreateUnidadeItem();
  const updateUnidadeItem = useUpdateUnidadeItem();
  const deleteUnidadeItem = useDeleteUnidadeItem();

  const [openOrgaoDialog, setOpenOrgaoDialog] = useState(false);
  const [editingOrgao, setEditingOrgao] = useState<OrgaoAdministracao | null>(null);
  const [orgaoForm, setOrgaoForm] = useState({
    nome: "",
    icone: "Building2",
    competencia: "",
    responsavel: "",
    contato: "",
    email: "",
    base_legal: "",
    ordem: 0,
    ativo: true,
  });

  const [openUnidadeDialog, setOpenUnidadeDialog] = useState(false);
  const [editingUnidade, setEditingUnidade] = useState<UnidadeVinculada | null>(null);
  const [unidadeForm, setUnidadeForm] = useState({
    secretaria: "",
    icone: "Building2",
    ordem: 0,
    ativo: true,
  });

  const [openItemDialog, setOpenItemDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<UnidadeVinculadaItem | null>(null);
  const [selectedUnidadeId, setSelectedUnidadeId] = useState<string | null>(null);
  const [itemForm, setItemForm] = useState({
    nome: "",
    ordem: 0,
    ativo: true,
  });

  // Handlers para Órgãos
  const handleOpenOrgaoDialog = (orgao?: OrgaoAdministracao) => {
    if (orgao) {
      setEditingOrgao(orgao);
      setOrgaoForm({
        nome: orgao.nome,
        icone: orgao.icone,
        competencia: orgao.competencia || "",
        responsavel: orgao.responsavel || "",
        contato: orgao.contato || "",
        email: orgao.email || "",
        base_legal: orgao.base_legal || "",
        ordem: orgao.ordem,
        ativo: orgao.ativo,
      });
    } else {
      setEditingOrgao(null);
      setOrgaoForm({
        nome: "",
        icone: "Building2",
        competencia: "",
        responsavel: "",
        contato: "",
        email: "",
        base_legal: "",
        ordem: (orgaos?.length || 0) + 1,
        ativo: true,
      });
    }
    setOpenOrgaoDialog(true);
  };

  const handleSaveOrgao = async () => {
    if (!orgaoForm.nome) {
      toast.error("Nome é obrigatório");
      return;
    }

    try {
      if (editingOrgao) {
        await updateOrgao.mutateAsync({ id: editingOrgao.id, ...orgaoForm });
        toast.success("Órgão atualizado com sucesso!");
      } else {
        await createOrgao.mutateAsync(orgaoForm);
        toast.success("Órgão criado com sucesso!");
      }
      setOpenOrgaoDialog(false);
    } catch (error) {
      toast.error("Erro ao salvar órgão");
    }
  };

  const handleDeleteOrgao = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este órgão?")) return;
    try {
      await deleteOrgao.mutateAsync(id);
      toast.success("Órgão excluído com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir órgão");
    }
  };

  // Handlers para Unidades Vinculadas
  const handleOpenUnidadeDialog = (unidade?: UnidadeVinculada) => {
    if (unidade) {
      setEditingUnidade(unidade);
      setUnidadeForm({
        secretaria: unidade.secretaria,
        icone: unidade.icone,
        ordem: unidade.ordem,
        ativo: unidade.ativo,
      });
    } else {
      setEditingUnidade(null);
      setUnidadeForm({
        secretaria: "",
        icone: "Building2",
        ordem: (unidades?.length || 0) + 1,
        ativo: true,
      });
    }
    setOpenUnidadeDialog(true);
  };

  const handleSaveUnidade = async () => {
    if (!unidadeForm.secretaria) {
      toast.error("Nome da secretaria é obrigatório");
      return;
    }

    try {
      if (editingUnidade) {
        await updateUnidade.mutateAsync({ id: editingUnidade.id, ...unidadeForm });
        toast.success("Unidade atualizada com sucesso!");
      } else {
        await createUnidade.mutateAsync(unidadeForm);
        toast.success("Unidade criada com sucesso!");
      }
      setOpenUnidadeDialog(false);
    } catch (error) {
      toast.error("Erro ao salvar unidade");
    }
  };

  const handleDeleteUnidade = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta unidade e todos os seus itens?")) return;
    try {
      await deleteUnidade.mutateAsync(id);
      toast.success("Unidade excluída com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir unidade");
    }
  };

  // Handlers para Itens de Unidades
  const handleOpenItemDialog = (unidadeId: string, item?: UnidadeVinculadaItem) => {
    setSelectedUnidadeId(unidadeId);
    if (item) {
      setEditingItem(item);
      setItemForm({
        nome: item.nome,
        ordem: item.ordem,
        ativo: item.ativo,
      });
    } else {
      setEditingItem(null);
      const unidade = unidades?.find((u) => u.id === unidadeId);
      setItemForm({
        nome: "",
        ordem: (unidade?.itens?.length || 0) + 1,
        ativo: true,
      });
    }
    setOpenItemDialog(true);
  };

  const handleSaveItem = async () => {
    if (!itemForm.nome || !selectedUnidadeId) {
      toast.error("Nome é obrigatório");
      return;
    }

    try {
      if (editingItem) {
        await updateUnidadeItem.mutateAsync({ id: editingItem.id, ...itemForm });
        toast.success("Item atualizado com sucesso!");
      } else {
        await createUnidadeItem.mutateAsync({
          unidade_vinculada_id: selectedUnidadeId,
          ...itemForm,
        });
        toast.success("Item criado com sucesso!");
      }
      setOpenItemDialog(false);
    } catch (error) {
      toast.error("Erro ao salvar item");
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este item?")) return;
    try {
      await deleteUnidadeItem.mutateAsync(id);
      toast.success("Item excluído com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir item");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Estrutura Organizacional</h1>
          <p className="text-muted-foreground">
            Gerencie os órgãos da administração e unidades vinculadas
          </p>
        </div>

        <Tabs defaultValue="orgaos">
          <TabsList>
            <TabsTrigger value="orgaos" className="gap-2">
              <Building2 className="h-4 w-4" />
              Órgãos da Administração
            </TabsTrigger>
            <TabsTrigger value="unidades" className="gap-2">
              <GitBranch className="h-4 w-4" />
              Unidades Vinculadas
            </TabsTrigger>
          </TabsList>

          {/* Órgãos da Administração */}
          <TabsContent value="orgaos" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => handleOpenOrgaoDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Órgão
              </Button>
            </div>

            {loadingOrgaos ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="grid gap-4">
                {orgaos?.map((orgao) => (
                  <Card key={orgao.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{orgao.nome}</h3>
                            {!orgao.ativo && (
                              <span className="text-xs bg-muted px-2 py-1 rounded">
                                Inativo
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {orgao.competencia}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Ordem: {orgao.ordem} | Ícone: {orgao.icone}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleOpenOrgaoDialog(orgao)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteOrgao(orgao.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Unidades Vinculadas */}
          <TabsContent value="unidades" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => handleOpenUnidadeDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Unidade
              </Button>
            </div>

            {loadingUnidades ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="grid gap-4">
                {unidades?.map((unidade) => (
                  <Card key={unidade.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{unidade.secretaria}</CardTitle>
                          {!unidade.ativo && (
                            <span className="text-xs bg-muted px-2 py-1 rounded">
                              Inativo
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenItemDialog(unidade.id)}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Item
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleOpenUnidadeDialog(unidade)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteUnidade(unidade.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground mb-2">
                        Ordem: {unidade.ordem} | Ícone: {unidade.icone}
                      </p>
                      {unidade.itens && unidade.itens.length > 0 && (
                        <div className="space-y-2 mt-3 border-t pt-3">
                          <p className="text-sm font-medium">Itens:</p>
                          {unidade.itens.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between bg-muted/50 rounded p-2"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{item.nome}</span>
                                {!item.ativo && (
                                  <span className="text-xs bg-muted px-1.5 py-0.5 rounded">
                                    Inativo
                                  </span>
                                )}
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => handleOpenItemDialog(unidade.id, item)}
                                >
                                  <Pencil className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-destructive"
                                  onClick={() => handleDeleteItem(item.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Dialog para Órgão */}
        <Dialog open={openOrgaoDialog} onOpenChange={setOpenOrgaoDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingOrgao ? "Editar Órgão" : "Novo Órgão"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label>Nome *</Label>
                  <Input
                    value={orgaoForm.nome}
                    onChange={(e) =>
                      setOrgaoForm({ ...orgaoForm, nome: e.target.value })
                    }
                    placeholder="Nome do órgão"
                  />
                </div>
                <div>
                  <Label>Ícone</Label>
                  <Select
                    value={orgaoForm.icone}
                    onValueChange={(value) =>
                      setOrgaoForm({ ...orgaoForm, icone: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconeOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Ordem</Label>
                  <Input
                    type="number"
                    value={orgaoForm.ordem}
                    onChange={(e) =>
                      setOrgaoForm({ ...orgaoForm, ordem: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>
              <div>
                <Label>Competência</Label>
                <Textarea
                  value={orgaoForm.competencia}
                  onChange={(e) =>
                    setOrgaoForm({ ...orgaoForm, competencia: e.target.value })
                  }
                  placeholder="Competências do órgão"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Responsável</Label>
                  <Input
                    value={orgaoForm.responsavel}
                    onChange={(e) =>
                      setOrgaoForm({ ...orgaoForm, responsavel: e.target.value })
                    }
                    placeholder="Cargo do responsável"
                  />
                </div>
                <div>
                  <Label>Contato</Label>
                  <Input
                    value={orgaoForm.contato}
                    onChange={(e) =>
                      setOrgaoForm({ ...orgaoForm, contato: e.target.value })
                    }
                    placeholder="Telefone"
                  />
                </div>
                <div>
                  <Label>E-mail</Label>
                  <Input
                    type="email"
                    value={orgaoForm.email}
                    onChange={(e) =>
                      setOrgaoForm({ ...orgaoForm, email: e.target.value })
                    }
                    placeholder="email@prefeitura.gov.br"
                  />
                </div>
                <div>
                  <Label>Base Legal</Label>
                  <Input
                    value={orgaoForm.base_legal}
                    onChange={(e) =>
                      setOrgaoForm({ ...orgaoForm, base_legal: e.target.value })
                    }
                    placeholder="Lei de criação"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="ativo-orgao"
                  checked={orgaoForm.ativo}
                  onCheckedChange={(checked) =>
                    setOrgaoForm({ ...orgaoForm, ativo: checked })
                  }
                />
                <Label htmlFor="ativo-orgao">Ativo</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpenOrgaoDialog(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleSaveOrgao}
                  disabled={createOrgao.isPending || updateOrgao.isPending}
                >
                  {(createOrgao.isPending || updateOrgao.isPending) && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Salvar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog para Unidade */}
        <Dialog open={openUnidadeDialog} onOpenChange={setOpenUnidadeDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingUnidade ? "Editar Unidade" : "Nova Unidade"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Secretaria *</Label>
                <Input
                  value={unidadeForm.secretaria}
                  onChange={(e) =>
                    setUnidadeForm({ ...unidadeForm, secretaria: e.target.value })
                  }
                  placeholder="Nome da secretaria"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Ícone</Label>
                  <Select
                    value={unidadeForm.icone}
                    onValueChange={(value) =>
                      setUnidadeForm({ ...unidadeForm, icone: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconeOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Ordem</Label>
                  <Input
                    type="number"
                    value={unidadeForm.ordem}
                    onChange={(e) =>
                      setUnidadeForm({ ...unidadeForm, ordem: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="ativo-unidade"
                  checked={unidadeForm.ativo}
                  onCheckedChange={(checked) =>
                    setUnidadeForm({ ...unidadeForm, ativo: checked })
                  }
                />
                <Label htmlFor="ativo-unidade">Ativo</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpenUnidadeDialog(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleSaveUnidade}
                  disabled={createUnidade.isPending || updateUnidade.isPending}
                >
                  {(createUnidade.isPending || updateUnidade.isPending) && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Salvar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog para Item */}
        <Dialog open={openItemDialog} onOpenChange={setOpenItemDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Editar Item" : "Novo Item"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nome *</Label>
                <Input
                  value={itemForm.nome}
                  onChange={(e) => setItemForm({ ...itemForm, nome: e.target.value })}
                  placeholder="Nome do item"
                />
              </div>
              <div>
                <Label>Ordem</Label>
                <Input
                  type="number"
                  value={itemForm.ordem}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, ordem: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="ativo-item"
                  checked={itemForm.ativo}
                  onCheckedChange={(checked) =>
                    setItemForm({ ...itemForm, ativo: checked })
                  }
                />
                <Label htmlFor="ativo-item">Ativo</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpenItemDialog(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleSaveItem}
                  disabled={createUnidadeItem.isPending || updateUnidadeItem.isPending}
                >
                  {(createUnidadeItem.isPending || updateUnidadeItem.isPending) && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Salvar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
