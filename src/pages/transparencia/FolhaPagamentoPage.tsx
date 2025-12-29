import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { TopBar } from '@/components/portal/TopBar';
import { AccessibilityBar } from '@/components/portal/AccessibilityBar';
import { Header } from '@/components/portal/Header';
import { Breadcrumbs } from '@/components/portal/Breadcrumbs';
import { Footer } from '@/components/portal/Footer';
import { TransparenciaLayout } from '@/components/transparencia/TransparenciaLayout';
import { useFolhaPagamento, mesesLabels, categoriasLabels, CategoriaFolha } from '@/hooks/useFolhaPagamento';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Download, Calendar, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function FolhaPagamentoPage() {
  const currentYear = new Date().getFullYear();
  const [anoFiltro, setAnoFiltro] = useState<string>('all');
  
  const { data: documentos, isLoading } = useFolhaPagamento(
    anoFiltro !== 'all' ? parseInt(anoFiltro) : undefined
  );

  useEffect(() => {
    document.title = 'Folha de Pagamento | Portal da Transparência - Ipubi';
  }, []);

  const anos = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const handleDownload = (url: string, nome: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = nome;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Folha de Pagamento - Portal da Transparência - Prefeitura de Ipubi</title>
        <meta name="description" content="Documentos mensais da folha de pagamento dos servidores públicos municipais de Ipubi." />
      </Helmet>

      <TopBar />
      <AccessibilityBar />
      <Header />
      
      <Breadcrumbs items={[
        { label: 'Transparência', href: '/transparencia' },
        { label: 'Folha de Pagamento' }
      ]} />

      <TransparenciaLayout
        title="Folha de Pagamento"
        description="Documentos mensais da folha de pagamento dos servidores municipais"
      >
        {/* Filtros */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Ano de Referência
                </label>
                <Select value={anoFiltro} onValueChange={setAnoFiltro}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os anos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os anos</SelectItem>
                    {anos.map((ano) => (
                      <SelectItem key={ano} value={ano.toString()}>
                        {ano}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Documentos */}
        {isLoading ? (
          <div className="grid gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        ) : documentos && documentos.length > 0 ? (
          <div className="grid gap-4">
            {documentos.map((doc) => (
              <Card key={doc.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">
                            {mesesLabels[doc.mes_referencia]} / {doc.ano_referencia}
                          </h3>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            doc.categoria === 'educacao' 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                              : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                          }`}>
                            {categoriasLabels[doc.categoria as CategoriaFolha] || doc.categoria}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            Folha de Pagamento
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 md:flex-col">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(doc.arquivo_url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Visualizar
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleDownload(doc.arquivo_url, doc.arquivo_nome)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Baixar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Nenhum documento encontrado
              </h3>
              <p className="text-muted-foreground">
                {anoFiltro !== 'all'
                  ? `Não há documentos da folha de pagamento para o ano de ${anoFiltro}.`
                  : 'Não há documentos da folha de pagamento cadastrados.'}
              </p>
            </CardContent>
          </Card>
        )}
      </TransparenciaLayout>

      <Footer />
    </div>
  );
}
