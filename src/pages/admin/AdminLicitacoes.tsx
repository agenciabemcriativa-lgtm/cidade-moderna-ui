import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, FileText, ExternalLink, Search, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  useLicitacoes,
  useLicitacao,
  useCreateLicitacao,
  useUpdateLicitacao,
  useDeleteLicitacao,
  useCreateDocumento,
  useDeleteDocumento,
  modalidadeLabels,
  statusLabels,
  statusColors,
  tipoDocumentoLabels,
  ModalidadeLicitacao,
  StatusLicitacao,
  TipoDocumentoLicitacao,
  Licitacao,
} from "@/hooks/useLicitacoes";
import { useSecretarias } from "@/hooks/useSecretarias";
import { Skeleton } from "@/components/ui/skeleton";

type LicitacaoFormData = {
  numero_processo: string;
  modalidade: ModalidadeLicitacao;
  objeto: string;
  secretaria_id: string | null;
  secretaria_nome: string | null;
  data_abertura: string;
  data_encerramento: string;
  ano: number;
  status: StatusLicitacao;
  valor_estimado: string;
  observacoes: string;
  link_sistema_oficial: string;
  publicado: boolean;
};

type DocumentoFormData = {
  tipo: TipoDocumentoLicitacao;
  titulo: string;
  descricao: string;
  url: string;
  data_publicacao: string;
};

const initialFormData: LicitacaoFormData = {
  numero_processo: "",
  modalidade: "pregao_eletronico",
  objeto: "",
  secretaria_id: null,
  secretaria_nome: null,
  data_abertura: "",
  data_encerramento: "",
  ano: new Date().getFullYear(),
  status: "aberta",
  valor_estimado: "",
  observacoes: "",
  link_sistema_oficial: "",
  publicado: true,
};

const initialDocumentoFormData: DocumentoFormData = {
  tipo: "edital",
  titulo: "",
  descricao: "",
  url: "",
  data_publicacao: new Date().toISOString().split('T')[0],
};

