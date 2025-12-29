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
import { Plus, Pencil, Trash2, HardHat, Search, Filter, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  useObrasPublicas,
  useCreateObraPublica,
  useUpdateObraPublica,
  useDeleteObraPublica,
  StatusObra,
  FonteRecursoObra,
  ObraPublica,
  statusObraLabels,
  fonteRecursoLabels,
} from '@/hooks/useObrasPublicas';

export default function AdminObrasPublicas() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingObra, setEditingObra] = useState<ObraPublica | null>(null);
  const [filterStatus, setFilterStatus] = useState<StatusObra | 'all'>('all');
  const [search, setSearch] = useState('');

  const [formData, setFormData] = useState({
    titulo: '',
    objeto: '',
    descricao: '',
    status: 'em_andamento' as StatusObra,
    localizacao: '',
    secretaria_responsavel: '',
    data_inicio: '',
    data_previsao_termino: '',
    data_conclusao: '',
    valor_contratado: '',
    valor_executado: '',
    percentual_execucao: 0,
    empresa_executora: '',
    cnpj_empresa: '',
    numero_contrato: '',
    fonte_recurso: 'proprio' as FonteRecursoObra,
    fonte_recurso_descricao: '',
    fiscal_obra: '',
    foto_url: '',
    link_sistema_oficial: '',
    observacoes: '',
    publicado: true,
  });

  const { data: obras, isLoading } = useObrasPublicas(
    filterStatus === 'all' ? undefined : filterStatus,
    true
  );
  const createMutation = useCreateObraPublica();
  const updateMutation = useUpdateObraPublica();
  const deleteMutation = useDeleteObraPublica();

  const filteredObras = obras?.filter((o) =>
    o.titulo.toLowerCase().includes(search.toLowerCase()) ||
    o.objeto.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      titulo: '',
      objeto: '',
      descricao: '',
      status: 'em_andamento',
      localizacao: '',
      secretaria_responsavel: '',
      data_inicio: '',
      data_previsao_termino: '',
      data_conclusao: '',
      valor_contratado: '',
      valor_executado: '',
      percentual_execucao: 0,
      empresa_executora: '',
      cnpj_empresa: '',
      numero_contrato: '',
      fonte_recurso: 'proprio',
      fonte_recurso_descricao: '',
      fiscal_obra: '',
      foto_url: '',
      link_sistema_oficial: '',
      observacoes: '',
      publicado: true,
    });
    setEditingObra(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  // Função para formatar número para formato brasileiro
  const formatarValorBrasileiro = (valor: number | null): string => {
    if (!valor) return '';
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const openEditDialog = (obra: ObraPublica) => {
    setEditingObra(obra);
    setFormData({
      titulo: obra.titulo,
      objeto: obra.objeto,
      descricao: obra.descricao || '',
      status: obra.status || 'em_andamento',
      localizacao: obra.localizacao || '',
      secretaria_responsavel: obra.secretaria_responsavel || '',
      data_inicio: obra.data_inicio || '',
      data_previsao_termino: obra.data_previsao_termino || '',
      data_conclusao: obra.data_conclusao || '',
      valor_contratado: formatarValorBrasileiro(obra.valor_contratado),
      valor_executado: formatarValorBrasileiro(obra.valor_executado),
      percentual_execucao: obra.percentual_execucao || 0,
      empresa_executora: obra.empresa_executora || '',
      cnpj_empresa: obra.cnpj_empresa || '',
      numero_contrato: obra.numero_contrato || '',
      fonte_recurso: obra.fonte_recurso || 'proprio',
      fonte_recurso_descricao: obra.fonte_recurso_descricao || '',
      fiscal_obra: obra.fiscal_obra || '',
      foto_url: obra.foto_url || '',
      link_sistema_oficial: obra.link_sistema_oficial || '',
      observacoes: obra.observacoes || '',
      publicado: obra.publicado ?? true,
    });
    setDialogOpen(true);
  };

  // Função para converter valor brasileiro (1.234,56) ou americano (1234.56) para número
  const parseValorBrasileiro = (valor: string): number => {
    if (!valor) return 0;
    // Se contém vírgula, assume formato brasileiro
    if (valor.includes(',')) {
      return parseFloat(valor.replace(/\./g, '').replace(',', '.')) || 0;
    }
    // Caso contrário, assume formato americano/numérico simples
    return parseFloat(valor.replace(/[^\d.-]/g, '')) || 0;
  };

  const handleSave = async () => {
    if (!formData.titulo || !formData.objeto) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    try {
      const payload = {
        titulo: formData.titulo,
        objeto: formData.objeto,
        descricao: formData.descricao || null,
        status: formData.status,
        localizacao: formData.localizacao || null,
        secretaria_responsavel: formData.secretaria_responsavel || null,
        data_inicio: formData.data_inicio || null,
        data_previsao_termino: formData.data_previsao_termino || null,
        data_conclusao: formData.data_conclusao || null,
        valor_contratado: formData.valor_contratado ? parseValorBrasileiro(formData.valor_contratado) : null,
        valor_executado: formData.valor_executado ? parseValorBrasileiro(formData.valor_executado) : null,
        percentual_execucao: formData.percentual_execucao,
        empresa_executora: formData.empresa_executora || null,
        cnpj_empresa: formData.cnpj_empresa || null,
        numero_contrato: formData.numero_contrato || null,
        fonte_recurso: formData.fonte_recurso,
        fonte_recurso_descricao: formData.fonte_recurso_descricao || null,
        fiscal_obra: formData.fiscal_obra || null,
        foto_url: formData.foto_url || null,
        link_sistema_oficial: formData.link_sistema_oficial || null,
        observacoes: formData.observacoes || null,
        publicado: formData.publicado,
        prazo_execucao_dias: null,
      };

      if (editingObra) {
        await updateMutation.mutateAsync({ id: editingObra.id, ...payload });
        toast.success('Obra atualizada com sucesso!');
      } else {
        await createMutation.mutateAsync(payload);
        toast.success('Obra cadastrada com sucesso!');
      }
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Erro ao salvar obra');
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta obra?')) return;

    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Obra excluída com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir obra');
      console.error(error);
    }
  };

  const formatCurrency = (value: number | null) => {
    if (!value) return '-';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const getStatusBadgeVariant = (status: StatusObra | null) => {
    switch (status) {
      case 'concluida': return 'default';
      case 'em_andamento': return 'secondary';
      case 'paralisada': return 'destructive';
      case 'planejada': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Obras Públicas</h1>
            <p className="text-muted-foreground">
              Gerencie as obras e investimentos do município
            </p>
          </div>
          <Button onClick={openCreateDialog} className="gap-2">
            <Plus className="w-4 h-4" />
            Nova Obra
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título ou objeto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select
            value={filterStatus}
            onValueChange={(v) => setFilterStatus(v as StatusObra | 'all')}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              {Object.entries(statusObraLabels).map(([value, label]) => (
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
        ) : filteredObras?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <HardHat className="w-12 h-12 mb-4 opacity-50" />
            <p>Nenhuma obra encontrada</p>
          </div>
        ) : (
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Título</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Execução</TableHead>
                  <TableHead>Publicado</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredObras?.map((obra) => (
                  <TableRow key={obra.id}>
                    <TableCell className="font-medium max-w-[250px] truncate">
                      {obra.titulo}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(obra.status)}>
                        {statusObraLabels[obra.status || 'em_andamento']}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(obra.valor_contratado)}</TableCell>
                    <TableCell>{obra.percentual_execucao || 0}%</TableCell>
                    <TableCell>
                      <Badge variant={obra.publicado ? 'default' : 'secondary'}>
                        {obra.publicado ? 'Sim' : 'Não'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {obra.link_sistema_oficial && (
                          <a
                            href={obra.link_sistema_oficial}
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
                          onClick={() => openEditDialog(obra)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(obra.id)}
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
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingObra ? 'Editar Obra' : 'Nova Obra'}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label>Título *</Label>
                  <Input
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    placeholder="Título da obra"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Objeto *</Label>
                <Textarea
                  value={formData.objeto}
                  onChange={(e) => setFormData({ ...formData, objeto: e.target.value })}
                  placeholder="Descrição do objeto da obra"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descrição detalhada"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(v) => setFormData({ ...formData, status: v as StatusObra })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusObraLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Localização</Label>
                  <Input
                    value={formData.localizacao}
                    onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
                    placeholder="Endereço/localização"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Data Início</Label>
                  <Input
                    type="date"
                    value={formData.data_inicio}
                    onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Previsão Término</Label>
                  <Input
                    type="date"
                    value={formData.data_previsao_termino}
                    onChange={(e) => setFormData({ ...formData, data_previsao_termino: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Data Conclusão</Label>
                  <Input
                    type="date"
                    value={formData.data_conclusao}
                    onChange={(e) => setFormData({ ...formData, data_conclusao: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Valor Contratado (R$)</Label>
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="0,00"
                    value={formData.valor_contratado}
                    onChange={(e) => setFormData({ ...formData, valor_contratado: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Valor Executado (R$)</Label>
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="0,00"
                    value={formData.valor_executado}
                    onChange={(e) => setFormData({ ...formData, valor_executado: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>% Execução</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.percentual_execucao}
                    onChange={(e) => setFormData({ ...formData, percentual_execucao: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Empresa Executora</Label>
                  <Input
                    value={formData.empresa_executora}
                    onChange={(e) => setFormData({ ...formData, empresa_executora: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>CNPJ da Empresa</Label>
                  <Input
                    value={formData.cnpj_empresa}
                    onChange={(e) => setFormData({ ...formData, cnpj_empresa: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nº do Contrato</Label>
                  <Input
                    value={formData.numero_contrato}
                    onChange={(e) => setFormData({ ...formData, numero_contrato: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Secretaria Responsável</Label>
                  <Input
                    value={formData.secretaria_responsavel}
                    onChange={(e) => setFormData({ ...formData, secretaria_responsavel: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fonte de Recurso</Label>
                  <Select
                    value={formData.fonte_recurso}
                    onValueChange={(v) => setFormData({ ...formData, fonte_recurso: v as FonteRecursoObra })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(fonteRecursoLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Fiscal da Obra</Label>
                  <Input
                    value={formData.fiscal_obra}
                    onChange={(e) => setFormData({ ...formData, fiscal_obra: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>URL da Foto</Label>
                  <Input
                    value={formData.foto_url}
                    onChange={(e) => setFormData({ ...formData, foto_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Link Sistema Oficial</Label>
                  <Input
                    value={formData.link_sistema_oficial}
                    onChange={(e) => setFormData({ ...formData, link_sistema_oficial: e.target.value })}
                    placeholder="https://..."
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
                  {editingObra ? 'Salvar' : 'Cadastrar'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
