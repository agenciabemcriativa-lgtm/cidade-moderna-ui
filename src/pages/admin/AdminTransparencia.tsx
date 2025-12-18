import { useState } from "react";
import { Plus, Pencil, Trash2, ExternalLink, Link as LinkIcon, ChevronDown, ChevronRight, GripVertical } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";
import {
  useTransparenciaCategorias,
  useTransparenciaCategoriasComItens,
  useTransparenciaLinksRapidos,
  useCreateCategoria,
  useUpdateCategoria,
  useDeleteCategoria,
  useCreateItem,
  useUpdateItem,
  useDeleteItem,
  useCreateLinkRapido,
  useUpdateLinkRapido,
  useDeleteLinkRapido,
  TransparenciaCategoria,
  TransparenciaItem,
  TransparenciaLinkRapido,
  CategoriaComItens,
} from "@/hooks/useTransparencia";

const iconeOptions = [
  { value: 'DollarSign', label: 'Dinheiro' },
  { value: 'TrendingUp', label: 'Crescimento' },
  { value: 'FileText', label: 'Documento' },
  { value: 'Users', label: 'Pessoas' },
  { value: 'Calculator', label: 'Calculadora' },
  { value: 'Handshake', label: 'Parceria' },
  { value: 'BarChart3', label: 'Gráfico' },
  { value: 'MessageSquare', label: 'Mensagem' },
  { value: 'ExternalLink', label: 'Link Externo' },
  { value: 'Search', label: 'Busca' },
  { value: 'Shield', label: 'Escudo' },
  { value: 'Scale', label: 'Balança' },
];

const corOptions = [
  { value: 'bg-red-50 border-red-200', label: 'Vermelho' },
  { value: 'bg-green-50 border-green-200', label: 'Verde' },
  { value: 'bg-blue-50 border-blue-200', label: 'Azul' },
  { value: 'bg-purple-50 border-purple-200', label: 'Roxo' },
  { value: 'bg-orange-50 border-orange-200', label: 'Laranja' },
  { value: 'bg-teal-50 border-teal-200', label: 'Teal' },
  { value: 'bg-indigo-50 border-indigo-200', label: 'Índigo' },
  { value: 'bg-amber-50 border-amber-200', label: 'Âmbar' },
];

