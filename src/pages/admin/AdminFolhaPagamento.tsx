import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useFolhaPagamento, useCreateFolhaPagamento, useUpdateFolhaPagamento, useDeleteFolhaPagamento, mesesLabels, categoriasLabels, CategoriaFolha, FolhaPagamento, FolhaPagamentoInput } from '@/hooks/useFolhaPagamento';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, FileText, ExternalLink, Search } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const currentYear = new Date().getFullYear();
const anos = Array.from({ length: 10 }, (_, i) => currentYear - i);
const meses = Array.from({ length: 12 }, (_, i) => i + 1);

export default function AdminFolhaPagamento() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<FolhaPagamento | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [anoFiltro, setAnoFiltro] = useState<string>('all');

  const { data: documentos, isLoading } = useFolhaPagamento(
    anoFiltro !== 'all' ? parseInt(anoFiltro) : undefined,
    true
  );
  const createMutation = useCreateFolhaPagamento();
  const updateMutation = useUpdateFolhaPagamento();
  const deleteMutation = useDeleteFolhaPagamento();

  const [formData, setFormData] = useState<FolhaPagamentoInput>({
    titulo: '',
    mes_referencia: new Date().getMonth() + 1,
    ano_referencia: currentYear,
    arquivo_url: '',
    arquivo_nome: '',
    categoria: 'prefeitura',
    data_postagem: format(new Date(), 'yyyy-MM-dd'),
    publicado: true,
  });

  const resetForm = () => {
    setFormData({
      titulo: '',
      mes_referencia: new Date().getMonth() + 1,
      ano_referencia: currentYear,
      arquivo_url: '',
      arquivo_nome: '',
      categoria: 'prefeitura',
      data_postagem: format(new Date(), 'yyyy-MM-dd'),
      publicado: true,
    });
    setEditingDoc(null);
  };

  const handleOpenDialog = (doc?: FolhaPagamento) => {
    if (doc) {
      setEditingDoc(doc);
      setFormData({
        titulo: doc.titulo,
        mes_referencia: doc.mes_referencia,
        ano_referencia: doc.ano_referencia,
        arquivo_url: doc.arquivo_url,
        arquivo_nome: doc.arquivo_nome,
        categoria: (doc.categoria as CategoriaFolha) || 'prefeitura',
        data_postagem: doc.data_postagem || format(new Date(), 'yyyy-MM-dd'),
        publicado: doc.publicado ?? true,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.titulo.trim()) {
      toast.error('Preencha o título.');
      return;
    }

    if (!formData.arquivo_url) {
      toast.error('Preencha o link do arquivo.');
      return;
    }

    // Gerar nome do arquivo automaticamente
    const arquivo_nome = `folha-${formData.categoria}-${formData.mes_referencia}-${formData.ano_referencia}.pdf`;
    
    const dataToSubmit = {
      ...formData,
      arquivo_nome,
    };

    try {
      if (editingDoc) {
        await updateMutation.mutateAsync({ id: editingDoc.id, ...dataToSubmit });
        toast.success('Documento atualizado com sucesso!');
      } else {
        await createMutation.mutateAsync(dataToSubmit);
        toast.success('Documento cadastrado com sucesso!');
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar documento.';
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este documento?')) return;

    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Documento excluído com sucesso!');
    } catch {
      toast.error('Erro ao excluir documento.');
    }
  };

  const filteredDocs = documentos?.filter((doc) => {
    const matchSearch = doc.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.arquivo_nome.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Folha de Pagamento</h1>
            <p className="text-muted-foreground">
              Gerencie os documentos mensais da folha de pagamento
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Documento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingDoc ? 'Editar Documento' : 'Novo Documento'}
                </DialogTitle>
                <DialogDescription>
                  Preencha os dados do documento da folha de pagamento
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="titulo">Título *</Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    placeholder="Ex: Folha de Pagamento - Janeiro/2025"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mes">Mês *</Label>
                    <Select
                      value={formData.mes_referencia.toString()}
                      onValueChange={(value) => setFormData({ ...formData, mes_referencia: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o mês" />
                      </SelectTrigger>
                      <SelectContent>
                        {meses.map((mes) => (
                          <SelectItem key={mes} value={mes.toString()}>
                            {mesesLabels[mes]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="ano">Ano *</Label>
                    <Select
                      value={formData.ano_referencia.toString()}
                      onValueChange={(value) => setFormData({ ...formData, ano_referencia: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o ano" />
                      </SelectTrigger>
                      <SelectContent>
                        {anos.map((ano) => (
                          <SelectItem key={ano} value={ano.toString()}>
                            {ano}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="categoria">Categoria *</Label>
                    <Select
                      value={formData.categoria}
                      onValueChange={(value) => setFormData({ ...formData, categoria: value as CategoriaFolha })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="prefeitura">Prefeitura</SelectItem>
                        <SelectItem value="educacao">Educação</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="data_postagem">Data de Postagem *</Label>
                    <Input
                      id="data_postagem"
                      type="date"
                      value={formData.data_postagem}
                      onChange={(e) => setFormData({ ...formData, data_postagem: e.target.value })}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="arquivo_url">Link do Arquivo (PDF) *</Label>
                    <Input
                      id="arquivo_url"
                      type="url"
                      value={formData.arquivo_url}
                      onChange={(e) => setFormData({ ...formData, arquivo_url: e.target.value })}
                      placeholder="Cole aqui o link do arquivo PDF"
                    />
                  </div>

                  <div className="md:col-span-2 flex items-center gap-2">
                    <Switch
                      id="publicado"
                      checked={formData.publicado}
                      onCheckedChange={(checked) => setFormData({ ...formData, publicado: checked })}
                    />
                    <Label htmlFor="publicado">Publicado</Label>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {createMutation.isPending || updateMutation.isPending ? 'Salvando...' : 'Salvar'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <Label className="mb-2 block">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por título ou arquivo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="min-w-[180px]">
                <Label className="mb-2 block">Ano</Label>
                <Select value={anoFiltro} onValueChange={setAnoFiltro}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os anos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os anos</SelectItem>
                    {anos.map((ano) => (
                      <SelectItem key={ano} value={ano.toString()}>
                        {ano}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabela */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documentos Cadastrados
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12" />
                ))}
              </div>
            ) : filteredDocs && filteredDocs.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Referência</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Data Postagem</TableHead>
                      <TableHead>Arquivo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocs.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">
                          {mesesLabels[doc.mes_referencia]} / {doc.ano_referencia}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            doc.categoria === 'educacao' 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                              : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                          }`}>
                            {categoriasLabels[doc.categoria as CategoriaFolha] || doc.categoria}
                          </span>
                        </TableCell>
                        <TableCell>
                          {doc.data_postagem ? format(new Date(doc.data_postagem), 'dd/MM/yyyy', { locale: ptBR }) : '-'}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(doc.arquivo_url, '_blank')}
                            className="text-primary hover:text-primary/80"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              doc.publicado
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                            }`}
                          >
                            {doc.publicado ? 'Publicado' : 'Rascunho'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
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
                              onClick={() => handleDelete(doc.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Nenhum documento encontrado.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
