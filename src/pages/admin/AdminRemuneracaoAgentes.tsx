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
import { Plus, Pencil, Trash2, Users, Search, Filter } from 'lucide-react';
import {
  useRemuneracaoAgentes,
  useCreateRemuneracaoAgente,
  useUpdateRemuneracaoAgente,
  useDeleteRemuneracaoAgente,
  CargoAgentePolitico,
  RemuneracaoAgente,
  cargoAgentePoliticoLabels,
  mesesLabels,
} from '@/hooks/useRemuneracaoAgentes';

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;
const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

export default function AdminRemuneracaoAgentes() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAgente, setEditingAgente] = useState<RemuneracaoAgente | null>(null);
  const [filterAno, setFilterAno] = useState<number | 'all'>(currentYear);
  const [filterMes, setFilterMes] = useState<number | 'all'>('all');
  const [search, setSearch] = useState('');

  const [formData, setFormData] = useState({
    nome: '',
    cargo: 'secretario' as CargoAgentePolitico,
    cargo_descricao: '',
    secretaria: '',
    subsidio_mensal: '',
    verba_representacao: '',
    outros_valores: '',
    mes_referencia: currentMonth,
    ano_referencia: currentYear,
    foto_url: '',
    observacoes: '',
    ordem: 0,
    ativo: true,
    publicado: true,
  });

  const { data: agentes, isLoading } = useRemuneracaoAgentes(
    filterAno === 'all' ? undefined : filterAno,
    filterMes === 'all' ? undefined : filterMes,
    true
  );
  const createMutation = useCreateRemuneracaoAgente();
  const updateMutation = useUpdateRemuneracaoAgente();
  const deleteMutation = useDeleteRemuneracaoAgente();

  const filteredAgentes = agentes?.filter((a) =>
    a.nome.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      nome: '',
      cargo: 'secretario',
      cargo_descricao: '',
      secretaria: '',
      subsidio_mensal: '',
      verba_representacao: '',
      outros_valores: '',
      mes_referencia: currentMonth,
      ano_referencia: currentYear,
      foto_url: '',
      observacoes: '',
      ordem: 0,
      ativo: true,
      publicado: true,
    });
    setEditingAgente(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (agente: RemuneracaoAgente) => {
    setEditingAgente(agente);
    setFormData({
      nome: agente.nome,
      cargo: agente.cargo,
      cargo_descricao: agente.cargo_descricao || '',
      secretaria: agente.secretaria || '',
      subsidio_mensal: agente.subsidio_mensal.toString(),
      verba_representacao: agente.verba_representacao?.toString() || '',
      outros_valores: agente.outros_valores?.toString() || '',
      mes_referencia: agente.mes_referencia,
      ano_referencia: agente.ano_referencia,
      foto_url: agente.foto_url || '',
      observacoes: agente.observacoes || '',
      ordem: agente.ordem || 0,
      ativo: agente.ativo ?? true,
      publicado: agente.publicado ?? true,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.nome || !formData.subsidio_mensal) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    try {
      const subsidio = parseFloat(formData.subsidio_mensal);
      const verba = formData.verba_representacao ? parseFloat(formData.verba_representacao) : 0;
      const outros = formData.outros_valores ? parseFloat(formData.outros_valores) : 0;
      const total = subsidio + verba + outros;

      const payload = {
        nome: formData.nome,
        cargo: formData.cargo,
        cargo_descricao: formData.cargo_descricao || null,
        secretaria: formData.secretaria || null,
        subsidio_mensal: subsidio,
        verba_representacao: verba,
        outros_valores: outros,
        total_bruto: total,
        mes_referencia: formData.mes_referencia,
        ano_referencia: formData.ano_referencia,
        foto_url: formData.foto_url || null,
        observacoes: formData.observacoes || null,
        ordem: formData.ordem,
        ativo: formData.ativo,
        publicado: formData.publicado,
      };

      if (editingAgente) {
        await updateMutation.mutateAsync({ id: editingAgente.id, ...payload });
        toast.success('Registro atualizado com sucesso!');
      } else {
        await createMutation.mutateAsync(payload);
        toast.success('Registro cadastrado com sucesso!');
      }
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Erro ao salvar registro');
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

  const formatCurrency = (value: number | null) => {
    if (!value) return '-';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Remuneração de Agentes</h1>
            <p className="text-muted-foreground">
              Gerencie a remuneração dos agentes políticos
            </p>
          </div>
          <Button onClick={openCreateDialog} className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Registro
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
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
          <Select
            value={String(filterMes)}
            onValueChange={(v) => setFilterMes(v === 'all' ? 'all' : Number(v))}
          >
            <SelectTrigger className="w-full sm:w-[160px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Mês" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os meses</SelectItem>
              {Object.entries(mesesLabels).map(([value, label]) => (
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
        ) : filteredAgentes?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Users className="w-12 h-12 mb-4 opacity-50" />
            <p>Nenhum registro encontrado</p>
          </div>
        ) : (
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Nome</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Mês/Ano</TableHead>
                  <TableHead>Subsídio</TableHead>
                  <TableHead>Total Bruto</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgentes?.map((agente) => (
                  <TableRow key={agente.id}>
                    <TableCell className="font-medium">{agente.nome}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {cargoAgentePoliticoLabels[agente.cargo]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {mesesLabels[agente.mes_referencia]}/{agente.ano_referencia}
                    </TableCell>
                    <TableCell>{formatCurrency(agente.subsidio_mensal)}</TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(agente.total_bruto)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={agente.publicado ? 'default' : 'secondary'}>
                        {agente.publicado ? 'Publicado' : 'Rascunho'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(agente)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(agente.id)}
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
                {editingAgente ? 'Editar Registro' : 'Novo Registro'}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Nome *</Label>
                <Input
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Nome completo"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cargo *</Label>
                  <Select
                    value={formData.cargo}
                    onValueChange={(v) => setFormData({ ...formData, cargo: v as CargoAgentePolitico })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(cargoAgentePoliticoLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Descrição do Cargo</Label>
                  <Input
                    value={formData.cargo_descricao}
                    onChange={(e) => setFormData({ ...formData, cargo_descricao: e.target.value })}
                    placeholder="Ex: Secretário de Saúde"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Secretaria</Label>
                <Input
                  value={formData.secretaria}
                  onChange={(e) => setFormData({ ...formData, secretaria: e.target.value })}
                  placeholder="Secretaria vinculada"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Mês de Referência *</Label>
                  <Select
                    value={String(formData.mes_referencia)}
                    onValueChange={(v) => setFormData({ ...formData, mes_referencia: Number(v) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(mesesLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Ano de Referência *</Label>
                  <Select
                    value={String(formData.ano_referencia)}
                    onValueChange={(v) => setFormData({ ...formData, ano_referencia: Number(v) })}
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

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Subsídio Mensal (R$) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.subsidio_mensal}
                    onChange={(e) => setFormData({ ...formData, subsidio_mensal: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Verba de Representação (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.verba_representacao}
                    onChange={(e) => setFormData({ ...formData, verba_representacao: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Outros Valores (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.outros_valores}
                    onChange={(e) => setFormData({ ...formData, outros_valores: e.target.value })}
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

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.ativo}
                    onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                  />
                  <Label>Ativo</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.publicado}
                    onCheckedChange={(checked) => setFormData({ ...formData, publicado: checked })}
                  />
                  <Label>Publicado</Label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave}>
                  {editingAgente ? 'Salvar' : 'Cadastrar'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
