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
import { Plus, Pencil, Trash2, FileText, Download, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  useRelatoriosFiscais,
  useCreateRelatorioFiscal,
  useUpdateRelatorioFiscal,
  useDeleteRelatorioFiscal,
  TipoRelatorioFiscal,
  RelatorioFiscal,
  tipoRelatorioLabels,
  bimestreLabels,
  quadrimestreLabels,
} from '@/hooks/useRelatoriosFiscais';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

export default function AdminRelatoriosFiscais() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRelatorio, setEditingRelatorio] = useState<RelatorioFiscal | null>(null);
  const [filterTipo, setFilterTipo] = useState<TipoRelatorioFiscal | 'all'>('all');
  const [filterAno, setFilterAno] = useState<number | 'all'>('all');
  const [search, setSearch] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    tipo: 'rreo' as TipoRelatorioFiscal,
    titulo: '',
    descricao: '',
    ano: currentYear,
    bimestre: null as number | null,
    quadrimestre: null as number | null,
    exercicio: '',
    data_publicacao: format(new Date(), 'yyyy-MM-dd'),
    arquivo_url: '',
    arquivo_nome: '',
    observacoes: '',
    publicado: true,
  });

  const { data: relatorios, isLoading } = useRelatoriosFiscais(
    filterTipo === 'all' ? undefined : filterTipo,
    filterAno === 'all' ? undefined : filterAno,
    true
  );
  const createMutation = useCreateRelatorioFiscal();
  const updateMutation = useUpdateRelatorioFiscal();
  const deleteMutation = useDeleteRelatorioFiscal();

  const filteredRelatorios = relatorios?.filter((r) =>
    r.titulo.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      tipo: 'rreo',
      titulo: '',
      descricao: '',
      ano: currentYear,
      bimestre: null,
      quadrimestre: null,
      exercicio: '',
      data_publicacao: format(new Date(), 'yyyy-MM-dd'),
      arquivo_url: '',
      arquivo_nome: '',
      observacoes: '',
      publicado: true,
    });
    setEditingRelatorio(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (relatorio: RelatorioFiscal) => {
    setEditingRelatorio(relatorio);
    setFormData({
      tipo: relatorio.tipo,
      titulo: relatorio.titulo,
      descricao: relatorio.descricao || '',
      ano: relatorio.ano,
      bimestre: relatorio.bimestre,
      quadrimestre: relatorio.quadrimestre,
      exercicio: relatorio.exercicio || '',
      data_publicacao: relatorio.data_publicacao,
      arquivo_url: relatorio.arquivo_url,
      arquivo_nome: relatorio.arquivo_nome,
      observacoes: relatorio.observacoes || '',
      publicado: relatorio.publicado,
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
        ...formData,
        descricao: formData.descricao || null,
        exercicio: formData.exercicio || null,
        observacoes: formData.observacoes || null,
      };

      if (editingRelatorio) {
        await updateMutation.mutateAsync({ id: editingRelatorio.id, ...payload });
        toast.success('Relatório atualizado com sucesso!');
      } else {
        await createMutation.mutateAsync(payload);
        toast.success('Relatório cadastrado com sucesso!');
      }
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Erro ao salvar relatório');
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este relatório?')) return;

    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Relatório excluído com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir relatório');
      console.error(error);
    }
  };

  const getPeriodicidadeLabel = (relatorio: RelatorioFiscal) => {
    if (relatorio.tipo === 'rreo' && relatorio.bimestre) {
      return bimestreLabels[relatorio.bimestre];
    }
    if (relatorio.tipo === 'rgf' && relatorio.quadrimestre) {
      return quadrimestreLabels[relatorio.quadrimestre];
    }
    if (relatorio.exercicio) {
      return relatorio.exercicio;
    }
    return '-';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Relatórios Fiscais</h1>
            <p className="text-gray-600">
              Gerencie RREO, RGF, Pareceres do TCE e Prestação de Contas
            </p>
          </div>
          <Button onClick={openCreateDialog} className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Relatório
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por título..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select
            value={filterTipo}
            onValueChange={(v) => setFilterTipo(v as TipoRelatorioFiscal | 'all')}
          >
            <SelectTrigger className="w-full sm:w-[220px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              {Object.entries(tipoRelatorioLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={String(filterAno)}
            onValueChange={(v) => setFilterAno(v === 'all' ? 'all' : Number(v))}
          >
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os anos</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
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
        ) : filteredRelatorios?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <FileText className="w-12 h-12 mb-4 opacity-50" />
            <p>Nenhum relatório encontrado</p>
          </div>
        ) : (
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Tipo</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Ano</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Data Publicação</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRelatorios?.map((relatorio) => (
                  <TableRow key={relatorio.id}>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {relatorio.tipo.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium max-w-[300px] truncate">
                      {relatorio.titulo}
                    </TableCell>
                    <TableCell>{relatorio.ano}</TableCell>
                    <TableCell>{getPeriodicidadeLabel(relatorio)}</TableCell>
                    <TableCell>
                      {format(new Date(relatorio.data_publicacao), 'dd/MM/yyyy', {
                        locale: ptBR,
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={relatorio.publicado ? 'default' : 'secondary'}>
                        {relatorio.publicado ? 'Publicado' : 'Rascunho'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={relatorio.arquivo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-gray-100 rounded"
                        >
                          <Download className="w-4 h-4 text-gray-600" />
                        </a>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(relatorio)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(relatorio.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
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
                {editingRelatorio ? 'Editar Relatório' : 'Novo Relatório'}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo *</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(v) =>
                      setFormData({
                        ...formData,
                        tipo: v as TipoRelatorioFiscal,
                        bimestre: null,
                        quadrimestre: null,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(tipoRelatorioLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Ano *</Label>
                  <Select
                    value={String(formData.ano)}
                    onValueChange={(v) => setFormData({ ...formData, ano: Number(v) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
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

              {formData.tipo === 'rreo' && (
                <div className="space-y-2">
                  <Label>Bimestre</Label>
                  <Select
                    value={formData.bimestre ? String(formData.bimestre) : ''}
                    onValueChange={(v) =>
                      setFormData({ ...formData, bimestre: v ? Number(v) : null })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o bimestre" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(bimestreLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.tipo === 'rgf' && (
                <div className="space-y-2">
                  <Label>Quadrimestre</Label>
                  <Select
                    value={formData.quadrimestre ? String(formData.quadrimestre) : ''}
                    onValueChange={(v) =>
                      setFormData({ ...formData, quadrimestre: v ? Number(v) : null })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o quadrimestre" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(quadrimestreLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {(formData.tipo === 'prestacao_contas' || formData.tipo === 'parecer_tce') && (
                <div className="space-y-2">
                  <Label>Exercício/Período</Label>
                  <Input
                    value={formData.exercicio}
                    onChange={(e) => setFormData({ ...formData, exercicio: e.target.value })}
                    placeholder="Ex: Exercício 2024, Anual 2023"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Título *</Label>
                <Input
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="Título do relatório"
                />
              </div>

              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descrição opcional do relatório"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Data de Publicação *</Label>
                <Input
                  type="date"
                  value={formData.data_publicacao}
                  onChange={(e) =>
                    setFormData({ ...formData, data_publicacao: e.target.value })
                  }
                />
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
                    onChange={(e) =>
                      setFormData({ ...formData, arquivo_nome: e.target.value })
                    }
                    placeholder="relatorio.pdf"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  placeholder="Observações adicionais"
                  rows={2}
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.publicado}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, publicado: checked })
                  }
                />
                <Label>Publicado</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                {editingRelatorio ? 'Salvar' : 'Cadastrar'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
