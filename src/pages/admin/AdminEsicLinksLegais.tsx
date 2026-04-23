import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Plus, Pencil, Trash2, ExternalLink, Link as LinkIcon, Scale } from "lucide-react";
import {
  useEsicLinksLegais,
  useCreateEsicLinkLegal,
  useUpdateEsicLinkLegal,
  useDeleteEsicLinkLegal,
  EsicLinkLegal,
} from "@/hooks/useEsicLinksLegais";

export default function AdminEsicLinksLegais() {
  const { data: links = [], isLoading } = useEsicLinksLegais(true);
  const createMut = useCreateEsicLinkLegal();
  const updateMut = useUpdateEsicLinkLegal();
  const deleteMut = useDeleteEsicLinkLegal();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<EsicLinkLegal | null>(null);

  const [titulo, setTitulo] = useState("");
  const [url, setUrl] = useState("");
  const [tipo, setTipo] = useState<"externo" | "interno">("externo");
  const [ordem, setOrdem] = useState(0);
  const [ativo, setAtivo] = useState(true);

  const reset = () => {
    setEditing(null);
    setTitulo("");
    setUrl("");
    setTipo("externo");
    setOrdem(0);
    setAtivo(true);
  };

  const openEdit = (link: EsicLinkLegal) => {
    setEditing(link);
    setTitulo(link.titulo);
    setUrl(link.url);
    setTipo(link.tipo);
    setOrdem(link.ordem);
    setAtivo(link.ativo);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!titulo.trim() || !url.trim()) return;
    const data = { titulo, url, tipo, ordem, ativo };
    if (editing) {
      await updateMut.mutateAsync({ id: editing.id, ...data });
    } else {
      await createMut.mutateAsync(data);
    }
    setDialogOpen(false);
    reset();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Scale className="w-6 h-6" />
              Fundamentação Legal (e-SIC)
            </h1>
            <p className="text-muted-foreground">
              Gerencie os links de leis, decretos e normas exibidos nas páginas do e-SIC e Acesso à Informação.
            </p>
          </div>

          <Dialog
            open={dialogOpen}
            onOpenChange={(o) => {
              setDialogOpen(o);
              if (!o) reset();
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Novo Link
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editing ? "Editar Link" : "Novo Link"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Título</Label>
                  <Input
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Ex: Lei nº 12.527/2011 (LAI)"
                  />
                </div>
                <div>
                  <Label>URL</Label>
                  <Input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://... ou /legislacao/..."
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use URL completa para links externos ou caminho iniciando com / para links internos.
                  </p>
                </div>
                <div>
                  <Label>Tipo</Label>
                  <Select value={tipo} onValueChange={(v: "externo" | "interno") => setTipo(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="externo">Externo (abre em nova aba)</SelectItem>
                      <SelectItem value="interno">Interno (página deste portal)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Ordem</Label>
                  <Input
                    type="number"
                    value={ordem}
                    onChange={(e) => setOrdem(Number(e.target.value))}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={ativo} onCheckedChange={setAtivo} />
                  <Label>Ativo</Label>
                </div>
                <Button
                  onClick={handleSave}
                  disabled={createMut.isPending || updateMut.isPending}
                  className="w-full"
                >
                  {editing ? "Atualizar" : "Criar"} Link
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Carregando...</div>
        ) : links.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <LinkIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum link cadastrado</h3>
              <p className="text-muted-foreground mb-4">
                Crie o primeiro link da fundamentação legal.
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar link
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {links.map((link) => (
              <Card key={link.id}>
                <CardContent className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Badge variant="outline">#{link.ordem}</Badge>
                    {link.tipo === "externo" ? (
                      <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0" />
                    ) : (
                      <LinkIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="font-medium truncate">{link.titulo}</p>
                      <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                    </div>
                    <Badge variant={link.ativo ? "default" : "secondary"}>
                      {link.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(link)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir link?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteMut.mutate(link.id)}
                            className="bg-destructive text-destructive-foreground"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
