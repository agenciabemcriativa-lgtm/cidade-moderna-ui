import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Database, Search, Filter, Download, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  useDadosAbertos,
  useCreateDadosAbertos,
  useUpdateDadosAbertos,
  useDeleteDadosAbertos,
  CategoriaDadosAbertos,
  FormatoArquivo,
  DadosAbertos,
  categoriaDadosAbertosLabels,
  formatoArquivoLabels,
} from '@/hooks/useDadosAbertos';

export default function AdminDadosAbertos() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDados, setEditingDados] = useState<DadosAbertos | null>(null);
  const [filterCategoria, setFilterCategoria] = useState<CategoriaDadosAbertos | 'all'>('all');
  const [search, setSearch] = useState('');

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    categoria: 'outros' as CategoriaDadosAbertos,
    formato: 'csv' as FormatoArquivo,
    arquivo_url: '',
    arquivo_nome: '',
    fonte: '',
    periodicidade: '',
    data_referencia: '',
    ultima_atualizacao: format(new Date(), 'yyyy-MM-dd'),
    quantidade_registros: '',
    tamanho_bytes: '',
    link_sistema_origem: '',
    observacoes: '',
    ordem: 0,
    publicado: true,
  });

  const { data: dados, isLoading } = useDadosAbertos(
    filterCategoria === 'all' ? undefined : filterCategoria,
    true
  );
  const createMutation = useCreateDadosAbertos();
  const updateMutation = useUpdateDadosAbertos();
  const deleteMutation = useDeleteDadosAbertos();

  const filteredDados = dados?.filter((d) =>
    d.titulo.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      titulo: '',
      descricao: '',
      categoria: 'outros',
      formato: 'csv',
      arquivo_url: '',
      arquivo_nome: '',
      fonte: '',
      periodicidade: '',
      data_referencia: '',
      ultima_atualizacao: format(new Date(), 'yyyy-MM-dd'),
      quantidade_registros: '',
      tamanho_bytes: '',
      link_sistema_origem: '',
      observacoes: '',
      ordem: 0,
      publicado: true,
    });
    setEditingDados(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (dado: DadosAbertos) => {
    setEditingDados(dado);
    setFormData({
      titulo: dado.titulo,
      descricao: dado.descricao || '',
      categoria: dado.categoria,
      formato: dado.formato,
      arquivo_url: dado.arquivo_url,
      arquivo_nome: dado.arquivo_nome,
      fonte: dado.fonte || '',
      periodicidade: dado.periodicidade || '',
      data_referencia: dado.data_referencia || '',
      ultima_atualizacao: dado.ultima_atualizacao,
      quantidade_registros: dado.quantidade_registros?.toString() || '',
      tamanho_bytes: dado.tamanho_bytes?.toString() || '',
      link_sistema_origem: dado.link_sistema_origem || '',
      observacoes: dado.observacoes || '',
      ordem: dado.ordem || 0,
      publicado: dado.publicado ?? true,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.titulo || !formData.arquivo_url || !formData.arquivo_nome) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    try {
      const payload = {
        titulo: formData.titulo,
        descricao: formData.descricao || null,
        categoria: formData.categoria,
        formato: formData.formato,
        arquivo_url: formData.arquivo_url,
        arquivo_nome: formData.arquivo_nome,
        fonte: formData.fonte || null,
        periodicidade: formData.periodicidade || null,
        data_referencia: formData.data_referencia || null,
        ultima_atualizacao: formData.ultima_atualizacao,
        quantidade_registros: formData.quantidade_registros ? parseInt(formData.quantidade_registros) : null,
        tamanho_bytes: formData.tamanho_bytes ? parseInt(formData.tamanho_bytes) : null,
        link_sistema_origem: formData.link_sistema_origem || null,
        observacoes: formData.observacoes || null,
        ordem: formData.ordem,
        publicado: formData.publicado,
      };

      if (editingDados) {
        await updateMutation.mutateAsync({ id: editingDados.id, ...payload });
        toast.success('Dados atualizados com sucesso!');
      } else {
        await createMutation.mutateAsync(payload);
        toast.success('Dados cadastrados com sucesso!');
      }
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Erro ao salvar dados');
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este registro?')) return;

    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Registro excluído com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir registro');
      console.error(error);
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dados Abertos</h1>
            <p className="text-muted-foreground">
              Gerencie os conjuntos de dados abertos do município
            </p>
          </div>
          <Button onClick={openCreateDialog} className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Dataset
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select
            value={filterCategoria}
            onValueChange={(v) => setFilterCategoria(v as CategoriaDadosAbertos | 'all')}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {Object.entries(categoriaDadosAbertosLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : filteredDados?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Database className="w-12 h-12 mb-4 opacity-50" />
            <p>Nenhum dado encontrado</p>
          </div>
        ) : (
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Título</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Formato</TableHead>
                  <TableHead>Atualização</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDados?.map((dado) => (
                  <TableRow key={dado.id}>
                    <TableCell className="font-medium max-w-[250px] truncate">
                      {dado.titulo}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {categoriaDadosAbertosLabels[dado.categoria]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="uppercase">
                        {dado.formato}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(dado.ultima_atualizacao), 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={dado.publicado ? 'default' : 'secondary'}>
                        {dado.publicado ? 'Publicado' : 'Rascunho'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={dado.arquivo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-muted rounded"
                        >
                          <Download className="w-4 h-4 text-muted-foreground" />
                        </a>
                        {dado.link_sistema_origem && (
                          <a
                            href={dado.link_sistema_origem}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-muted rounded"
                          >
                            <ExternalLink className="w-4 h-4 text-muted-foreground" />
                          </a>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(dado)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(dado.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingDados ? 'Editar Dataset' : 'Novo Dataset'}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Título *</Label>
                <Input
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="Título do conjunto de dados"
                />
              </div>

              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Categoria *</Label>
                  <Select
                    value={formData.categoria}
                    onValueChange={(v) => setFormData({ ...formData, categoria: v as CategoriaDadosAbertos })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoriaDadosAbertosLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Formato *</Label>
                  <Select
                    value={formData.formato}
                    onValueChange={(v) => setFormData({ ...formData, formato: v as FormatoArquivo })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(formatoArquivoLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>URL do Arquivo *</Label>
                  <Input
                    value={formData.arquivo_url}
                    onChange={(e) => setFormData({ ...formData, arquivo_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nome do Arquivo *</Label>
                  <Input
                    value={formData.arquivo_nome}
                    onChange={(e) => setFormData({ ...formData, arquivo_nome: e.target.value })}
                    placeholder="dados.csv"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fonte</Label>
                  <Input
                    value={formData.fonte}
                    onChange={(e) => setFormData({ ...formData, fonte: e.target.value })}
                    placeholder="Ex: Secretaria de Finanças"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Periodicidade</Label>
                  <Input
                    value={formData.periodicidade}
                    onChange={(e) => setFormData({ ...formData, periodicidade: e.target.value })}
                    placeholder="Ex: Mensal, Anual"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data de Referência</Label>
                  <Input
                    type="date"
                    value={formData.data_referencia}
                    onChange={(e) => setFormData({ ...formData, data_referencia: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Última Atualização *</Label>
                  <Input
                    type="date"
                    value={formData.ultima_atualizacao}
                    onChange={(e) => setFormData({ ...formData, ultima_atualizacao: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Qtd. Registros</Label>
                  <Input
                    type="number"
                    value={formData.quantidade_registros}
                    onChange={(e) => setFormData({ ...formData, quantidade_registros: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tamanho (bytes)</Label>
                  <Input
                    type="number"
                    value={formData.tamanho_bytes}
                    onChange={(e) => setFormData({ ...formData, tamanho_bytes: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Link Sistema Origem</Label>
                  <Input
                    value={formData.link_sistema_origem}
                    onChange={(e) => setFormData({ ...formData, link_sistema_origem: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ordem de Exibição</Label>
                  <Input
                    type="number"
                    value={formData.ordem}
                    onChange={(e) => setFormData({ ...formData, ordem: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.publicado}
                  onCheckedChange={(checked) => setFormData({ ...formData, publicado: checked })}
                />
                <Label>Publicado</Label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave}>
                  {editingDados ? 'Salvar' : 'Cadastrar'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
