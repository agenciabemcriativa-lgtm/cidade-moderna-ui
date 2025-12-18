import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Upload, 
  FileText, 
  ExternalLink,
  Search,
  Filter,
  BookOpen
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  useDocumentosLegislacao,
  useCreateDocumentoLegislacao,
  useUpdateDocumentoLegislacao,
  useDeleteDocumentoLegislacao,
  uploadArquivoLegislacao,
  deleteArquivoLegislacao,
  tipoDocumentoLabels,
  TipoDocumentoLegislacao,
  DocumentoLegislacao,
} from "@/hooks/useDocumentosLegislacao";

const tiposDocumento: { value: TipoDocumentoLegislacao; label: string }[] = [
  { value: 'lei_organica', label: 'Lei Orgânica' },
  { value: 'ppa', label: 'PPA - Plano Plurianual' },
  { value: 'ldo', label: 'LDO - Lei de Diretrizes Orçamentárias' },
  { value: 'loa', label: 'LOA - Lei Orçamentária Anual' },
  { value: 'emenda_lei_organica', label: 'Emenda à Lei Orgânica' },
  { value: 'outro', label: 'Outro' },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 20 }, (_, i) => currentYear - i);

export default function AdminLegislacao() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingDocumento, setEditingDocumento] = useState<DocumentoLegislacao | null>(null);
  const [documentoToDelete, setDocumentoToDelete] = useState<DocumentoLegislacao | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Filters
  const [filterTipo, setFilterTipo] = useState<string>("all");
  const [filterAno, setFilterAno] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    titulo: "",
    tipo: "lei_organica" as TipoDocumentoLegislacao,
    ano: currentYear,
    descricao: "",
    data_publicacao: format(new Date(), "yyyy-MM-dd"),
    vigente: true,
    observacoes: "",
    arquivo_url: "",
    arquivo_nome: "",
  });

  const { data: documentos, isLoading } = useDocumentosLegislacao({
    tipo: filterTipo !== "all" ? filterTipo as TipoDocumentoLegislacao : undefined,
    ano: filterAno !== "all" ? parseInt(filterAno) : undefined,
  });

  const createMutation = useCreateDocumentoLegislacao();
  const updateMutation = useUpdateDocumentoLegislacao();
  const deleteMutation = useDeleteDocumentoLegislacao();

  const filteredDocumentos = documentos?.filter(doc => 
    doc.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: "Erro",
          description: "Apenas arquivos PDF são permitidos",
          variant: "destructive",
        });
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        toast({
          title: "Erro",
          description: "O arquivo deve ter no máximo 20MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleOpenDialog = (documento?: DocumentoLegislacao) => {
    if (documento) {
      setEditingDocumento(documento);
      setFormData({
        titulo: documento.titulo,
        tipo: documento.tipo,
        ano: documento.ano,
        descricao: documento.descricao || "",
        data_publicacao: documento.data_publicacao,
        vigente: documento.vigente,
        observacoes: documento.observacoes || "",
        arquivo_url: documento.arquivo_url,
        arquivo_nome: documento.arquivo_nome,
      });
    } else {
      setEditingDocumento(null);
      setFormData({
        titulo: "",
        tipo: "lei_organica",
        ano: currentYear,
        descricao: "",
        data_publicacao: format(new Date(), "yyyy-MM-dd"),
        vigente: true,
        observacoes: "",
        arquivo_url: "",
        arquivo_nome: "",
      });
    }
    setSelectedFile(null);
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.titulo.trim()) {
      toast({
        title: "Erro",
        description: "O título é obrigatório",
        variant: "destructive",
      });
      return;
    }

    if (!selectedFile && !formData.arquivo_url) {
      toast({
        title: "Erro",
        description: "É necessário fazer upload de um arquivo PDF",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      let arquivo_url = formData.arquivo_url;
      let arquivo_nome = formData.arquivo_nome;

      if (selectedFile) {
        const result = await uploadArquivoLegislacao(selectedFile);
        arquivo_url = result.url;
        arquivo_nome = result.nome;
      }

      const documentoData = {
        titulo: formData.titulo,
        tipo: formData.tipo,
        ano: formData.ano,
        descricao: formData.descricao || null,
        data_publicacao: formData.data_publicacao,
        vigente: formData.vigente,
        observacoes: formData.observacoes || null,
        arquivo_url,
        arquivo_nome,
      };

      if (editingDocumento) {
        await updateMutation.mutateAsync({ id: editingDocumento.id, ...documentoData });
        toast({
          title: "Sucesso",
          description: "Documento atualizado com sucesso",
        });
      } else {
        await createMutation.mutateAsync(documentoData);
        toast({
          title: "Sucesso",
          description: "Documento cadastrado com sucesso",
        });
      }

      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar documento",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!documentoToDelete) return;

    try {
      // Delete file from storage
      if (documentoToDelete.arquivo_url) {
        await deleteArquivoLegislacao(documentoToDelete.arquivo_url);
      }
      
      await deleteMutation.mutateAsync(documentoToDelete.id);
      toast({
        title: "Sucesso",
        description: "Documento excluído com sucesso",
      });
      setIsDeleteDialogOpen(false);
      setDocumentoToDelete(null);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir documento",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              Documentos de Legislação
            </h1>
            <p className="text-muted-foreground">
              Gerencie Lei Orgânica, PPA, LDO, LOA e outros documentos
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Documento
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por título..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterTipo} onValueChange={setFilterTipo}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de documento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  {tiposDocumento.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterAno} onValueChange={setFilterAno}>
                <SelectTrigger>
                  <SelectValue placeholder="Ano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os anos</SelectItem>
                  {years.map((ano) => (
                    <SelectItem key={ano} value={ano.toString()}>
                      {ano}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Ano</TableHead>
                  <TableHead>Data Publicação</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Arquivo</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : filteredDocumentos?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Nenhum documento encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocumentos?.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium max-w-[200px] truncate">
                        {doc.titulo}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {tipoDocumentoLabels[doc.tipo]}
                        </Badge>
                      </TableCell>
                      <TableCell>{doc.ano}</TableCell>
                      <TableCell>
                        {format(new Date(doc.data_publicacao), "dd/MM/yyyy", { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        <Badge variant={doc.vigente ? "default" : "outline"}>
                          {doc.vigente ? "Vigente" : "Não vigente"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <a
                          href={doc.arquivo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline text-sm"
                        >
                          <FileText className="h-3 w-3" />
                          PDF
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(doc)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setDocumentoToDelete(doc);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
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

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingDocumento ? "Editar Documento" : "Novo Documento"}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados do documento de legislação
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="titulo">Título *</Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    placeholder="Ex: Lei Orgânica do Município de Ipubi"
                  />
                </div>

                <div>
                  <Label htmlFor="tipo">Tipo *</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(value) => setFormData({ ...formData, tipo: value as TipoDocumentoLegislacao })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposDocumento.map((tipo) => (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="ano">Ano *</Label>
                  <Select
                    value={formData.ano.toString()}
                    onValueChange={(value) => setFormData({ ...formData, ano: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((ano) => (
                        <SelectItem key={ano} value={ano.toString()}>
                          {ano}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="data_publicacao">Data de Publicação *</Label>
                  <Input
                    id="data_publicacao"
                    type="date"
                    value={formData.data_publicacao}
                    onChange={(e) => setFormData({ ...formData, data_publicacao: e.target.value })}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="vigente"
                    checked={formData.vigente}
                    onCheckedChange={(checked) => setFormData({ ...formData, vigente: checked })}
                  />
                  <Label htmlFor="vigente">Documento Vigente</Label>
                </div>

                <div className="col-span-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Breve descrição do documento"
                    rows={2}
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    value={formData.observacoes}
                    onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                    placeholder="Observações adicionais"
                    rows={2}
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="arquivo">Arquivo PDF *</Label>
                  <div className="mt-2">
                    {formData.arquivo_url && !selectedFile && (
                      <div className="flex items-center gap-2 mb-2 p-2 bg-muted rounded-lg">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="text-sm truncate flex-1">{formData.arquivo_nome}</span>
                        <a
                          href={formData.arquivo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm"
                        >
                          Ver
                        </a>
                      </div>
                    )}
                    {selectedFile && (
                      <div className="flex items-center gap-2 mb-2 p-2 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <FileText className="h-4 w-4 text-green-600" />
                        <span className="text-sm truncate flex-1">{selectedFile.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedFile(null)}
                        >
                          Remover
                        </Button>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Input
                        id="arquivo"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('arquivo')?.click()}
                        className="gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        {formData.arquivo_url ? "Substituir arquivo" : "Selecionar arquivo"}
                      </Button>
                      <span className="text-xs text-muted-foreground">
                        Apenas PDF, máx. 20MB
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit} disabled={isUploading}>
                {isUploading ? "Salvando..." : editingDocumento ? "Salvar" : "Cadastrar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir o documento "{documentoToDelete?.titulo}"?
                Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
