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
import { Plus, Pencil, Trash2, Plane, Search, Filter, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  useDiariasPassagens,
  useCreateDiariaPassagem,
  useUpdateDiariaPassagem,
  useDeleteDiariaPassagem,
  TipoDiariaPassagem,
  DiariaPassagem,
  tipoDiariaPassagemLabels,
} from '@/hooks/useDiariasPassagens';
import { mesesLabels } from '@/hooks/useRemuneracaoAgentes';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

export default function AdminDiariasPassagens() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDiaria, setEditingDiaria] = useState<DiariaPassagem | null>(null);
  const [filterAno, setFilterAno] = useState<number | 'all'>(currentYear);
  const [filterMes, setFilterMes] = useState<number | 'all'>('all');
  const [filterTipo, setFilterTipo] = useState<TipoDiariaPassagem | 'all'>('all');
  const [search, setSearch] = useState('');

  const [formData, setFormData] = useState({
    tipo: 'diaria' as TipoDiariaPassagem,
    beneficiario_nome: '',
    beneficiario_cargo: '',
    beneficiario_matricula: '',
    secretaria: '',
    destino: '',
    finalidade: '',
    data_inicio: '',
    data_fim: '',
    quantidade_dias: 1,
    valor_unitario: '',
    valor_total: '',
    numero_portaria: '',
    mes_referencia: new Date().getMonth() + 1,
    ano_referencia: currentYear,
    link_sistema_oficial: '',
    observacoes: '',
    publicado: true,
  });

  const { data: diarias, isLoading } = useDiariasPassagens(
    filterAno === 'all' ? undefined : filterAno,
    filterMes === 'all' ? undefined : filterMes,
    filterTipo === 'all' ? undefined : filterTipo,
    true
  );
  const createMutation = useCreateDiariaPassagem();
  const updateMutation = useUpdateDiariaPassagem();
  const deleteMutation = useDeleteDiariaPassagem();

  const filteredDiarias = diarias?.filter((d) =>
    d.beneficiario_nome.toLowerCase().includes(search.toLowerCase()) ||
    d.destino.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      tipo: 'diaria',
      beneficiario_nome: '',
      beneficiario_cargo: '',
      beneficiario_matricula: '',
      secretaria: '',
      destino: '',
      finalidade: '',
      data_inicio: '',
      data_fim: '',
      quantidade_dias: 1,
      valor_unitario: '',
      valor_total: '',
      numero_portaria: '',
      mes_referencia: new Date().getMonth() + 1,
      ano_referencia: currentYear,
      link_sistema_oficial: '',
      observacoes: '',
      publicado: true,
    });
    setEditingDiaria(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (diaria: DiariaPassagem) => {
    // Função para formatar número para formato brasileiro
    const formatarValorBrasileiro = (valor: number | null): string => {
      if (!valor) return '';
      return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    setEditingDiaria(diaria);
    setFormData({
      tipo: diaria.tipo,
      beneficiario_nome: diaria.beneficiario_nome,
      beneficiario_cargo: diaria.beneficiario_cargo || '',
      beneficiario_matricula: diaria.beneficiario_matricula || '',
      secretaria: diaria.secretaria || '',
      destino: diaria.destino,
      finalidade: diaria.finalidade,
      data_inicio: diaria.data_inicio,
      data_fim: diaria.data_fim,
      quantidade_dias: diaria.quantidade_dias || 1,
      valor_unitario: formatarValorBrasileiro(diaria.valor_unitario),
      valor_total: formatarValorBrasileiro(diaria.valor_total),
      numero_portaria: diaria.numero_portaria || '',
      mes_referencia: diaria.mes_referencia,
      ano_referencia: diaria.ano_referencia,
      link_sistema_oficial: diaria.link_sistema_oficial || '',
      observacoes: diaria.observacoes || '',
      publicado: diaria.publicado ?? true,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.beneficiario_nome || !formData.destino || !formData.finalidade || !formData.data_inicio || !formData.data_fim || !formData.valor_total) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    // Função para converter valor brasileiro (1.234,56) para número
    const parseValorBrasileiro = (valor: string): number => {
      if (!valor) return 0;
      // Remove pontos de milhar e substitui vírgula por ponto
      return parseFloat(valor.replace(/\./g, '').replace(',', '.')) || 0;
    };

    try {
      const payload = {
        tipo: formData.tipo,
        beneficiario_nome: formData.beneficiario_nome,
        beneficiario_cargo: formData.beneficiario_cargo || null,
        beneficiario_matricula: formData.beneficiario_matricula || null,
        secretaria: formData.secretaria || null,
        destino: formData.destino,
        finalidade: formData.finalidade,
        data_inicio: formData.data_inicio,
        data_fim: formData.data_fim,
        quantidade_dias: formData.quantidade_dias,
        valor_unitario: formData.valor_unitario ? parseValorBrasileiro(formData.valor_unitario) : null,
        valor_total: parseValorBrasileiro(formData.valor_total),
        numero_portaria: formData.numero_portaria || null,
        mes_referencia: formData.mes_referencia,
        ano_referencia: formData.ano_referencia,
        link_sistema_oficial: formData.link_sistema_oficial || null,
        observacoes: formData.observacoes || null,
        publicado: formData.publicado,
      };

      if (editingDiaria) {
        await updateMutation.mutateAsync({ id: editingDiaria.id, ...payload });
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
            <h1 className="text-2xl font-bold text-foreground">Diárias e Passagens</h1>
            <p className="text-muted-foreground">
              Gerencie as diárias e passagens concedidas
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
                placeholder="Buscar por beneficiário ou destino..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select
            value={filterTipo}
            onValueChange={(v) => setFilterTipo(v as TipoDiariaPassagem | 'all')}
          >
            <SelectTrigger className="w-full sm:w-[160px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              {Object.entries(tipoDiariaPassagemLabels).map(([value, label]) => (
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
            <SelectTrigger className="w-full sm:w-[120px]">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
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
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Mês" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
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
        ) : filteredDiarias?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Plane className="w-12 h-12 mb-4 opacity-50" />
            <p>Nenhum registro encontrado</p>
          </div>
        ) : (
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Tipo</TableHead>
                  <TableHead>Beneficiário</TableHead>
                  <TableHead>Destino</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDiarias?.map((diaria) => (
                  <TableRow key={diaria.id}>
                    <TableCell>
                      <Badge variant="outline">
                        {tipoDiariaPassagemLabels[diaria.tipo]}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium max-w-[200px] truncate">
                      {diaria.beneficiario_nome}
                    </TableCell>
                    <TableCell>{diaria.destino}</TableCell>
                    <TableCell>
                      {format(new Date(diaria.data_inicio), 'dd/MM', { locale: ptBR })} -{' '}
                      {format(new Date(diaria.data_fim), 'dd/MM/yy', { locale: ptBR })}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(diaria.valor_total)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={diaria.publicado ? 'default' : 'secondary'}>
                        {diaria.publicado ? 'Publicado' : 'Rascunho'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {diaria.link_sistema_oficial && (
                          <a
                            href={diaria.link_sistema_oficial}
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
                          onClick={() => openEditDialog(diaria)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(diaria.id)}
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
                {editingDiaria ? 'Editar Registro' : 'Novo Registro'}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo *</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(v) => setFormData({ ...formData, tipo: v as TipoDiariaPassagem })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(tipoDiariaPassagemLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Nº da Portaria</Label>
                  <Input
                    value={formData.numero_portaria}
                    onChange={(e) => setFormData({ ...formData, numero_portaria: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Nome do Beneficiário *</Label>
                <Input
                  value={formData.beneficiario_nome}
                  onChange={(e) => setFormData({ ...formData, beneficiario_nome: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cargo</Label>
                  <Input
                    value={formData.beneficiario_cargo}
                    onChange={(e) => setFormData({ ...formData, beneficiario_cargo: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Matrícula</Label>
                  <Input
                    value={formData.beneficiario_matricula}
                    onChange={(e) => setFormData({ ...formData, beneficiario_matricula: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Secretaria</Label>
                <Input
                  value={formData.secretaria}
                  onChange={(e) => setFormData({ ...formData, secretaria: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Destino *</Label>
                <Input
                  value={formData.destino}
                  onChange={(e) => setFormData({ ...formData, destino: e.target.value })}
                  placeholder="Cidade/Estado de destino"
                />
              </div>

              <div className="space-y-2">
                <Label>Finalidade *</Label>
                <Textarea
                  value={formData.finalidade}
                  onChange={(e) => setFormData({ ...formData, finalidade: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Data Início *</Label>
                  <Input
                    type="date"
                    value={formData.data_inicio}
                    onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Data Fim *</Label>
                  <Input
                    type="date"
                    value={formData.data_fim}
                    onChange={(e) => setFormData({ ...formData, data_fim: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Qtd. Dias</Label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.quantidade_dias}
                    onChange={(e) => setFormData({ ...formData, quantidade_dias: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Valor Unitário (R$)</Label>
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="0,00"
                    value={formData.valor_unitario}
                    onChange={(e) => {
                      // Permite apenas números, vírgula e ponto
                      const value = e.target.value.replace(/[^\d,.-]/g, '');
                      setFormData({ ...formData, valor_unitario: value });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Valor Total (R$) *</Label>
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="0,00"
                    value={formData.valor_total}
                    onChange={(e) => {
                      // Permite apenas números, vírgula e ponto
                      const value = e.target.value.replace(/[^\d,.-]/g, '');
                      setFormData({ ...formData, valor_total: value });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Mês/Ano Referência</Label>
                  <div className="flex gap-2">
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
                            {label.substring(0, 3)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
              </div>

              <div className="space-y-2">
                <Label>Link Sistema Oficial</Label>
                <Input
                  value={formData.link_sistema_oficial}
                  onChange={(e) => setFormData({ ...formData, link_sistema_oficial: e.target.value })}
                  placeholder="https://..."
                />
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
                  {editingDiaria ? 'Salvar' : 'Cadastrar'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
