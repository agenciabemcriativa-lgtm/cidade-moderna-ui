import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Plus, Pencil, FileText, Eye, EyeOff, History, Search } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  usePublicacoesOficiais,
  useCreatePublicacao,
  useUpdatePublicacao,
  useAddHistorico,
  tipoLabels,
  situacaoLabels,
  situacaoColors,
  TipoPublicacao,
  SituacaoPublicacao,
  PublicacaoOficial,
} from "@/hooks/usePublicacoesOficiais";
import { useAuth } from "@/contexts/AuthContext";

const formSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  tipo: z.string().min(1, "Tipo é obrigatório"),
  numero: z.string().min(1, "Número é obrigatório"),
  ano: z.coerce.number().min(1900, "Ano inválido").max(2100, "Ano inválido"),
  data_publicacao: z.string().min(1, "Data é obrigatória"),
  secretaria_id: z.string().optional(),
  secretaria_nome: z.string().optional(),
  ementa: z.string().min(1, "Ementa é obrigatória"),
  texto_completo_url: z.string().optional(),
  situacao: z.string().default("vigente"),
  observacoes: z.string().optional(),
  publicado: z.boolean().default(true),
});

type FormData = z.infer<typeof formSchema>;

export default function AdminPublicacoesOficiais() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPublicacao, setEditingPublicacao] = useState<PublicacaoOficial | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState<string>("");
  const [filterSituacao, setFilterSituacao] = useState<string>("");

  const { toast } = useToast();
  const { user } = useAuth();
  
  // Query secretarias directly to get IDs
  const { data: secretarias } = useQuery({
    queryKey: ['secretarias-list'],
    queryFn: async () => {
      const { data } = await supabase
        .from('secretarias')
        .select('id, nome')
        .eq('ativo', true)
        .order('nome');
      return data || [];
    }
  });
  
  const { data: publicacoes, isLoading } = usePublicacoesOficiais({
    search: searchTerm || undefined,
    tipo: filterTipo as TipoPublicacao || undefined,
    situacao: filterSituacao as SituacaoPublicacao || undefined,
    publicado: undefined, // Show all for admin
  });

  const createMutation = useCreatePublicacao();
  const updateMutation = useUpdatePublicacao();
  const addHistoricoMutation = useAddHistorico();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: "",
      tipo: "",
      numero: "",
      ano: new Date().getFullYear(),
      data_publicacao: "",
      secretaria_id: "",
      secretaria_nome: "",
      ementa: "",
      texto_completo_url: "",
      situacao: "vigente",
      observacoes: "",
      publicado: true,
    },
  });

  const openCreateDialog = () => {
    setEditingPublicacao(null);
    form.reset({
      titulo: "",
      tipo: "",
      numero: "",
      ano: new Date().getFullYear(),
      data_publicacao: "",
      secretaria_id: "",
      secretaria_nome: "",
      ementa: "",
      texto_completo_url: "",
      situacao: "vigente",
      observacoes: "",
      publicado: true,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (publicacao: PublicacaoOficial) => {
    setEditingPublicacao(publicacao);
    form.reset({
      titulo: publicacao.titulo,
      tipo: publicacao.tipo,
      numero: publicacao.numero,
      ano: publicacao.ano,
      data_publicacao: publicacao.data_publicacao,
      secretaria_id: publicacao.secretaria_id || "",
      secretaria_nome: publicacao.secretaria_nome || "",
      ementa: publicacao.ementa,
      texto_completo_url: publicacao.texto_completo_url || "",
      situacao: publicacao.situacao,
      observacoes: publicacao.observacoes || "",
      publicado: publicacao.publicado,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    try {
      // Find secretaria name if id is provided
      let secretaria_nome = data.secretaria_nome;
      if (data.secretaria_id) {
        const sec = secretarias?.find(s => s.id === data.secretaria_id);
        if (sec) secretaria_nome = sec.nome;
      }

      const payload = {
        titulo: data.titulo,
        tipo: data.tipo as TipoPublicacao,
        numero: data.numero,
        ano: data.ano,
        data_publicacao: data.data_publicacao,
        secretaria_id: data.secretaria_id || null,
        secretaria_nome: secretaria_nome || null,
        ementa: data.ementa,
        texto_completo_url: data.texto_completo_url || null,
        situacao: data.situacao as SituacaoPublicacao,
        observacoes: data.observacoes || null,
        publicado: data.publicado,
      };

      if (editingPublicacao) {
        // Track changes for history
        const changes: { campo: string; anterior: string | null; novo: string | null }[] = [];
        
        if (editingPublicacao.titulo !== data.titulo) {
          changes.push({ campo: 'titulo', anterior: editingPublicacao.titulo, novo: data.titulo });
        }
        if (editingPublicacao.situacao !== data.situacao) {
          changes.push({ campo: 'situacao', anterior: editingPublicacao.situacao, novo: data.situacao });
        }
        if (editingPublicacao.ementa !== data.ementa) {
          changes.push({ campo: 'ementa', anterior: editingPublicacao.ementa, novo: data.ementa });
        }
        if (editingPublicacao.publicado !== data.publicado) {
          changes.push({ campo: 'publicado', anterior: String(editingPublicacao.publicado), novo: String(data.publicado) });
        }

        await updateMutation.mutateAsync({
          id: editingPublicacao.id,
          ...payload,
          updated_by: user?.id,
        });

        // Save history for each change
        for (const change of changes) {
          await addHistoricoMutation.mutateAsync({
            publicacao_id: editingPublicacao.id,
            campo_alterado: change.campo,
            valor_anterior: change.anterior,
            valor_novo: change.novo,
          });
        }

        toast({ title: "Publicação atualizada com sucesso!" });
      } else {
        await createMutation.mutateAsync({
          ...payload,
          created_by: user?.id,
          updated_by: user?.id,
          publicacao_relacionada_id: null,
        });
        toast({ title: "Publicação criada com sucesso!" });
      }

      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erro ao salvar publicação",
        description: "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const togglePublicado = async (publicacao: PublicacaoOficial) => {
    try {
      await updateMutation.mutateAsync({
        id: publicacao.id,
        publicado: !publicacao.publicado,
      });

      await addHistoricoMutation.mutateAsync({
        publicacao_id: publicacao.id,
        campo_alterado: 'publicado',
        valor_anterior: String(publicacao.publicado),
        valor_novo: String(!publicacao.publicado),
      });

      toast({
        title: publicacao.publicado ? "Publicação ocultada" : "Publicação tornada pública",
      });
    } catch (error) {
      toast({ title: "Erro ao alterar status", variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Publicações Oficiais</h1>
            <p className="text-muted-foreground">
              Gerencie leis, decretos, portarias e demais atos normativos
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Publicação
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingPublicacao ? "Editar Publicação" : "Nova Publicação"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="tipo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(tipoLabels).map(([value, label]) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <FormField
                        control={form.control}
                        name="numero"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número *</FormLabel>
                            <FormControl>
                              <Input placeholder="001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="ano"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ano *</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="titulo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título Oficial *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Lei que dispõe sobre..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="data_publicacao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Publicação *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="situacao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Situação *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(situacaoLabels).map(([value, label]) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="secretaria_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Secretaria / Órgão Emissor</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione (opcional)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">Nenhuma</SelectItem>
                            {secretarias?.map((sec) => (
                              <SelectItem key={sec.id} value={sec.id}>
                                {sec.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ementa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ementa / Resumo Oficial *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Dispõe sobre..."
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="texto_completo_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL do PDF (Texto Completo)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="observacoes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observações</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Observações adicionais..."
                            rows={2}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                      {editingPublicacao ? "Salvar Alterações" : "Criar Publicação"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por título, ementa ou número..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterTipo} onValueChange={setFilterTipo}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os tipos</SelectItem>
                  {Object.entries(tipoLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterSituacao} onValueChange={setFilterSituacao}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Situação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas</SelectItem>
                  {Object.entries(situacaoLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="pt-6">
            {isLoading ? (
              <p className="text-center py-8 text-muted-foreground">Carregando...</p>
            ) : publicacoes && publicacoes.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo/Número</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Situação</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {publicacoes.map((pub) => (
                      <TableRow key={pub.id}>
                        <TableCell>
                          <div>
                            <Badge variant="outline" className="mb-1">
                              {tipoLabels[pub.tipo]}
                            </Badge>
                            <p className="text-sm font-medium">
                              Nº {pub.numero}/{pub.ano}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium line-clamp-1">{pub.titulo}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {pub.ementa}
                          </p>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {format(new Date(pub.data_publicacao), "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell>
                          <Badge className={situacaoColors[pub.situacao]}>
                            {situacaoLabels[pub.situacao]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={pub.publicado ? "default" : "secondary"}>
                            {pub.publicado ? "Público" : "Oculto"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(pub)}
                              title="Editar"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => togglePublicado(pub)}
                              title={pub.publicado ? "Ocultar" : "Publicar"}
                            >
                              {pub.publicado ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
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
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma publicação encontrada</h3>
                <p className="text-muted-foreground mb-4">
                  Comece criando sua primeira publicação oficial.
                </p>
                <Button onClick={openCreateDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Publicação
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <History className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Conformidade Legal</h3>
                <p className="text-sm text-muted-foreground">
                  Este módulo atende às exigências da Lei de Acesso à Informação (LAI) e LC 131/2009. 
                  Todas as alterações são registradas em histórico para auditoria. 
                  Publicações não podem ser excluídas, apenas revogadas ou alteradas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