export default function AdminLicitacoes() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDocDialogOpen, setIsDocDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLicitacao, setSelectedLicitacao] = useState<Licitacao | null>(null);
  const [selectedLicitacaoId, setSelectedLicitacaoId] = useState<string | null>(null);
  const [formData, setFormData] = useState<LicitacaoFormData>(initialFormData);
  const [docFormData, setDocFormData] = useState<DocumentoFormData>(initialDocumentoFormData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [activeTab, setActiveTab] = useState("lista");

  const { data: licitacoes, isLoading } = useLicitacoes({ publicadoOnly: false, busca: searchTerm, status: filterStatus as StatusLicitacao || undefined });
  const { data: licitacaoDetalhes } = useLicitacao(selectedLicitacaoId || "");
  const { data: secretarias } = useSecretarias();
  const createLicitacao = useCreateLicitacao();
  const updateLicitacao = useUpdateLicitacao();
  const deleteLicitacao = useDeleteLicitacao();
  const createDocumento = useCreateDocumento();
  const deleteDocumento = useDeleteDocumento();

  const handleOpenCreate = () => {
    setSelectedLicitacao(null);
    setFormData(initialFormData);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (licitacao: Licitacao) => {
    setSelectedLicitacao(licitacao);
    setFormData({
      numero_processo: licitacao.numero_processo,
      modalidade: licitacao.modalidade,
      objeto: licitacao.objeto,
      secretaria_id: licitacao.secretaria_id,
      secretaria_nome: licitacao.secretaria_nome,
      data_abertura: licitacao.data_abertura,
      data_encerramento: licitacao.data_encerramento || "",
      ano: licitacao.ano,
      status: licitacao.status,
      valor_estimado: licitacao.valor_estimado?.toString() || "",
      observacoes: licitacao.observacoes || "",
      link_sistema_oficial: licitacao.link_sistema_oficial || "",
      publicado: licitacao.publicado,
    });
    setIsDialogOpen(true);
  };

  const handleOpenDelete = (licitacao: Licitacao) => {
    setSelectedLicitacao(licitacao);
    setDeleteDialogOpen(true);
  };

  const handleOpenDocumentos = (licitacao: Licitacao) => {
    setSelectedLicitacaoId(licitacao.id);
    setSelectedLicitacao(licitacao);
    setActiveTab("documentos");
  };

  const handleBackToList = () => {
    setSelectedLicitacaoId(null);
    setActiveTab("lista");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedSecretaria = secretarias?.find(s => s.slug === formData.secretaria_id);
    
    const data = {
      numero_processo: formData.numero_processo,
      modalidade: formData.modalidade,
      objeto: formData.objeto,
      secretaria_id: null, // We don't have direct ID access, using null
      secretaria_nome: selectedSecretaria?.nome || formData.secretaria_nome || null,
      data_abertura: formData.data_abertura,
      data_encerramento: formData.data_encerramento || null,
      ano: formData.ano,
      status: formData.status,
      valor_estimado: formData.valor_estimado ? parseFloat(formData.valor_estimado) : null,
      observacoes: formData.observacoes || null,
      link_sistema_oficial: formData.link_sistema_oficial || null,
      publicado: formData.publicado,
    };

    try {
      if (selectedLicitacao) {
        await updateLicitacao.mutateAsync({ id: selectedLicitacao.id, ...data });
        toast.success("Licitação atualizada com sucesso!");
      } else {
        await createLicitacao.mutateAsync(data as any);
        toast.success("Licitação criada com sucesso!");
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Erro ao salvar licitação");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!selectedLicitacao) return;
    
    try {
      await deleteLicitacao.mutateAsync(selectedLicitacao.id);
      toast.success("Licitação excluída com sucesso!");
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Erro ao excluir licitação");
      console.error(error);
    }
  };

  const handleAddDocumento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLicitacaoId) return;

    try {
      await createDocumento.mutateAsync({
        licitacao_id: selectedLicitacaoId,
        tipo: docFormData.tipo,
        titulo: docFormData.titulo,
        descricao: docFormData.descricao || null,
        url: docFormData.url,
        data_publicacao: docFormData.data_publicacao,
        ordem: 0,
      } as any);
      toast.success("Documento adicionado com sucesso!");
      setDocFormData(initialDocumentoFormData);
      setIsDocDialogOpen(false);
    } catch (error) {
      toast.error("Erro ao adicionar documento");
      console.error(error);
    }
  };

  const handleDeleteDocumento = async (docId: string) => {
    if (!selectedLicitacaoId) return;
    
    try {
      await deleteDocumento.mutateAsync({ id: docId, licitacaoId: selectedLicitacaoId });
      toast.success("Documento excluído com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir documento");
      console.error(error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Licitações</h1>
            <p className="text-muted-foreground">
              Gerencie os processos licitatórios do município
            </p>
          </div>
          <Button onClick={handleOpenCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Licitação
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por número ou objeto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              {Object.entries(statusLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="lista">Lista de Licitações</TabsTrigger>
            <TabsTrigger value="documentos" disabled={!selectedLicitacaoId}>
              Documentos {selectedLicitacao && `(${selectedLicitacao.numero_processo})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lista">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Processo</TableHead>
                      <TableHead className="hidden md:table-cell">Modalidade</TableHead>
                      <TableHead>Objeto</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Data Abertura</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {licitacoes?.map((licitacao) => (
                      <TableRow key={licitacao.id}>
                        <TableCell className="font-mono text-sm">
                          {licitacao.numero_processo}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline">
                            {modalidadeLabels[licitacao.modalidade]}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {licitacao.objeto}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${statusColors[licitacao.status]} text-white`}>
                            {statusLabels[licitacao.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {format(new Date(licitacao.data_abertura), "dd/MM/yyyy", { locale: ptBR })}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenDocumentos(licitacao)}
                              title="Gerenciar documentos"
                            >
                              <FileText className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenEdit(licitacao)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => handleOpenDelete(licitacao)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!licitacoes || licitacoes.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          Nenhuma licitação encontrada
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="documentos">
            {selectedLicitacaoId && licitacaoDetalhes && (
              <Card>
                <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Button variant="ghost" size="icon" onClick={handleBackToList}>
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                      <CardTitle>Documentos da Licitação</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        <span className="font-mono">{licitacaoDetalhes.numero_processo}</span> - {licitacaoDetalhes.objeto.substring(0, 80)}...
                      </p>
                    </div>
                  </div>
                  <Dialog open={isDocDialogOpen} onOpenChange={setIsDocDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Documento
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Documento</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleAddDocumento} className="space-y-4">
                        <div>
                          <Label>Tipo de Documento</Label>
                          <Select
                            value={docFormData.tipo}
                            onValueChange={(v) => setDocFormData({ ...docFormData, tipo: v as TipoDocumentoLicitacao })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(tipoDocumentoLabels).map(([key, label]) => (
                                <SelectItem key={key} value={key}>{label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Título</Label>
                          <Input
                            value={docFormData.titulo}
                            onChange={(e) => setDocFormData({ ...docFormData, titulo: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label>Descrição (opcional)</Label>
                          <Textarea
                            value={docFormData.descricao}
                            onChange={(e) => setDocFormData({ ...docFormData, descricao: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>URL do Documento</Label>
                          <Input
                            type="url"
                            value={docFormData.url}
                            onChange={(e) => setDocFormData({ ...docFormData, url: e.target.value })}
                            placeholder="https://..."
                            required
                          />
                        </div>
                        <div>
                          <Label>Data de Publicação</Label>
                          <Input
                            type="date"
                            value={docFormData.data_publicacao}
                            onChange={(e) => setDocFormData({ ...docFormData, data_publicacao: e.target.value })}
                            required
                          />
                        </div>
                        <DialogFooter>
                          <Button type="submit" disabled={createDocumento.isPending}>
                            Adicionar
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {licitacaoDetalhes.documentos_licitacao && licitacaoDetalhes.documentos_licitacao.length > 0 ? (
                    <div className="space-y-2">
                      {licitacaoDetalhes.documentos_licitacao.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-3 rounded-lg border"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{doc.titulo}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Badge variant="outline">
                                  {tipoDocumentoLabels[doc.tipo]}
                                </Badge>
                                <span>
                                  {format(new Date(doc.data_publicacao), "dd/MM/yyyy", { locale: ptBR })}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" asChild>
                              <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => handleDeleteDocumento(doc.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-muted-foreground">
                      Nenhum documento cadastrado
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
            {!selectedLicitacaoId && (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Selecione uma licitação na aba "Lista de Licitações" para gerenciar seus documentos.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Form Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedLicitacao ? "Editar Licitação" : "Nova Licitação"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Número do Processo *</Label>
                  <Input
                    value={formData.numero_processo}
                    onChange={(e) => setFormData({ ...formData, numero_processo: e.target.value })}
                    placeholder="Ex: 001/2024"
                    required
                  />
                </div>
                <div>
                  <Label>Ano *</Label>
                  <Input
                    type="number"
                    value={formData.ano}
                    onChange={(e) => setFormData({ ...formData, ano: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Modalidade *</Label>
                  <Select
                    value={formData.modalidade}
                    onValueChange={(v) => setFormData({ ...formData, modalidade: v as ModalidadeLicitacao })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(modalidadeLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(v) => setFormData({ ...formData, status: v as StatusLicitacao })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Objeto *</Label>
                <Textarea
                  value={formData.objeto}
                  onChange={(e) => setFormData({ ...formData, objeto: e.target.value })}
                  placeholder="Descrição clara e objetiva do objeto da licitação"
                  rows={3}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Data de Abertura *</Label>
                  <Input
                    type="date"
                    value={formData.data_abertura}
                    onChange={(e) => setFormData({ ...formData, data_abertura: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Data de Encerramento</Label>
                  <Input
                    type="date"
                    value={formData.data_encerramento}
                    onChange={(e) => setFormData({ ...formData, data_encerramento: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Secretaria Demandante</Label>
                  <Select
                    value={formData.secretaria_id || "none"}
                    onValueChange={(v) => setFormData({ ...formData, secretaria_id: v === "none" ? null : v, secretaria_nome: secretarias?.find(s => s.slug === v)?.nome || null })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Não especificado</SelectItem>
                      {secretarias?.map((sec) => (
                        <SelectItem key={sec.slug} value={sec.slug}>{sec.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Valor Estimado (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.valor_estimado}
                    onChange={(e) => setFormData({ ...formData, valor_estimado: e.target.value })}
                    placeholder="0,00"
                  />
                </div>
              </div>

              <div>
                <Label>Link Sistema Oficial</Label>
                <Input
                  type="url"
                  value={formData.link_sistema_oficial}
                  onChange={(e) => setFormData({ ...formData, link_sistema_oficial: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div>
                <Label>Observações</Label>
                <Textarea
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="publicado"
                  checked={formData.publicado}
                  onCheckedChange={(checked) => setFormData({ ...formData, publicado: checked })}
                />
                <Label htmlFor="publicado">Publicar licitação</Label>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createLicitacao.isPending || updateLicitacao.isPending}
                >
                  {selectedLicitacao ? "Salvar" : "Criar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir Licitação</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir a licitação "{selectedLicitacao?.numero_processo}"?
                Esta ação não pode ser desfeita e todos os documentos associados serão removidos.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}
