import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Pencil,
  Trash2,
  HelpCircle,
  FolderPlus,
  MessageSquarePlus,
  GripVertical,
} from "lucide-react";
import {
  useFaqCategorias,
  useFaqPerguntas,
  useCreateFaqCategoria,
  useUpdateFaqCategoria,
  useDeleteFaqCategoria,
  useCreateFaqPergunta,
  useUpdateFaqPergunta,
  useDeleteFaqPergunta,
  FaqCategoria,
  FaqPergunta,
} from "@/hooks/useFaq";

const iconOptions = [
  "HelpCircle",
  "FileText",
  "Users",
  "Building2",
  "Scale",
  "Shield",
  "MessageSquare",
  "Search",
  "Info",
  "BookOpen",
  "Briefcase",
  "Phone",
  "Mail",
  "MapPin",
  "Calendar",
];

export default function AdminFaq() {
  const { data: categorias = [], isLoading: loadingCategorias } = useFaqCategorias();
  const { data: perguntas = [], isLoading: loadingPerguntas } = useFaqPerguntas();

  const createCategoria = useCreateFaqCategoria();
  const updateCategoria = useUpdateFaqCategoria();
  const deleteCategoria = useDeleteFaqCategoria();

  const createPergunta = useCreateFaqPergunta();
  const updatePergunta = useUpdateFaqPergunta();
  const deletePergunta = useDeleteFaqPergunta();

  const [categoriaDialogOpen, setCategoriaDialogOpen] = useState(false);
  const [perguntaDialogOpen, setPerguntaDialogOpen] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<FaqCategoria | null>(null);
  const [editingPergunta, setEditingPergunta] = useState<FaqPergunta | null>(null);

  // Form states
  const [categoriaTitulo, setCategoriaTitulo] = useState("");
  const [categoriaIcone, setCategoriaIcone] = useState("HelpCircle");
  const [categoriaOrdem, setCategoriaOrdem] = useState(0);
  const [categoriaAtivo, setCategoriaAtivo] = useState(true);

  const [perguntaCategoriaId, setPerguntaCategoriaId] = useState("");
  const [perguntaTexto, setPerguntaTexto] = useState("");
  const [perguntaResposta, setPerguntaResposta] = useState("");
  const [perguntaOrdem, setPerguntaOrdem] = useState(0);
  const [perguntaAtivo, setPerguntaAtivo] = useState(true);

  const resetCategoriaForm = () => {
    setEditingCategoria(null);
    setCategoriaTitulo("");
    setCategoriaIcone("HelpCircle");
    setCategoriaOrdem(0);
    setCategoriaAtivo(true);
  };

  const resetPerguntaForm = () => {
    setEditingPergunta(null);
    setPerguntaCategoriaId("");
    setPerguntaTexto("");
    setPerguntaResposta("");
    setPerguntaOrdem(0);
    setPerguntaAtivo(true);
  };

  const openEditCategoria = (cat: FaqCategoria) => {
    setEditingCategoria(cat);
    setCategoriaTitulo(cat.titulo);
    setCategoriaIcone(cat.icone);
    setCategoriaOrdem(cat.ordem);
    setCategoriaAtivo(cat.ativo);
    setCategoriaDialogOpen(true);
  };

  const openEditPergunta = (perg: FaqPergunta) => {
    setEditingPergunta(perg);
    setPerguntaCategoriaId(perg.categoria_id);
    setPerguntaTexto(perg.pergunta);
    setPerguntaResposta(perg.resposta);
    setPerguntaOrdem(perg.ordem);
    setPerguntaAtivo(perg.ativo);
    setPerguntaDialogOpen(true);
  };

  const handleSaveCategoria = async () => {
    if (!categoriaTitulo.trim()) return;

    const data = {
      titulo: categoriaTitulo,
      icone: categoriaIcone,
      ordem: categoriaOrdem,
      ativo: categoriaAtivo,
    };

    if (editingCategoria) {
      await updateCategoria.mutateAsync({ id: editingCategoria.id, ...data });
    } else {
      await createCategoria.mutateAsync(data);
    }

    setCategoriaDialogOpen(false);
    resetCategoriaForm();
  };

  const handleSavePergunta = async () => {
    if (!perguntaTexto.trim() || !perguntaResposta.trim() || !perguntaCategoriaId) return;

    const data = {
      categoria_id: perguntaCategoriaId,
      pergunta: perguntaTexto,
      resposta: perguntaResposta,
      ordem: perguntaOrdem,
      ativo: perguntaAtivo,
    };

    if (editingPergunta) {
      await updatePergunta.mutateAsync({ id: editingPergunta.id, ...data });
    } else {
      await createPergunta.mutateAsync(data);
    }

    setPerguntaDialogOpen(false);
    resetPerguntaForm();
  };

  const getPerguntasByCategoria = (categoriaId: string) => {
    return perguntas.filter((p) => p.categoria_id === categoriaId);
  };

  const isLoading = loadingCategorias || loadingPerguntas;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <HelpCircle className="w-6 h-6" />
              Perguntas Frequentes
            </h1>
            <p className="text-muted-foreground">
              Gerencie as categorias e perguntas do FAQ
            </p>
          </div>

          <div className="flex gap-2">
            <Dialog
              open={categoriaDialogOpen}
              onOpenChange={(open) => {
                setCategoriaDialogOpen(open);
                if (!open) resetCategoriaForm();
              }}
            >
              <DialogTrigger asChild>
                <Button variant="outline">
                  <FolderPlus className="w-4 h-4 mr-2" />
                  Nova Categoria
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingCategoria ? "Editar Categoria" : "Nova Categoria"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Título</Label>
                    <Input
                      value={categoriaTitulo}
                      onChange={(e) => setCategoriaTitulo(e.target.value)}
                      placeholder="Ex: Sobre o Portal"
                    />
                  </div>
                  <div>
                    <Label>Ícone</Label>
                    <Select value={categoriaIcone} onValueChange={setCategoriaIcone}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((icon) => (
                          <SelectItem key={icon} value={icon}>
                            {icon}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Ordem</Label>
                    <Input
                      type="number"
                      value={categoriaOrdem}
                      onChange={(e) => setCategoriaOrdem(Number(e.target.value))}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={categoriaAtivo}
                      onCheckedChange={setCategoriaAtivo}
                    />
                    <Label>Ativo</Label>
                  </div>
                  <Button
                    onClick={handleSaveCategoria}
                    disabled={createCategoria.isPending || updateCategoria.isPending}
                    className="w-full"
                  >
                    {editingCategoria ? "Atualizar" : "Criar"} Categoria
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog
              open={perguntaDialogOpen}
              onOpenChange={(open) => {
                setPerguntaDialogOpen(open);
                if (!open) resetPerguntaForm();
              }}
            >
              <DialogTrigger asChild>
                <Button>
                  <MessageSquarePlus className="w-4 h-4 mr-2" />
                  Nova Pergunta
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingPergunta ? "Editar Pergunta" : "Nova Pergunta"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Categoria</Label>
                    <Select
                      value={perguntaCategoriaId}
                      onValueChange={setPerguntaCategoriaId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categorias.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.titulo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Pergunta</Label>
                    <Input
                      value={perguntaTexto}
                      onChange={(e) => setPerguntaTexto(e.target.value)}
                      placeholder="Ex: Como navegar no portal?"
                    />
                  </div>
                  <div>
                    <Label>Resposta</Label>
                    <Textarea
                      value={perguntaResposta}
                      onChange={(e) => setPerguntaResposta(e.target.value)}
                      placeholder="Digite a resposta completa..."
                      rows={5}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Ordem</Label>
                      <Input
                        type="number"
                        value={perguntaOrdem}
                        onChange={(e) => setPerguntaOrdem(Number(e.target.value))}
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-6">
                      <Switch
                        checked={perguntaAtivo}
                        onCheckedChange={setPerguntaAtivo}
                      />
                      <Label>Ativo</Label>
                    </div>
                  </div>
                  <Button
                    onClick={handleSavePergunta}
                    disabled={
                      createPergunta.isPending ||
                      updatePergunta.isPending ||
                      !perguntaCategoriaId
                    }
                    className="w-full"
                  >
                    {editingPergunta ? "Atualizar" : "Criar"} Pergunta
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Carregando...
          </div>
        ) : categorias.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhuma categoria criada</h3>
              <p className="text-muted-foreground mb-4">
                Comece criando categorias para organizar suas perguntas frequentes
              </p>
              <Button onClick={() => setCategoriaDialogOpen(true)}>
                <FolderPlus className="w-4 h-4 mr-2" />
                Criar primeira categoria
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {categorias.map((categoria) => (
              <Card key={categoria.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{categoria.titulo}</CardTitle>
                      <Badge variant={categoria.ativo ? "default" : "secondary"}>
                        {categoria.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                      <Badge variant="outline">{categoria.icone}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditCategoria(categoria)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir categoria?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação excluirá a categoria e todas as perguntas
                              associadas. Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteCategoria.mutate(categoria.id)}
                              className="bg-destructive text-destructive-foreground"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {getPerguntasByCategoria(categoria.id).length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">
                      Nenhuma pergunta nesta categoria
                    </p>
                  ) : (
                    <Accordion type="single" collapsible>
                      {getPerguntasByCategoria(categoria.id).map((pergunta) => (
                        <AccordionItem key={pergunta.id} value={pergunta.id}>
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-3 flex-1 text-left">
                              <GripVertical className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium">{pergunta.pergunta}</span>
                              {!pergunta.ativo && (
                                <Badge variant="secondary" className="ml-auto mr-2">
                                  Inativo
                                </Badge>
                              )}
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="pl-7 space-y-3">
                              <p className="text-muted-foreground whitespace-pre-wrap">
                                {pergunta.resposta}
                              </p>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openEditPergunta(pergunta)}
                                >
                                  <Pencil className="w-4 h-4 mr-1" />
                                  Editar
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      <Trash2 className="w-4 h-4 mr-1 text-destructive" />
                                      Excluir
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Excluir pergunta?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Esta ação não pode ser desfeita.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() =>
                                          deletePergunta.mutate(pergunta.id)
                                        }
                                        className="bg-destructive text-destructive-foreground"
                                      >
                                        Excluir
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{categorias.length}</div>
              <p className="text-sm text-muted-foreground">Categorias</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{perguntas.length}</div>
              <p className="text-sm text-muted-foreground">Perguntas</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
