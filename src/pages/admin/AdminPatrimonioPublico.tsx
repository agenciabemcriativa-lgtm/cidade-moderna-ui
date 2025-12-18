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
import { Plus, Pencil, Trash2, Landmark, Search, Filter } from 'lucide-react';
import {
  usePatrimonioPublico,
  useCreatePatrimonioPublico,
  useUpdatePatrimonioPublico,
  useDeletePatrimonioPublico,
  TipoBemPublico,
  SituacaoBem,
  PatrimonioPublico,
  tipoBemPublicoLabels,
  situacaoBemLabels,
} from '@/hooks/usePatrimonioPublico';

export default function AdminPatrimonioPublico() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPatrimonio, setEditingPatrimonio] = useState<PatrimonioPublico | null>(null);
  const [filterTipo, setFilterTipo] = useState<TipoBemPublico | 'all'>('all');
  const [search, setSearch] = useState('');

  const [formData, setFormData] = useState({
    tipo: 'equipamento' as TipoBemPublico,
    descricao: '',
    numero_patrimonio: '',
    situacao: 'bom' as SituacaoBem,
    valor_aquisicao: '',
    valor_atual: '',
    data_aquisicao: '',
    localizacao_atual: '',
    secretaria_responsavel: '',
    // Campos específicos para imóveis
    endereco: '',
    area_m2: '',
    matricula_cartorio: '',
    // Campos específicos para veículos
    placa: '',
    chassi: '',
    renavam: '',
    marca_modelo: '',
    ano_fabricacao: '',
    foto_url: '',
    observacoes: '',
    publicado: true,
  });

  const { data: patrimonios, isLoading } = usePatrimonioPublico(
    filterTipo === 'all' ? undefined : filterTipo,
    true
  );
  const createMutation = useCreatePatrimonioPublico();
  const updateMutation = useUpdatePatrimonioPublico();
  const deleteMutation = useDeletePatrimonioPublico();

  const filteredPatrimonios = patrimonios?.filter((p) =>
    p.descricao.toLowerCase().includes(search.toLowerCase()) ||
    (p.numero_patrimonio && p.numero_patrimonio.toLowerCase().includes(search.toLowerCase()))
  );

  const resetForm = () => {
    setFormData({
      tipo: 'equipamento',
      descricao: '',
      numero_patrimonio: '',
      situacao: 'bom',
      valor_aquisicao: '',
      valor_atual: '',
      data_aquisicao: '',
      localizacao_atual: '',
      secretaria_responsavel: '',
      endereco: '',
      area_m2: '',
      matricula_cartorio: '',
      placa: '',
      chassi: '',
      renavam: '',
      marca_modelo: '',
      ano_fabricacao: '',
      foto_url: '',
      observacoes: '',
      publicado: true,
    });
    setEditingPatrimonio(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (patrimonio: PatrimonioPublico) => {
    setEditingPatrimonio(patrimonio);
    setFormData({
      tipo: patrimonio.tipo,
      descricao: patrimonio.descricao,
      numero_patrimonio: patrimonio.numero_patrimonio || '',
      situacao: patrimonio.situacao || 'bom',
      valor_aquisicao: patrimonio.valor_aquisicao?.toString() || '',
      valor_atual: patrimonio.valor_atual?.toString() || '',
      data_aquisicao: patrimonio.data_aquisicao || '',
      localizacao_atual: patrimonio.localizacao_atual || '',
      secretaria_responsavel: patrimonio.secretaria_responsavel || '',
      endereco: patrimonio.endereco || '',
      area_m2: patrimonio.area_m2?.toString() || '',
      matricula_cartorio: patrimonio.matricula_cartorio || '',
      placa: patrimonio.placa || '',
      chassi: patrimonio.chassi || '',
      renavam: patrimonio.renavam || '',
      marca_modelo: patrimonio.marca_modelo || '',
      ano_fabricacao: patrimonio.ano_fabricacao?.toString() || '',
      foto_url: patrimonio.foto_url || '',
      observacoes: patrimonio.observacoes || '',
      publicado: patrimonio.publicado ?? true,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.descricao) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    try {
      const payload = {
        tipo: formData.tipo,
        descricao: formData.descricao,
        numero_patrimonio: formData.numero_patrimonio || null,
        situacao: formData.situacao,
        valor_aquisicao: formData.valor_aquisicao ? parseFloat(formData.valor_aquisicao) : null,
        valor_atual: formData.valor_atual ? parseFloat(formData.valor_atual) : null,
        data_aquisicao: formData.data_aquisicao || null,
        localizacao_atual: formData.localizacao_atual || null,
        secretaria_responsavel: formData.secretaria_responsavel || null,
        endereco: formData.endereco || null,
        area_m2: formData.area_m2 ? parseFloat(formData.area_m2) : null,
        matricula_cartorio: formData.matricula_cartorio || null,
        placa: formData.placa || null,
        chassi: formData.chassi || null,
        renavam: formData.renavam || null,
        marca_modelo: formData.marca_modelo || null,
        ano_fabricacao: formData.ano_fabricacao ? parseInt(formData.ano_fabricacao) : null,
        foto_url: formData.foto_url || null,
        observacoes: formData.observacoes || null,
        publicado: formData.publicado,
      };

      if (editingPatrimonio) {
        await updateMutation.mutateAsync({ id: editingPatrimonio.id, ...payload });
        toast.success('Patrimônio atualizado com sucesso!');
      } else {
        await createMutation.mutateAsync(payload);
        toast.success('Patrimônio cadastrado com sucesso!');
      }
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Erro ao salvar patrimônio');
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este patrimônio?')) return;

    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Patrimônio excluído com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir patrimônio');
      console.error(error);
    }
  };

  const formatCurrency = (value: number | null) => {
    if (!value) return '-';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const getSituacaoBadgeVariant = (situacao: SituacaoBem | null) => {
    switch (situacao) {
      case 'bom': return 'default';
      case 'regular': return 'secondary';
      case 'ruim': return 'destructive';
      case 'inservivel': return 'destructive';
      case 'alienado': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Patrimônio Público</h1>
            <p className="text-muted-foreground">
              Gerencie imóveis, veículos e equipamentos públicos
            </p>
          </div>
          <Button onClick={openCreateDialog} className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Bem
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por descrição ou nº patrimônio..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select
            value={filterTipo}
            onValueChange={(v) => setFilterTipo(v as TipoBemPublico | 'all')}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              {Object.entries(tipoBemPublicoLabels).map(([value, label]) => (
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
        ) : filteredPatrimonios?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Landmark className="w-12 h-12 mb-4 opacity-50" />
            <p>Nenhum patrimônio encontrado</p>
          </div>
        ) : (
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Nº Patrimônio</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatrimonios?.map((patrimonio) => (
                  <TableRow key={patrimonio.id}>
                    <TableCell>
                      <Badge variant="outline">
                        {tipoBemPublicoLabels[patrimonio.tipo]}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium max-w-[250px] truncate">
                      {patrimonio.descricao}
                    </TableCell>
                    <TableCell>{patrimonio.numero_patrimonio || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={getSituacaoBadgeVariant(patrimonio.situacao)}>
                        {situacaoBemLabels[patrimonio.situacao || 'bom']}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(patrimonio.valor_atual || patrimonio.valor_aquisicao)}</TableCell>
                    <TableCell>
                      <Badge variant={patrimonio.publicado ? 'default' : 'secondary'}>
                        {patrimonio.publicado ? 'Publicado' : 'Rascunho'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(patrimonio)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(patrimonio.id)}
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
                {editingPatrimonio ? 'Editar Patrimônio' : 'Novo Patrimônio'}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Bem *</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(v) => setFormData({ ...formData, tipo: v as TipoBemPublico })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(tipoBemPublicoLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Nº Patrimônio</Label>
                  <Input
                    value={formData.numero_patrimonio}
                    onChange={(e) => setFormData({ ...formData, numero_patrimonio: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Descrição *</Label>
                <Textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Situação</Label>
                  <Select
                    value={formData.situacao}
                    onValueChange={(v) => setFormData({ ...formData, situacao: v as SituacaoBem })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(situacaoBemLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Data de Aquisição</Label>
                  <Input
                    type="date"
                    value={formData.data_aquisicao}
                    onChange={(e) => setFormData({ ...formData, data_aquisicao: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Valor de Aquisição (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.valor_aquisicao}
                    onChange={(e) => setFormData({ ...formData, valor_aquisicao: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Valor Atual (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.valor_atual}
                    onChange={(e) => setFormData({ ...formData, valor_atual: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Localização Atual</Label>
                  <Input
                    value={formData.localizacao_atual}
                    onChange={(e) => setFormData({ ...formData, localizacao_atual: e.target.value })}
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

              {/* Campos específicos para Imóveis */}
              {formData.tipo === 'imovel' && (
                <>
                  <div className="space-y-2">
                    <Label>Endereço</Label>
                    <Input
                      value={formData.endereco}
                      onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Área (m²)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.area_m2}
                        onChange={(e) => setFormData({ ...formData, area_m2: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Matrícula do Cartório</Label>
                      <Input
                        value={formData.matricula_cartorio}
                        onChange={(e) => setFormData({ ...formData, matricula_cartorio: e.target.value })}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Campos específicos para Veículos */}
              {formData.tipo === 'veiculo' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Marca/Modelo</Label>
                      <Input
                        value={formData.marca_modelo}
                        onChange={(e) => setFormData({ ...formData, marca_modelo: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Ano de Fabricação</Label>
                      <Input
                        type="number"
                        value={formData.ano_fabricacao}
                        onChange={(e) => setFormData({ ...formData, ano_fabricacao: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Placa</Label>
                      <Input
                        value={formData.placa}
                        onChange={(e) => setFormData({ ...formData, placa: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Chassi</Label>
                      <Input
                        value={formData.chassi}
                        onChange={(e) => setFormData({ ...formData, chassi: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Renavam</Label>
                      <Input
                        value={formData.renavam}
                        onChange={(e) => setFormData({ ...formData, renavam: e.target.value })}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label>URL da Foto</Label>
                <Input
                  value={formData.foto_url}
                  onChange={(e) => setFormData({ ...formData, foto_url: e.target.value })}
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
                  {editingPatrimonio ? 'Salvar' : 'Cadastrar'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
