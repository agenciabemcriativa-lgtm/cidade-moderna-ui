import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Plus, Pencil, Trash2, Shield, Mail, Phone } from "lucide-react";
import {
  useDpoEncarregado,
  useCreateDpo,
  useUpdateDpo,
  useDeleteDpo,
  DpoEncarregado,
} from "@/hooks/useDpoEncarregado";

export default function AdminDpoEncarregado() {
  const { data: lista = [], isLoading } = useDpoEncarregado(true);
  const createMut = useCreateDpo();
  const updateMut = useUpdateDpo();
  const deleteMut = useDeleteDpo();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<DpoEncarregado | null>(null);

  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [portaria, setPortaria] = useState("");
  const [dataNomeacao, setDataNomeacao] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [ativo, setAtivo] = useState(true);

  const reset = () => {
    setEditing(null);
    setNome("");
    setCargo("");
    setEmail("");
    setTelefone("");
    setPortaria("");
    setDataNomeacao("");
    setObservacoes("");
    setAtivo(true);
  };

  const openEdit = (dpo: DpoEncarregado) => {
    setEditing(dpo);
    setNome(dpo.nome);
    setCargo(dpo.cargo ?? "");
    setEmail(dpo.email);
    setTelefone(dpo.telefone ?? "");
    setPortaria(dpo.portaria_nomeacao ?? "");
    setDataNomeacao(dpo.data_nomeacao ?? "");
    setObservacoes(dpo.observacoes ?? "");
    setAtivo(dpo.ativo);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!nome.trim() || !email.trim()) return;
    const data = {
      nome,
      cargo: cargo || null,
      email,
      telefone: telefone || null,
      portaria_nomeacao: portaria || null,
      data_nomeacao: dataNomeacao || null,
      observacoes: observacoes || null,
      ativo,
    };
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
              <Shield className="w-6 h-6" />
              Encarregado de Proteção de Dados (DPO)
            </h1>
            <p className="text-muted-foreground">
              Gerencie os dados do Encarregado pelo Tratamento de Dados Pessoais conforme Art. 41 da LGPD.
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
                Novo Encarregado
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editing ? "Editar Encarregado" : "Novo Encarregado"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Nome completo *</Label>
                  <Input value={nome} onChange={(e) => setNome(e.target.value)} />
                </div>
                <div>
                  <Label>Cargo / Função</Label>
                  <Input
                    value={cargo}
                    onChange={(e) => setCargo(e.target.value)}
                    placeholder="Ex: Encarregado de Dados"
                  />
                </div>
                <div>
                  <Label>E-mail *</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="dpo@municipio.gov.br"
                  />
                </div>
                <div>
                  <Label>Telefone</Label>
                  <Input
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="(00) 0000-0000"
                  />
                </div>
                <div>
                  <Label>Portaria de Nomeação</Label>
                  <Input
                    value={portaria}
                    onChange={(e) => setPortaria(e.target.value)}
                    placeholder="Ex: Portaria nº 123/2024"
                  />
                </div>
                <div>
                  <Label>Data de Nomeação</Label>
                  <Input
                    type="date"
                    value={dataNomeacao}
                    onChange={(e) => setDataNomeacao(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Observações</Label>
                  <Textarea
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={ativo} onCheckedChange={setAtivo} />
                  <Label>Ativo (exibir publicamente)</Label>
                </div>
                <Button
                  onClick={handleSave}
                  disabled={createMut.isPending || updateMut.isPending}
                  className="w-full"
                >
                  {editing ? "Atualizar" : "Cadastrar"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Carregando...</div>
        ) : lista.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum DPO cadastrado</h3>
              <p className="text-muted-foreground mb-4">
                Cadastre o Encarregado de Proteção de Dados do município.
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Cadastrar DPO
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {lista.map((dpo) => (
              <Card key={dpo.id}>
                <CardContent className="py-4 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{dpo.nome}</h3>
                      <Badge variant={dpo.ativo ? "default" : "secondary"}>
                        {dpo.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    {dpo.cargo && <p className="text-sm text-muted-foreground">{dpo.cargo}</p>}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {dpo.email}
                      </span>
                      {dpo.telefone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {dpo.telefone}
                        </span>
                      )}
                    </div>
                    {dpo.portaria_nomeacao && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {dpo.portaria_nomeacao}
                        {dpo.data_nomeacao && ` — ${new Date(dpo.data_nomeacao).toLocaleDateString("pt-BR")}`}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(dpo)}>
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
                          <AlertDialogTitle>Excluir registro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteMut.mutate(dpo.id)}
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
