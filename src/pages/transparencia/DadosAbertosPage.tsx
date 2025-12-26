import { useEffect, useState } from 'react';
import { Download, Database, FileSpreadsheet, FileText, AlertCircle, Info, ExternalLink, Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TransparenciaLayout } from '@/components/transparencia/TransparenciaLayout';
import { useDadosAbertos, CategoriaDadosAbertos, categoriaDadosAbertosLabels, formatoArquivoLabels } from '@/hooks/useDadosAbertos';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ListPagination } from '@/components/ui/list-pagination';
import { usePagination } from '@/hooks/usePagination';

const formatoIcons: Record<string, React.ReactNode> = {
  csv: <FileSpreadsheet className="w-5 h-5 text-green-600" />,
  xls: <FileSpreadsheet className="w-5 h-5 text-green-600" />,
  xlsx: <FileSpreadsheet className="w-5 h-5 text-green-600" />,
  pdf: <FileText className="w-5 h-5 text-red-600" />,
  json: <Database className="w-5 h-5 text-blue-600" />,
  xml: <Database className="w-5 h-5 text-orange-600" />,
  outros: <FileText className="w-5 h-5 text-gray-600" />,
};

const categoriaColors: Record<CategoriaDadosAbertos, string> = {
  receitas: 'bg-green-100 text-green-800 border-green-200',
  despesas: 'bg-red-100 text-red-800 border-red-200',
  licitacoes: 'bg-blue-100 text-blue-800 border-blue-200',
  contratos: 'bg-purple-100 text-purple-800 border-purple-200',
  servidores: 'bg-amber-100 text-amber-800 border-amber-200',
  obras: 'bg-orange-100 text-orange-800 border-orange-200',
  patrimonio: 'bg-teal-100 text-teal-800 border-teal-200',
  outros: 'bg-gray-100 text-gray-800 border-gray-200',
};

export default function DadosAbertosPage() {
  const [categoriaFilter, setCategoriaFilter] = useState<CategoriaDadosAbertos | 'all'>('all');
  const { data: dados, isLoading } = useDadosAbertos(
    categoriaFilter !== 'all' ? categoriaFilter : undefined
  );

  const pagination = usePagination(dados, { initialItemsPerPage: 10 });

  // Reset pagination when filter changes
  useEffect(() => {
    pagination.setCurrentPage(1);
  }, [categoriaFilter]);

  useEffect(() => {
    document.title = 'Dados Abertos | Portal da Transparência - Ipubi';
  }, []);

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Group by category
  const dataByCategory = dados?.reduce(
    (acc, item) => {
      if (!acc[item.categoria]) {
        acc[item.categoria] = [];
      }
      acc[item.categoria].push(item);
      return acc;
    },
    {} as Record<string, typeof dados>
  ) || {};

  // Count by category
  const countByCategory = Object.entries(dataByCategory).reduce(
    (acc, [cat, items]) => {
      acc[cat] = items?.length || 0;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <TransparenciaLayout
      title="Dados Abertos"
      description="Arquivos em formatos reutilizáveis para download e análise"
    >
      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">O que são Dados Abertos?</p>
            <p>
              Dados abertos são informações públicas disponibilizadas em formatos que permitem sua 
              reutilização, republicação e redistribuição por qualquer pessoa. Estes dados podem ser 
              utilizados para análises, pesquisas, desenvolvimento de aplicações e controle social.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Object.entries(categoriaDadosAbertosLabels).slice(0, 4).map(([categoria, label]) => (
          <Card 
            key={categoria}
            className={`cursor-pointer transition-all ${categoriaFilter === categoria ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setCategoriaFilter(categoria as CategoriaDadosAbertos)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{label}</span>
              </div>
              {isLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <p className="text-2xl font-bold">{countByCategory[categoria] || 0}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4 mb-6">
        <Select value={categoriaFilter} onValueChange={(v) => setCategoriaFilter(v as CategoriaDadosAbertos | 'all')}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {Object.entries(categoriaDadosAbertosLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {categoriaFilter !== 'all' && (
          <button 
            onClick={() => setCategoriaFilter('all')}
            className="text-sm text-primary hover:underline"
          >
            Limpar filtro
          </button>
        )}
      </div>

      {/* Data Files */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : dados && dados.length > 0 ? (
        <>
          <div className="space-y-6">
            {Object.entries(dataByCategory).map(([categoria, items]) => (
              <Card key={categoria}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Badge className={`${categoriaColors[categoria as CategoriaDadosAbertos]} border`}>
                      {categoriaDadosAbertosLabels[categoria as CategoriaDadosAbertos]}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {items?.length} arquivo(s)
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {items?.map((item) => (
                      <div 
                        key={item.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          {formatoIcons[item.formato]}
                          <div>
                            <p className="font-medium">{item.titulo}</p>
                            {item.descricao && (
                              <p className="text-sm text-muted-foreground">{item.descricao}</p>
                            )}
                            <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Atualizado: {formatDate(item.ultima_atualizacao)}
                              </span>
                              {item.periodicidade && (
                                <span>Periodicidade: {item.periodicidade}</span>
                              )}
                              {item.tamanho_bytes && (
                                <span>{formatFileSize(item.tamanho_bytes)}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {formatoArquivoLabels[item.formato]}
                          </Badge>
                          <Button asChild size="sm">
                            <a href={item.arquivo_url} download={item.arquivo_nome}>
                              <Download className="w-4 h-4 mr-2" />
                              Baixar
                            </a>
                          </Button>
                          {item.link_sistema_origem && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={item.link_sistema_origem} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <ListPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            startIndex={pagination.startIndex}
            endIndex={pagination.endIndex}
            itemsPerPage={pagination.itemsPerPage}
            onPageChange={pagination.setCurrentPage}
            onItemsPerPageChange={pagination.setItemsPerPage}
            isFirstPage={pagination.isFirstPage}
            isLastPage={pagination.isLastPage}
            itemLabel="arquivo"
          />
        </>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Nenhum arquivo de dados abertos disponível no momento.
            </p>
          </CardContent>
        </Card>
      )}

      {/* License Info */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">Termos de Uso</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            Os dados disponibilizados nesta seção são de uso público e podem ser livremente 
            reutilizados, desde que citada a fonte (Prefeitura Municipal de Ipubi - PE).
          </p>
          <p>
            Ao utilizar estes dados, você concorda que o Município não se responsabiliza por 
            interpretações, análises ou conclusões derivadas do uso destas informações.
          </p>
        </CardContent>
      </Card>

      {/* Legal Info */}
      <div className="mt-8 p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Base Legal:</strong> A disponibilização de dados abertos está em conformidade com 
          a Lei de Acesso à Informação (Lei nº 12.527/2011, art. 8º, §3º), o Decreto nº 8.777/2016 
          (Política de Dados Abertos) e as diretrizes do Portal Brasileiro de Dados Abertos.
        </p>
      </div>
    </TransparenciaLayout>
  );
}
