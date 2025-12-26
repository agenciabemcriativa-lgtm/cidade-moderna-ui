import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Star,
  StarOff,
  Search,
  FileText,
  ExternalLink,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { toast } from "sonner";
import {
  useCartaServicosAdmin,
  useCreateCartaServico,
  useUpdateCartaServico,
  useDeleteCartaServico,
  CartaServico,
  CartaServicoInsert,
} from "@/hooks/useCartaServicos";
import { useSecretarias } from "@/hooks/useSecretarias";
import { Link } from "react-router-dom";

const formSchema = z.object({
  titulo: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  slug: z.string().min(3, "Slug deve ter pelo menos 3 caracteres"),
  descricao: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  categoria: z.string().min(2, "Categoria é obrigatória"),
  requisitos: z.string().optional(),
  documentos_necessarios: z.string().optional(),
  etapas_atendimento: z.string().optional(),
  prazo_maximo: z.string().optional(),
  prazo_medio: z.string().optional(),
  forma_prestacao: z.string().default("presencial"),
  canal_acesso: z.string().optional(),
  local_atendimento: z.string().optional(),
  horario_atendimento: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  site_url: z.string().url("URL inválida").optional().or(z.literal("")),
  gratuito: z.boolean().default(true),
  custos_taxas: z.string().optional(),
  prioridades_atendimento: z.string().optional(),
  tempo_espera_estimado: z.string().optional(),
  mecanismo_consulta: z.string().optional(),
  procedimento_manifestacao: z.string().optional(),
  base_legal: z.string().optional(),
  orgao_responsavel: z.string().optional(),
  secretaria_id: z.string().optional(),
  publicado: z.boolean().default(false),
  destaque: z.boolean().default(false),
  ordem: z.coerce.number().default(0),
});

type FormData = z.infer<typeof formSchema>;

const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

const categoriasSugeridas = [
  "Saúde",
  "Educação",
  "Assistência Social",
  "Meio Ambiente",
  "Obras e Urbanismo",
  "Tributos e Finanças",
  "Cultura e Esporte",
  "Transporte",
  "Agricultura",
  "Documentos e Certidões",
  "Habitação",
  "Segurança",
];

