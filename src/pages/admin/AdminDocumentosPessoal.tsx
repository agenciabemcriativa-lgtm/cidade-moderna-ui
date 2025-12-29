import { useState } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, FileText, ExternalLink } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useDocumentosPessoal,
  useCreateDocumentoPessoal,
  useUpdateDocumentoPessoal,
  useDeleteDocumentoPessoal,
  TipoDocumentoPessoal,
  DocumentoPessoal,
  tipoLabels,
  mesesLabels,
} from '@/hooks/useDocumentosPessoal';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

interface DocumentFormProps {
  tipo: TipoDocumentoPessoal;
}

function DocumentForm({ tipo }: DocumentFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DocumentoPessoal | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [anoFiltro, setAnoFiltro] = useState<number | undefined>(undefined);

  const { data: documentos, isLoading } = useDocumentosPessoal(tipo, anoFiltro, true);
  const createMutation = useCreateDocumentoPessoal();
  const updateMutation = useUpdateDocumentoPessoal();
  const deleteMutation = useDeleteDocumentoPessoal();

  const [formData, setFormData] = useState({
    titulo: '',
    mes_referencia: new Date().getMonth() + 1,
    ano_referencia: currentYear,
    arquivo_url: '',
    data_postagem: new Date().toISOString().split('T')[0],
    publicado: true,
  });

  const resetForm = () => {
    setFormData({
      titulo: '',
      mes_referencia: new Date().getMonth() + 1,
      ano_referencia: currentYear,
      arquivo_url: '',
      data_postagem: new Date().toISOString().split('T')[0],
      publicado: true,
    });
    setEditingDoc(null);
  };

  const handleOpenDialog = (doc?: DocumentoPessoal) => {
    if (doc) {
      setEditingDoc(doc);
      setFormData({
        titulo: doc.titulo,
        mes_referencia: doc.mes_referencia,
        ano_referencia: doc.ano_referencia,
        arquivo_url: doc.arquivo_url,
        data_postagem: doc.data_postagem,
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

    const arquivo_nome = `${tipo}-${formData.mes_referencia}-${formData.ano_referencia}.pdf`;

    const dataToSubmit = {
      tipo,
      titulo: formData.titulo,
      mes_referencia: formData.mes_referencia,
      ano_referencia: formData.ano_referencia,
      arquivo_url: formData.arquivo_url,
      arquivo_nome,
      data_postagem: formData.data_postagem,
      publicado: formData.publicado,
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
    } catch (error) {
      toast.error('Erro ao salvar documento.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este documento?')) return;

    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Documento excluído com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir documento.');
    }
  };

  const filteredDocs = documentos?.filter(
    (doc) =>
      doc.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.arquivo_nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <Input
            placeholder="Buscar por título ou arquivo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Select
            value={anoFiltro?.toString() || 'todos'}
            onValueChange={(v) => setAnoFiltro(v === 'todos' ? undefined : parseInt(v))}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Documento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingDoc ? 'Editar' : 'Novo'} Documento</DialogTitle>
              <DialogDescription>
                {tipoLabels[tipo]}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder={`Ex: ${tipoLabels[tipo]} - Janeiro/2025`}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mes">Mês *</Label>
                  <Select
                    value={formData.mes_referencia.toString()}
                    onValueChange={(v) => setFormData({ ...formData, mes_referencia: parseInt(v) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Mês" />
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
                <div>
                  <Label htmlFor="ano">Ano *</Label>
                  <Select
                    value={formData.ano_referencia.toString()}
                    onValueChange={(v) => setFormData({ ...formData, ano_referencia: parseInt(v) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Ano" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
              <div>
                <Label htmlFor="arquivo_url">Link do Arquivo *</Label>
                <Input
                  id="arquivo_url"
                  type="url"
                  value={formData.arquivo_url}
                  onChange={(e) => setFormData({ ...formData, arquivo_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="publicado"
                  checked={formData.publicado}
                  onCheckedChange={(v) => setFormData({ ...formData, publicado: v })}
                />
                <Label htmlFor="publicado">Publicado</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingDoc ? 'Salvar' : 'Cadastrar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : filteredDocs && filteredDocs.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Referência</TableHead>
                <TableHead>Título</TableHead>
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
                    {mesesLabels[doc.mes_referencia]}/{doc.ano_referencia}
                  </TableCell>
                  <TableCell>{doc.titulo}</TableCell>
                  <TableCell>
                    {new Date(doc.data_postagem).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <a
                      href={doc.arquivo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      <FileText className="h-4 w-4" />
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        doc.publicado
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {doc.publicado ? 'Publicado' : 'Rascunho'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(doc)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(doc.id)}
                        disabled={deleteMutation.isPending}
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
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum documento encontrado.
        </div>
      )}
    </div>
  );
}

export default function AdminDocumentosPessoal() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Documentos de Pessoal</h1>
          <p className="text-muted-foreground">
            Gerencie os documentos de servidores, estagiários e remunerações
          </p>
        </div>

        <Tabs defaultValue="estagiarios" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="estagiarios">Estagiários</TabsTrigger>
            <TabsTrigger value="remuneracao_cargo">Remuneração de Cargo</TabsTrigger>
            <TabsTrigger value="servidores">Servidores</TabsTrigger>
            <TabsTrigger value="lista_nominal_cargo">Lista Nominal</TabsTrigger>
          </TabsList>
          <TabsContent value="estagiarios" className="mt-6">
            <DocumentForm tipo="estagiarios" />
          </TabsContent>
          <TabsContent value="remuneracao_cargo" className="mt-6">
            <DocumentForm tipo="remuneracao_cargo" />
          </TabsContent>
          <TabsContent value="servidores" className="mt-6">
            <DocumentForm tipo="servidores" />
          </TabsContent>
          <TabsContent value="lista_nominal_cargo" className="mt-6">
            <DocumentForm tipo="lista_nominal_cargo" />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