export default function AdminTransparencia() {
  const [activeTab, setActiveTab] = useState('categorias');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  
  // Category dialog state
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TransparenciaCategoria | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    titulo: '',
    descricao: '',
    icone: 'FileText',
    cor: 'bg-blue-50 border-blue-200',
    ordem: 0,
    ativo: true,
  });

  // Item dialog state
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TransparenciaItem | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [itemForm, setItemForm] = useState({
    titulo: '',
    url: '',
    externo: true,
    ordem: 0,
    ativo: true,
  });

  // Link dialog state
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<TransparenciaLinkRapido | null>(null);
  const [linkForm, setLinkForm] = useState({
    titulo: '',
    url: '',
    icone: 'ExternalLink',
    ordem: 0,
    ativo: true,
  });

  // Queries
  const { data: categoriasComItens, isLoading: loadingCategorias } = useTransparenciaCategoriasComItens(true);
  const { data: linksRapidos, isLoading: loadingLinks } = useTransparenciaLinksRapidos(true);

  // Mutations
  const createCategoria = useCreateCategoria();
  const updateCategoria = useUpdateCategoria();
  const deleteCategoria = useDeleteCategoria();
  const createItem = useCreateItem();
  const updateItem = useUpdateItem();
  const deleteItem = useDeleteItem();
  const createLinkRapido = useCreateLinkRapido();
  const updateLinkRapido = useUpdateLinkRapido();
  const deleteLinkRapido = useDeleteLinkRapido();

  // Category handlers
  const openCategoryDialog = (category?: TransparenciaCategoria) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({
        titulo: category.titulo,
        descricao: category.descricao || '',
        icone: category.icone || 'FileText',
        cor: category.cor || 'bg-blue-50 border-blue-200',
        ordem: category.ordem || 0,
        ativo: category.ativo ?? true,
      });
    } else {
      setEditingCategory(null);
      setCategoryForm({
        titulo: '',
        descricao: '',
        icone: 'FileText',
        cor: 'bg-blue-50 border-blue-200',
        ordem: (categoriasComItens?.length || 0) + 1,
        ativo: true,
      });
    }
    setCategoryDialogOpen(true);
  };

  const handleSaveCategory = async () => {
    try {
      if (editingCategory) {
        await updateCategoria.mutateAsync({ id: editingCategory.id, ...categoryForm });
        toast.success('Categoria atualizada com sucesso!');
      } else {
        await createCategoria.mutateAsync(categoryForm);
        toast.success('Categoria criada com sucesso!');
      }
      setCategoryDialogOpen(false);
    } catch (error) {
      toast.error('Erro ao salvar categoria');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta categoria? Todos os itens serão excluídos também.')) {
      try {
        await deleteCategoria.mutateAsync(id);
        toast.success('Categoria excluída com sucesso!');
      } catch (error) {
        toast.error('Erro ao excluir categoria');
      }
    }
  };

  // Item handlers
  const openItemDialog = (categoryId: string, item?: TransparenciaItem) => {
    setSelectedCategoryId(categoryId);
    if (item) {
      setEditingItem(item);
      setItemForm({
        titulo: item.titulo,
        url: item.url,
        externo: item.externo ?? true,
        ordem: item.ordem || 0,
        ativo: item.ativo ?? true,
      });
    } else {
      setEditingItem(null);
      const category = categoriasComItens?.find(c => c.id === categoryId);
      setItemForm({
        titulo: '',
        url: '',
        externo: true,
        ordem: (category?.itens.length || 0) + 1,
        ativo: true,
      });
    }
    setItemDialogOpen(true);
  };

  const handleSaveItem = async () => {
    try {
      if (editingItem) {
        await updateItem.mutateAsync({ id: editingItem.id, ...itemForm });
        toast.success('Item atualizado com sucesso!');
      } else {
        await createItem.mutateAsync({ ...itemForm, categoria_id: selectedCategoryId });
        toast.success('Item criado com sucesso!');
      }
      setItemDialogOpen(false);
    } catch (error) {
      toast.error('Erro ao salvar item');
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      try {
        await deleteItem.mutateAsync(id);
        toast.success('Item excluído com sucesso!');
      } catch (error) {
        toast.error('Erro ao excluir item');
      }
    }
  };

  // Link handlers
  const openLinkDialog = (link?: TransparenciaLinkRapido) => {
    if (link) {
      setEditingLink(link);
      setLinkForm({
        titulo: link.titulo,
        url: link.url,
        icone: link.icone || 'ExternalLink',
        ordem: link.ordem || 0,
        ativo: link.ativo ?? true,
      });
    } else {
      setEditingLink(null);
      setLinkForm({
        titulo: '',
        url: '',
        icone: 'ExternalLink',
        ordem: (linksRapidos?.length || 0) + 1,
        ativo: true,
      });
    }
    setLinkDialogOpen(true);
  };

  const handleSaveLink = async () => {
    try {
      if (editingLink) {
        await updateLinkRapido.mutateAsync({ id: editingLink.id, ...linkForm });
        toast.success('Link atualizado com sucesso!');
      } else {
        await createLinkRapido.mutateAsync(linkForm);
        toast.success('Link criado com sucesso!');
      }
      setLinkDialogOpen(false);
    } catch (error) {
      toast.error('Erro ao salvar link');
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este link?')) {
      try {
        await deleteLinkRapido.mutateAsync(id);
        toast.success('Link excluído com sucesso!');
      } catch (error) {
        toast.error('Erro ao excluir link');
      }
    }
  };

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Portal da Transparência</h1>
            <p className="text-muted-foreground">
              Gerencie as categorias, links e informações do Portal da Transparência
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="categorias">Categorias e Itens</TabsTrigger>
            <TabsTrigger value="links">Links Rápidos</TabsTrigger>
          </TabsList>

          <TabsContent value="categorias" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => openCategoryDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Nova Categoria
              </Button>
            </div>

            {loadingCategorias ? (
              <div className="text-center py-8 text-muted-foreground">Carregando...</div>
            ) : (
              <div className="space-y-3">
                {categoriasComItens?.map((categoria) => (
                  <Collapsible
                    key={categoria.id}
                    open={expandedCategories.includes(categoria.id)}
                    onOpenChange={() => toggleCategory(categoria.id)}
                  >
                    <Card className={!categoria.ativo ? 'opacity-60' : ''}>
                      <CardHeader className="py-3">
                        <div className="flex items-center justify-between">
                          <CollapsibleTrigger className="flex items-center gap-3 flex-1 text-left">
                            <div className="text-muted-foreground">
                              {expandedCategories.includes(categoria.id) ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <CardTitle className="text-base">{categoria.titulo}</CardTitle>
                                {!categoria.ativo && (
                                  <Badge variant="secondary">Inativo</Badge>
                                )}
                              </div>
                              <CardDescription className="text-sm">
                                {categoria.descricao} • {categoria.itens.length} itens
                              </CardDescription>
                            </div>
                          </CollapsibleTrigger>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => openItemDialog(categoria.id)}>
                              <Plus className="w-4 h-4 mr-1" />
                              Item
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => openCategoryDialog(categoria)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(categoria.id)}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CollapsibleContent>
                        <CardContent className="pt-0">
                          {categoria.itens.length === 0 ? (
                            <p className="text-sm text-muted-foreground py-2">
                              Nenhum item cadastrado nesta categoria.
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {categoria.itens.map((item) => (
                                <div
                                  key={item.id}
                                  className={`flex items-center justify-between p-3 bg-muted/50 rounded-md ${!item.ativo ? 'opacity-60' : ''}`}
                                >
                                  <div className="flex items-center gap-3">
                                    {item.externo ? (
                                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                                    ) : (
                                      <LinkIcon className="w-4 h-4 text-muted-foreground" />
                                    )}
                                    <div>
                                      <p className="font-medium text-sm">{item.titulo}</p>
                                      <p className="text-xs text-muted-foreground truncate max-w-md">
                                        {item.url}
                                      </p>
                                    </div>
                                    {!item.ativo && (
                                      <Badge variant="secondary" className="text-xs">Inativo</Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => openItemDialog(categoria.id, item)}
                                    >
                                      <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleDeleteItem(item.id)}
                                    >
                                      <Trash2 className="w-4 h-4 text-destructive" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="links" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => openLinkDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Link
              </Button>
            </div>

            {loadingLinks ? (
              <div className="text-center py-8 text-muted-foreground">Carregando...</div>
            ) : (
              <div className="space-y-2">
                {linksRapidos?.map((link) => (
                  <Card key={link.id} className={!link.ativo ? 'opacity-60' : ''}>
                    <CardContent className="flex items-center justify-between py-4">
                      <div className="flex items-center gap-3">
                        <ExternalLink className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{link.titulo}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-md">
                            {link.url}
                          </p>
                        </div>
                        {!link.ativo && (
                          <Badge variant="secondary">Inativo</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openLinkDialog(link)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteLink(link.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Category Dialog */}
        <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados da categoria do Portal da Transparência.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Título</Label>
                <Input
                  value={categoryForm.titulo}
                  onChange={(e) => setCategoryForm({ ...categoryForm, titulo: e.target.value })}
                  placeholder="Ex: Despesas Públicas"
                />
              </div>
              <div>
                <Label>Descrição</Label>
                <Textarea
                  value={categoryForm.descricao}
                  onChange={(e) => setCategoryForm({ ...categoryForm, descricao: e.target.value })}
                  placeholder="Breve descrição da categoria"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Ícone</Label>
                  <Select
                    value={categoryForm.icone}
                    onValueChange={(value) => setCategoryForm({ ...categoryForm, icone: value })}
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
                  <Label>Cor</Label>
                  <Select
                    value={categoryForm.cor}
                    onValueChange={(value) => setCategoryForm({ ...categoryForm, cor: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {corOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Ordem</Label>
                  <Input
                    type="number"
                    value={categoryForm.ordem}
                    onChange={(e) => setCategoryForm({ ...categoryForm, ordem: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch
                    checked={categoryForm.ativo}
                    onCheckedChange={(checked) => setCategoryForm({ ...categoryForm, ativo: checked })}
                  />
                  <Label>Ativo</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCategoryDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveCategory}>
                {editingCategory ? 'Salvar' : 'Criar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Item Dialog */}
        <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Editar Item' : 'Novo Item'}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados do item/link da categoria.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Título</Label>
                <Input
                  value={itemForm.titulo}
                  onChange={(e) => setItemForm({ ...itemForm, titulo: e.target.value })}
                  placeholder="Ex: Execução Orçamentária"
                />
              </div>
              <div>
                <Label>URL</Label>
                <Input
                  value={itemForm.url}
                  onChange={(e) => setItemForm({ ...itemForm, url: e.target.value })}
                  placeholder="Ex: https://... ou /pagina-interna"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Ordem</Label>
                  <Input
                    type="number"
                    value={itemForm.ordem}
                    onChange={(e) => setItemForm({ ...itemForm, ordem: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch
                    checked={itemForm.externo}
                    onCheckedChange={(checked) => setItemForm({ ...itemForm, externo: checked })}
                  />
                  <Label>Link Externo</Label>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={itemForm.ativo}
                  onCheckedChange={(checked) => setItemForm({ ...itemForm, ativo: checked })}
                />
                <Label>Ativo</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setItemDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveItem}>
                {editingItem ? 'Salvar' : 'Criar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Link Dialog */}
        <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingLink ? 'Editar Link Rápido' : 'Novo Link Rápido'}
              </DialogTitle>
              <DialogDescription>
                Links rápidos aparecem no cabeçalho do Portal da Transparência.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Título</Label>
                <Input
                  value={linkForm.titulo}
                  onChange={(e) => setLinkForm({ ...linkForm, titulo: e.target.value })}
                  placeholder="Ex: Portal da Transparência"
                />
              </div>
              <div>
                <Label>URL</Label>
                <Input
                  value={linkForm.url}
                  onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                  placeholder="Ex: https://..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Ícone</Label>
                  <Select
                    value={linkForm.icone}
                    onValueChange={(value) => setLinkForm({ ...linkForm, icone: value })}
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
                    value={linkForm.ordem}
                    onChange={(e) => setLinkForm({ ...linkForm, ordem: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={linkForm.ativo}
                  onCheckedChange={(checked) => setLinkForm({ ...linkForm, ativo: checked })}
                />
                <Label>Ativo</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveLink}>
                {editingLink ? 'Salvar' : 'Criar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
