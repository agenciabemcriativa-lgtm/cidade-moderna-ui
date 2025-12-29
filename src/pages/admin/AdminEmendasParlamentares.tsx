import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Pencil, Trash2, FileText, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  useEmendasParlamentares,
  useCreateEmenda,
  useUpdateEmenda,
  useDeleteEmenda,
  EmendaParlamentar,
  EmendaParlamentarInsert,
} from '@/hooks/useEmendasParlamentares';

const initialFormState: Partial<EmendaParlamentarInsert> = {
  titulo: '',
  descricao: '',
  arquivo_url: '',
  arquivo_nome: '',
  data_referencia: '',
  data_postagem: new Date().toISOString().split('T')[0],
  ano_referencia: new Date().getFullYear(),
  observacoes: '',
  publicado: true,
  ordem: 0,
};

export default function AdminEmendasParlamentares() {
  const { data: emendas, isLoading } = useEmendasParlamentares(true);
  const createEmenda = useCreateEmenda();
  const updateEmenda = useUpdateEmenda();
  const deleteEmenda = useDeleteEmenda();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmenda, setEditingEmenda] = useState<EmendaParlamentar | null>(null);
  const [formData, setFormData] = useState<Partial<EmendaParlamentarInsert>>(initialFormState);

  const openNewDialog = () => {
    setEditingEmenda(null);
    setFormData(initialFormState);
    setDialogOpen(true);
  };

  const openEditDialog = (emenda: EmendaParlamentar) => {
    setEditingEmenda(emenda);
    setFormData({
      titulo: emenda.titulo,
      descricao: emenda.descricao || '',
      arquivo_url: emenda.arquivo_url,
      arquivo_nome: emenda.arquivo_nome,
      data_referencia: emenda.data_referencia,
      data_postagem: emenda.data_postagem,
      ano_referencia: emenda.ano_referencia,
      observacoes: emenda.observacoes || '',
      publicado: emenda.publicado,
      ordem: emenda.ordem,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.titulo || !formData.arquivo_url || !formData.arquivo_nome || !formData.data_referencia) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      if (editingEmenda) {
        await updateEmenda.mutateAsync({ id: editingEmenda.id, ...formData } as any);
        toast.success('Emenda atualizada com sucesso');
      } else {
        await createEmenda.mutateAsync(formData as EmendaParlamentarInsert);
        toast.success('Emenda cadastrada com sucesso');
      }
      setDialogOpen(false);
    } catch (error) {
      toast.error('Erro ao salvar emenda');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta emenda?')) return;
    try {
      await deleteEmenda.mutateAsync(id);
      toast.success('Emenda excluída com sucesso');
    } catch (error) {
      toast.error('Erro ao excluir emenda');
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return dateStr;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Emendas Parlamentares</h1>
            <p className="text-muted-foreground">Gerencie os documentos de emendas parlamentares</p>
          </div>
          <Button onClick={openNewDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Emenda
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Lista de Emendas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : emendas && emendas.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Ano</TableHead>
                    <TableHead>Data Referência</TableHead>
                    <TableHead>Data Postagem</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emendas.map((emenda) => (
                    <TableRow key={emenda.id}>
                      <TableCell className="font-medium">{emenda.titulo}</TableCell>
                      <TableCell>{emenda.ano_referencia}</TableCell>
                      <TableCell>{formatDate(emenda.data_referencia)}</TableCell>
                      <TableCell>{formatDate(emenda.data_postagem)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${emenda.publicado ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {emenda.publicado ? 'Publicado' : 'Rascunho'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon" asChild>
                          <a href={emenda.arquivo_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(emenda)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(emenda.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-muted-foreground py-8">Nenhuma emenda cadastrada</p>
            )}
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingEmenda ? 'Editar Emenda' : 'Nova Emenda'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título *</Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    placeholder="Título da emenda"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ano">Ano de Referência *</Label>
                  <Input
                    id="ano"
                    type="number"
                    value={formData.ano_referencia}
                    onChange={(e) => setFormData({ ...formData, ano_referencia: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descrição breve da emenda"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="arquivo_url">URL do Arquivo *</Label>
                  <Input
                    id="arquivo_url"
                    value={formData.arquivo_url}
                    onChange={(e) => setFormData({ ...formData, arquivo_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arquivo_nome">Nome do Arquivo *</Label>
                  <Input
                    id="arquivo_nome"
                    value={formData.arquivo_nome}
                    onChange={(e) => setFormData({ ...formData, arquivo_nome: e.target.value })}
                    placeholder="documento.pdf"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="data_referencia">Data de Referência *</Label>
                  <Input
                    id="data_referencia"
                    type="date"
                    value={formData.data_referencia}
                    onChange={(e) => setFormData({ ...formData, data_referencia: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data_postagem">Data de Postagem</Label>
                  <Input
                    id="data_postagem"
                    type="date"
                    value={formData.data_postagem}
                    onChange={(e) => setFormData({ ...formData, data_postagem: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  placeholder="Observações adicionais"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="publicado"
                  checked={formData.publicado}
                  onCheckedChange={(checked) => setFormData({ ...formData, publicado: checked })}
                />
                <Label htmlFor="publicado">Publicado</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={createEmenda.isPending || updateEmenda.isPending}>
                {editingEmenda ? 'Salvar Alterações' : 'Cadastrar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