export default function AdminCartaServicos() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingServico, setEditingServico] = useState<CartaServico | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: servicos, isLoading } = useCartaServicosAdmin();
  const { data: secretarias } = useSecretarias();
  const createMutation = useCreateCartaServico();
  const updateMutation = useUpdateCartaServico();
  const deleteMutation = useDeleteCartaServico();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: "",
      slug: "",
      descricao: "",
      categoria: "",
      requisitos: "",
      documentos_necessarios: "",
      etapas_atendimento: "",
      prazo_maximo: "",
      prazo_medio: "",
      forma_prestacao: "presencial",
      canal_acesso: "",
      local_atendimento: "",
      horario_atendimento: "",
      telefone: "",
      email: "",
      site_url: "",
      gratuito: true,
      custos_taxas: "",
      prioridades_atendimento: "",
      tempo_espera_estimado: "",
      mecanismo_consulta: "",
      procedimento_manifestacao: "",
      base_legal: "",
      orgao_responsavel: "",
      secretaria_id: "",
      publicado: false,
      destaque: false,
      ordem: 0,
    },
  });

  const filteredServicos = servicos?.filter(
    (s) =>
      s.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (servico?: CartaServico) => {
    if (servico) {
      setEditingServico(servico);
      form.reset({
        ...servico,
        requisitos: servico.requisitos || "",
        documentos_necessarios: servico.documentos_necessarios || "",
        etapas_atendimento: servico.etapas_atendimento || "",
        prazo_maximo: servico.prazo_maximo || "",
        prazo_medio: servico.prazo_medio || "",
        canal_acesso: servico.canal_acesso || "",
        local_atendimento: servico.local_atendimento || "",
        horario_atendimento: servico.horario_atendimento || "",
        telefone: servico.telefone || "",
        email: servico.email || "",
        site_url: servico.site_url || "",
        custos_taxas: servico.custos_taxas || "",
        prioridades_atendimento: servico.prioridades_atendimento || "",
        tempo_espera_estimado: servico.tempo_espera_estimado || "",
        mecanismo_consulta: servico.mecanismo_consulta || "",
        procedimento_manifestacao: servico.procedimento_manifestacao || "",
        base_legal: servico.base_legal || "",
        orgao_responsavel: servico.orgao_responsavel || "",
        secretaria_id: servico.secretaria_id || "",
      });
    } else {
      setEditingServico(null);
      form.reset();
    }
    setIsDialogOpen(true);
  };

  const handleTituloChange = (titulo: string) => {
    form.setValue("titulo", titulo);
    if (!editingServico) {
      form.setValue("slug", generateSlug(titulo));
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const payload: CartaServicoInsert = {
        titulo: data.titulo,
        slug: data.slug,
        descricao: data.descricao,
        categoria: data.categoria,
        forma_prestacao: data.forma_prestacao,
        gratuito: data.gratuito,
        publicado: data.publicado,
        destaque: data.destaque,
        ordem: data.ordem,
        email: data.email || null,
        site_url: data.site_url || null,
        secretaria_id: data.secretaria_id || null,
        requisitos: data.requisitos || null,
        documentos_necessarios: data.documentos_necessarios || null,
        etapas_atendimento: data.etapas_atendimento || null,
        prazo_maximo: data.prazo_maximo || null,
        prazo_medio: data.prazo_medio || null,
        canal_acesso: data.canal_acesso || null,
        local_atendimento: data.local_atendimento || null,
        horario_atendimento: data.horario_atendimento || null,
        telefone: data.telefone || null,
        custos_taxas: data.custos_taxas || null,
        prioridades_atendimento: data.prioridades_atendimento || null,
        tempo_espera_estimado: data.tempo_espera_estimado || null,
        mecanismo_consulta: data.mecanismo_consulta || null,
        procedimento_manifestacao: data.procedimento_manifestacao || null,
        base_legal: data.base_legal || null,
        orgao_responsavel: data.orgao_responsavel || null,
      };

      if (editingServico) {
        await updateMutation.mutateAsync({ id: editingServico.id, ...payload });
        toast.success("Serviço atualizado com sucesso!");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Serviço criado com sucesso!");
      }
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      toast.error("Erro ao salvar serviço");
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Serviço excluído com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir serviço");
    }
  };

  const handleTogglePublicado = async (servico: CartaServico) => {
    try {
      await updateMutation.mutateAsync({
        id: servico.id,
        publicado: !servico.publicado,
      });
      toast.success(servico.publicado ? "Serviço despublicado" : "Serviço publicado");
    } catch (error) {
      toast.error("Erro ao alterar status");
    }
  };

  const handleToggleDestaque = async (servico: CartaServico) => {
    try {
      await updateMutation.mutateAsync({
        id: servico.id,
        destaque: !servico.destaque,
      });
      toast.success(servico.destaque ? "Destaque removido" : "Serviço destacado");
    } catch (error) {
      toast.error("Erro ao alterar destaque");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Carta de Serviços ao Cidadão
            </h1>
            <p className="text-muted-foreground">
              Gerencie os serviços públicos conforme Lei 13.460/2017
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Serviço
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar serviço..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" asChild>
                <Link to="/carta-de-servicos" target="_blank">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ver Página Pública
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Serviço</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Forma</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Destaque</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredServicos?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          Nenhum serviço cadastrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredServicos?.map((servico) => (
                        <TableRow key={servico.id}>
                          <TableCell>
                            <div className="font-medium">{servico.titulo}</div>
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {servico.descricao}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{servico.categoria}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {servico.forma_prestacao === "presencial"
                                ? "Presencial"
                                : servico.forma_prestacao === "online"
                                ? "Online"
                                : "Híbrido"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleTogglePublicado(servico)}
                            >
                              {servico.publicado ? (
                                <Eye className="h-4 w-4 text-green-600" />
                              ) : (
                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleDestaque(servico)}
                            >
                              {servico.destaque ? (
                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              ) : (
                                <StarOff className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenDialog(servico)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja excluir o serviço "{servico.titulo}"? Esta
                                      ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(servico.id)}>
                                      Excluir
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>
                {editingServico ? "Editar Serviço" : "Novo Serviço"}
              </DialogTitle>
              <DialogDescription>
                Preencha as informações do serviço conforme exigido pela Lei 13.460/2017
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <ScrollArea className="h-[60vh] pr-4">
                  <Tabs defaultValue="basico" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-4">
                      <TabsTrigger value="basico">Básico</TabsTrigger>
                      <TabsTrigger value="requisitos">Requisitos</TabsTrigger>
                      <TabsTrigger value="atendimento">Atendimento</TabsTrigger>
                      <TabsTrigger value="contato">Contato</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basico" className="space-y-4">
                      <FormField
                        control={form.control}
                        name="titulo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Título do Serviço *</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                onChange={(e) => handleTituloChange(e.target.value)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Slug (URL) *</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              URL: /carta-de-servicos/{field.value || "slug"}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="descricao"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descrição *</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={3} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="categoria"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Categoria *</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {categoriasSugeridas.map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                      {cat}
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
                          name="forma_prestacao"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Forma de Prestação *</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="presencial">Presencial</SelectItem>
                                  <SelectItem value="online">Online</SelectItem>
                                  <SelectItem value="hibrido">Presencial e Online</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="prazo_maximo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Prazo Máximo</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Ex: 30 dias" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="prazo_medio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Prazo Médio</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Ex: 15 dias" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="tempo_espera_estimado"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tempo de Espera</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Ex: 20 minutos" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex items-center gap-6">
                        <FormField
                          control={form.control}
                          name="gratuito"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-2">
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="!mt-0">Serviço Gratuito</FormLabel>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="publicado"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-2">
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="!mt-0">Publicado</FormLabel>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="destaque"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-2">
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="!mt-0">Destaque</FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>

                      {!form.watch("gratuito") && (
                        <FormField
                          control={form.control}
                          name="custos_taxas"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Custos e Taxas</FormLabel>
                              <FormControl>
                                <Textarea {...field} rows={2} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </TabsContent>

                    <TabsContent value="requisitos" className="space-y-4">
                      <FormField
                        control={form.control}
                        name="requisitos"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Requisitos</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                rows={4}
                                placeholder="Liste os requisitos necessários para acessar o serviço"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="documentos_necessarios"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Documentos Necessários</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                rows={4}
                                placeholder="Liste os documentos que o cidadão deve apresentar"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="etapas_atendimento"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Etapas do Atendimento</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                rows={4}
                                placeholder="Descreva as etapas do processo de atendimento"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="base_legal"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Base Legal</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                rows={2}
                                placeholder="Leis, decretos ou normas que fundamentam o serviço"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>

                    <TabsContent value="atendimento" className="space-y-4">
                      <FormField
                        control={form.control}
                        name="canal_acesso"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Como Acessar o Serviço</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                rows={3}
                                placeholder="Descreva como o cidadão pode acessar o serviço"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="prioridades_atendimento"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prioridades de Atendimento</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                rows={3}
                                placeholder="Ex: Idosos, gestantes, pessoas com deficiência..."
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="mecanismo_consulta"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Como Consultar Andamento</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                rows={2}
                                placeholder="Como o cidadão pode acompanhar sua solicitação"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="procedimento_manifestacao"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Procedimento para Manifestações</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                rows={2}
                                placeholder="Como o cidadão pode fazer reclamações, sugestões ou elogios"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>

                    <TabsContent value="contato" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="orgao_responsavel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Órgão Responsável</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="secretaria_id"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Secretaria</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="">Nenhuma</SelectItem>
                                  {secretarias?.map((sec, index) => (
                                    <SelectItem key={index} value={sec.nome}>
                                      {sec.nome}
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
                        name="local_atendimento"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Local de Atendimento</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                rows={2}
                                placeholder="Endereço completo do local de atendimento"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="horario_atendimento"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Horário de Atendimento</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Ex: Segunda a Sexta, 08h às 14h" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="telefone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Telefone</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>E-mail</FormLabel>
                              <FormControl>
                                <Input {...field} type="email" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="site_url"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Site/URL</FormLabel>
                              <FormControl>
                                <Input {...field} type="url" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="ordem"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ordem de Exibição</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                  </Tabs>
                </ScrollArea>

                <DialogFooter className="mt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {editingServico ? "Salvar Alterações" : "Criar Serviço"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
