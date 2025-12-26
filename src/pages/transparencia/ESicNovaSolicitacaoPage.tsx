import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Send, CheckCircle, AlertCircle, MessageSquareText } from 'lucide-react';
import { AccessibilityBar } from '@/components/portal/AccessibilityBar';
import { TopBar } from '@/components/portal/TopBar';
import { Header } from '@/components/portal/Header';
import { Footer } from '@/components/portal/Footer';
import { Breadcrumbs } from '@/components/portal/Breadcrumbs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateSolicitacao } from '@/hooks/useESic';

const breadcrumbItems = [
  { label: "Transparência", href: "/transparencia" },
  { label: "e-SIC", href: "/transparencia/esic" },
  { label: "Nova Solicitação" },
];

export default function ESicNovaSolicitacaoPage() {
  const navigate = useNavigate();
  const createSolicitacao = useCreateSolicitacao();
  const [protocoloGerado, setProtocoloGerado] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    solicitante_nome: '',
    solicitante_email: '',
    solicitante_telefone: '',
    solicitante_documento: '',
    assunto: '',
    descricao: '',
    forma_recebimento: 'email',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.solicitante_nome.trim()) {
      newErrors.solicitante_nome = 'Nome é obrigatório';
    }

    if (!formData.solicitante_email.trim()) {
      newErrors.solicitante_email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.solicitante_email)) {
      newErrors.solicitante_email = 'E-mail inválido';
    }

    if (!formData.assunto.trim()) {
      newErrors.assunto = 'Assunto é obrigatório';
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição da solicitação é obrigatória';
    } else if (formData.descricao.trim().length < 20) {
      newErrors.descricao = 'Descreva sua solicitação com mais detalhes (mínimo 20 caracteres)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const result = await createSolicitacao.mutateAsync(formData);
      setProtocoloGerado(result.protocolo);
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
    }
  };

  if (protocoloGerado) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <AccessibilityBar />
        <TopBar />
        <Header />
        
        <main className="flex-1">
          <section className="bg-gradient-to-br from-primary via-primary/90 to-secondary py-12 md:py-16">
            <div className="container mx-auto px-4">
              <Breadcrumbs items={[...breadcrumbItems.slice(0, -1), { label: "Confirmação" }]} variant="light" className="mb-6" />
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-primary-foreground/20 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground">
                    Solicitação Registrada
                  </h1>
                  <p className="text-primary-foreground/80 mt-1">
                    Sua solicitação foi registrada com sucesso
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
              <Card className="border-green-200 bg-green-50">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle className="text-green-800">Solicitação Registrada!</CardTitle>
                  <CardDescription className="text-green-700">
                    Sua solicitação foi registrada com sucesso no sistema e-SIC
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-white p-6 rounded-lg border border-green-200 text-center">
                    <p className="text-sm text-muted-foreground mb-2">Número do Protocolo</p>
                    <p className="text-3xl font-bold text-primary">{protocoloGerado}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Guarde este número para acompanhar sua solicitação
                    </p>
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Prazo de resposta:</strong> Sua solicitação será respondida em até 20 dias úteis, 
                      podendo ser prorrogada por mais 10 dias mediante justificativa.
                    </AlertDescription>
                  </Alert>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={() => navigate(`/transparencia/esic/consultar?protocolo=${protocoloGerado}`)}>
                      Acompanhar Solicitação
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/transparencia/esic')}>
                      Voltar ao e-SIC
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AccessibilityBar />
      <TopBar />
      <Header />
      
      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary via-primary/90 to-secondary py-12 md:py-16">
          <div className="container mx-auto px-4">
            <Breadcrumbs items={breadcrumbItems} variant="light" className="mb-6" />
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-primary-foreground/20 rounded-lg">
                <MessageSquareText className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground">
                  Nova Solicitação de Informação
                </h1>
                <p className="text-primary-foreground/80 mt-1">
                  Registre sua solicitação de acesso à informação pública
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <Alert className="mb-6 border-primary/30 bg-primary/5">
              <CheckCircle className="h-4 w-4 text-primary" />
              <AlertDescription className="text-muted-foreground">
                <strong>Importante:</strong> Conforme a Lei nº 12.527/2011, não é necessário justificar o motivo 
                da sua solicitação. Apenas descreva a informação que deseja obter.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Formulário de Solicitação
                </CardTitle>
                <CardDescription>
                  Preencha os dados abaixo para registrar sua solicitação
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Dados do Solicitante */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Dados do Solicitante</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="solicitante_nome">Nome Completo *</Label>
                        <Input
                          id="solicitante_nome"
                          value={formData.solicitante_nome}
                          onChange={(e) => setFormData({ ...formData, solicitante_nome: e.target.value })}
                          placeholder="Seu nome completo"
                          className={errors.solicitante_nome ? 'border-red-500' : ''}
                        />
                        {errors.solicitante_nome && (
                          <p className="text-sm text-red-500">{errors.solicitante_nome}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="solicitante_email">E-mail *</Label>
                        <Input
                          id="solicitante_email"
                          type="email"
                          value={formData.solicitante_email}
                          onChange={(e) => setFormData({ ...formData, solicitante_email: e.target.value })}
                          placeholder="seu@email.com"
                          className={errors.solicitante_email ? 'border-red-500' : ''}
                        />
                        {errors.solicitante_email && (
                          <p className="text-sm text-red-500">{errors.solicitante_email}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="solicitante_telefone">Telefone (opcional)</Label>
                        <Input
                          id="solicitante_telefone"
                          value={formData.solicitante_telefone}
                          onChange={(e) => setFormData({ ...formData, solicitante_telefone: e.target.value })}
                          placeholder="(00) 00000-0000"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="solicitante_documento">CPF/CNPJ (opcional)</Label>
                        <Input
                          id="solicitante_documento"
                          value={formData.solicitante_documento}
                          onChange={(e) => setFormData({ ...formData, solicitante_documento: e.target.value })}
                          placeholder="000.000.000-00"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dados da Solicitação */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Dados da Solicitação</h3>

                    <div className="space-y-2">
                      <Label htmlFor="assunto">Assunto *</Label>
                      <Input
                        id="assunto"
                        value={formData.assunto}
                        onChange={(e) => setFormData({ ...formData, assunto: e.target.value })}
                        placeholder="Ex: Gastos com publicidade no exercício de 2024"
                        className={errors.assunto ? 'border-red-500' : ''}
                      />
                      {errors.assunto && (
                        <p className="text-sm text-red-500">{errors.assunto}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="descricao">Descrição da Informação Solicitada *</Label>
                      <Textarea
                        id="descricao"
                        value={formData.descricao}
                        onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                        placeholder="Descreva de forma clara e objetiva a informação que deseja obter. Quanto mais detalhes, mais fácil será encontrar a informação solicitada."
                        rows={6}
                        className={errors.descricao ? 'border-red-500' : ''}
                      />
                      {errors.descricao && (
                        <p className="text-sm text-red-500">{errors.descricao}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {formData.descricao.length} caracteres
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="forma_recebimento">Forma de Recebimento da Resposta</Label>
                      <Select
                        value={formData.forma_recebimento}
                        onValueChange={(value) => setFormData({ ...formData, forma_recebimento: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Por E-mail</SelectItem>
                          <SelectItem value="presencial">Presencialmente no SIC</SelectItem>
                          <SelectItem value="correio">Por Correio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button type="submit" className="flex-1 gap-2" disabled={createSolicitacao.isPending}>
                      <Send className="w-4 h-4" />
                      {createSolicitacao.isPending ? 'Enviando...' : 'Enviar Solicitação'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => navigate('/transparencia/esic')}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
