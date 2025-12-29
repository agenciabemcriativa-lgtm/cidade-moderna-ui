import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Pencil, Trash2, Users, Search, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { 
  useFolhaPagamento, 
  useCreateFolhaPagamento, 
  useUpdateFolhaPagamento, 
  useDeleteFolhaPagamento,
  FolhaPagamento,
  mesesLabels,
  vinculoLabels
} from '@/hooks/useFolhaPagamento';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

export default function AdminFolhaPagamento() {
  const [ano, setAno] = useState<number>(currentYear);
  const [mes, setMes] = useState<number>(new Date().getMonth() + 1);
  const [busca, setBusca] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FolhaPagamento | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<FolhaPagamento | null>(null);

  const { data: servidores, isLoading } = useFolhaPagamento(ano, mes, true);
  const createMutation = useCreateFolhaPagamento();
  const updateMutation = useUpdateFolhaPagamento();
  const deleteMutation = useDeleteFolhaPagamento();

  const [formData, setFormData] = useState({
    nome_servidor: '',
    matricula: '',
    cargo: '',
    secretaria: '',
    vinculo: 'efetivo',
    carga_horaria: 40,
    salario_base: '',
    gratificacoes: '',
    adicionais: '',
    outros_proventos: '',
    inss: '',
    irrf: '',
    outros_descontos: '',
    mes_referencia: mes,
    ano_referencia: ano,
    observacoes: '',
    publicado: true,
  });

  const servidoresFiltrados = servidores?.filter(s =>
    s.nome_servidor.toLowerCase().includes(busca.toLowerCase()) ||
    s.cargo.toLowerCase().includes(busca.toLowerCase()) ||
    s.secretaria?.toLowerCase().includes(busca.toLowerCase())
  ) || [];

  const formatCurrency = (value: number | null) => {
    if (!value) return 'R$ 0,00';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const parseValorBrasileiro = (valor: string): number => {
    if (!valor) return 0;
    return parseFloat(valor.replace(/\./g, '').replace(',', '.')) || 0;
  };

  const formatarValorBrasileiro = (valor: number | null): string => {
    if (!valor) return '';
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const resetForm = () => {
    setFormData({
      nome_servidor: '',
      matricula: '',
      cargo: '',
      secretaria: '',
      vinculo: 'efetivo',
      carga_horaria: 40,
      salario_base: '',
      gratificacoes: '',
      adicionais: '',
      outros_proventos: '',
      inss: '',
      irrf: '',
      outros_descontos: '',
      mes_referencia: mes,
      ano_referencia: ano,
      observacoes: '',
      publicado: true,
    });
    setEditingItem(null);
  };

  const openNewDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (item: FolhaPagamento) => {
    setEditingItem(item);
    setFormData({
      nome_servidor: item.nome_servidor,
      matricula: item.matricula || '',
      cargo: item.cargo,
      secretaria: item.secretaria || '',
      vinculo: item.vinculo || 'efetivo',
      carga_horaria: item.carga_horaria || 40,
      salario_base: formatarValorBrasileiro(item.salario_base),
      gratificacoes: formatarValorBrasileiro(item.gratificacoes),
      adicionais: formatarValorBrasileiro(item.adicionais),
      outros_proventos: formatarValorBrasileiro(item.outros_proventos),
      inss: formatarValorBrasileiro(item.inss),
      irrf: formatarValorBrasileiro(item.irrf),
      outros_descontos: formatarValorBrasileiro(item.outros_descontos),
      mes_referencia: item.mes_referencia,
      ano_referencia: item.ano_referencia,
      observacoes: item.observacoes || '',
      publicado: item.publicado ?? true,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.nome_servidor || !formData.cargo || !formData.salario_base) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    try {
      const payload = {
        nome_servidor: formData.nome_servidor,
        matricula: formData.matricula || null,
        cargo: formData.cargo,
        secretaria: formData.secretaria || null,
        vinculo: formData.vinculo,
        carga_horaria: formData.carga_horaria,
        salario_base: parseValorBrasileiro(formData.salario_base),
        gratificacoes: parseValorBrasileiro(formData.gratificacoes),
        adicionais: parseValorBrasileiro(formData.adicionais),
        outros_proventos: parseValorBrasileiro(formData.outros_proventos),
        inss: parseValorBrasileiro(formData.inss),
        irrf: parseValorBrasileiro(formData.irrf),
        outros_descontos: parseValorBrasileiro(formData.outros_descontos),
        mes_referencia: formData.mes_referencia,
        ano_referencia: formData.ano_referencia,
        observacoes: formData.observacoes || null,
        publicado: formData.publicado,
      };

      if (editingItem) {
        await updateMutation.mutateAsync({ id: editingItem.id, ...payload });
        toast.success('Registro atualizado com sucesso!');
      } else {
        await createMutation.mutateAsync(payload);
        toast.success('Registro criado com sucesso!');
      }
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Erro ao salvar registro');
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteMutation.mutateAsync(itemToDelete.id);
      toast.success('Registro excluído com sucesso!');
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error) {
      toast.error('Erro ao excluir registro');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="h-6 w-6" />
              Folha de Pagamento
            </h1>
            <p className="text-muted-foreground">Gerencie a folha de pagamento dos servidores</p>
          </div>
          <Button onClick={openNewDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Registro
          </Button>
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label>Ano</Label>
                <Select value={ano.toString()} onValueChange={(v) => setAno(parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(y => (
                      <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Mês</Label>
                <Select value={mes.toString()} onValueChange={(v) => setMes(parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(mesesLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label>Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Nome, cargo ou secretaria..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabela */}
        <Card>
          <CardHeader>
            <CardTitle>{mesesLabels[mes]}/{ano} - {servidoresFiltrados.length} registros</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : servidoresFiltrados.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum registro encontrado.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Servidor</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead>Secretaria</TableHead>
                      <TableHead>Vínculo</TableHead>
                      <TableHead className="text-right">Salário Base</TableHead>
                      <TableHead className="text-right">Líquido</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {servidoresFiltrados.map((servidor) => (
                      <TableRow key={servidor.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{servidor.nome_servidor}</p>
                            {servidor.matricula && (
                              <p className="text-xs text-muted-foreground">Mat: {servidor.matricula}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{servidor.cargo}</TableCell>
                        <TableCell>{servidor.secretaria || '-'}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {vinculoLabels[servidor.vinculo || 'efetivo'] || servidor.vinculo}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(servidor.salario_base)}</TableCell>
                        <TableCell className="text-right font-bold">{formatCurrency(servidor.salario_liquido)}</TableCell>
                        <TableCell>
                          <Badge variant={servidor.publicado ? 'default' : 'secondary'}>
                            {servidor.publicado ? 'Publicado' : 'Rascunho'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(servidor)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => { setItemToDelete(servidor); setDeleteDialogOpen(true); }}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog de Edição */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Editar Registro' : 'Novo Registro'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome do Servidor *</Label>
                  <Input
                    value={formData.nome_servidor}
                    onChange={(e) => setFormData({ ...formData, nome_servidor: e.target.value })}
                    placeholder="Nome completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Matrícula</Label>
                  <Input
                    value={formData.matricula}
                    onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                    placeholder="Número da matrícula"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cargo *</Label>
                  <Input
                    value={formData.cargo}
                    onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                    placeholder="Cargo ocupado"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Secretaria</Label>
                  <Input
                    value={formData.secretaria}
                    onChange={(e) => setFormData({ ...formData, secretaria: e.target.value })}
                    placeholder="Secretaria de lotação"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Vínculo</Label>
                  <Select value={formData.vinculo} onValueChange={(v) => setFormData({ ...formData, vinculo: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(vinculoLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Carga Horária</Label>
                  <Input
                    type="number"
                    value={formData.carga_horaria}
                    onChange={(e) => setFormData({ ...formData, carga_horaria: parseInt(e.target.value) || 40 })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>Mês *</Label>
                    <Select value={formData.mes_referencia.toString()} onValueChange={(v) => setFormData({ ...formData, mes_referencia: parseInt(v) })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(mesesLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Ano *</Label>
                    <Select value={formData.ano_referencia.toString()} onValueChange={(v) => setFormData({ ...formData, ano_referencia: parseInt(v) })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map(y => (
                          <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3 text-green-600">Proventos</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Salário Base (R$) *</Label>
                    <Input
                      type="text"
                      inputMode="decimal"
                      placeholder="0,00"
                      value={formData.salario_base}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^\d,.-]/g, '');
                        setFormData({ ...formData, salario_base: value });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Gratificações (R$)</Label>
                    <Input
                      type="text"
                      inputMode="decimal"
                      placeholder="0,00"
                      value={formData.gratificacoes}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^\d,.-]/g, '');
                        setFormData({ ...formData, gratificacoes: value });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Adicionais (R$)</Label>
                    <Input
                      type="text"
                      inputMode="decimal"
                      placeholder="0,00"
                      value={formData.adicionais}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^\d,.-]/g, '');
                        setFormData({ ...formData, adicionais: value });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Outros Proventos (R$)</Label>
                    <Input
                      type="text"
                      inputMode="decimal"
                      placeholder="0,00"
                      value={formData.outros_proventos}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^\d,.-]/g, '');
                        setFormData({ ...formData, outros_proventos: value });
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3 text-red-600">Descontos</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>INSS (R$)</Label>
                    <Input
                      type="text"
                      inputMode="decimal"
                      placeholder="0,00"
                      value={formData.inss}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^\d,.-]/g, '');
                        setFormData({ ...formData, inss: value });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>IRRF (R$)</Label>
                    <Input
                      type="text"
                      inputMode="decimal"
                      placeholder="0,00"
                      value={formData.irrf}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^\d,.-]/g, '');
                        setFormData({ ...formData, irrf: value });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Outros Descontos (R$)</Label>
                    <Input
                      type="text"
                      inputMode="decimal"
                      placeholder="0,00"
                      value={formData.outros_descontos}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^\d,.-]/g, '');
                        setFormData({ ...formData, outros_descontos: value });
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  placeholder="Observações adicionais..."
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
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending}>
                {editingItem ? 'Salvar' : 'Criar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog de Exclusão */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
            </DialogHeader>
            <p>Deseja realmente excluir o registro de <strong>{itemToDelete?.nome_servidor}</strong>?</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
              <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
