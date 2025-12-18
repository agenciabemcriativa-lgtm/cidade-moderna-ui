import { useState } from 'react';
import { AlertCircle, Download, FileText, Calendar, Filter } from 'lucide-react';
import { TransparenciaLayout } from '@/components/transparencia/TransparenciaLayout';
import { FilterBar, YearFilter, TypeFilter } from '@/components/transparencia/FilterBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  useRelatoriosFiscais,
  TipoRelatorioFiscal,
  tipoRelatorioLabels,
  bimestreLabels,
  quadrimestreLabels,
} from '@/hooks/useRelatoriosFiscais';

const relatoriosTipos = [
  { value: 'rreo', label: 'RREO - Relatório Resumido' },
  { value: 'rgf', label: 'RGF - Relatório de Gestão Fiscal' },
  { value: 'parecer_tce', label: 'Pareceres do TCE' },
  { value: 'prestacao_contas', label: 'Prestação de Contas' },
];

const currentYear = new Date().getFullYear();
const years = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3, currentYear - 4];

const tipoCardStyles: Record<TipoRelatorioFiscal, { bg: string; border: string; text: string; icon: string }> = {
  rreo: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', icon: 'text-blue-600' },
  rgf: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', icon: 'text-green-600' },
  parecer_tce: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', icon: 'text-orange-600' },
  prestacao_contas: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800', icon: 'text-purple-600' },
};

export default function RelatoriosPage() {
  const [search, setSearch] = useState('');
  const [ano, setAno] = useState<string>('all');
  const [tipo, setTipo] = useState<string>('all');

  const { data: relatorios, isLoading } = useRelatoriosFiscais(
    tipo !== 'all' ? (tipo as TipoRelatorioFiscal) : undefined,
    ano !== 'all' ? Number(ano) : undefined
  );

  const filteredRelatorios = relatorios?.filter((r) =>
    r.titulo.toLowerCase().includes(search.toLowerCase())
  );

  const clearFilters = () => {
    setSearch('');
    setAno('all');
    setTipo('all');
  };

  const getPeriodicidadeLabel = (relatorio: typeof relatorios extends (infer T)[] | undefined ? T : never) => {
    if (relatorio.tipo === 'rreo' && relatorio.bimestre) {
      return bimestreLabels[relatorio.bimestre];
    }
    if (relatorio.tipo === 'rgf' && relatorio.quadrimestre) {
      return quadrimestreLabels[relatorio.quadrimestre];
    }
    if (relatorio.exercicio) {
      return relatorio.exercicio;
    }
    return null;
  };

  // Group by type for summary cards
  const countByType = relatorios?.reduce(
    (acc, r) => {
      acc[r.tipo] = (acc[r.tipo] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  ) || {};

  return (
    <TransparenciaLayout 
      title="Relatórios Fiscais"
      description="RREO, RGF, Pareceres do TCE e Prestação de Contas"
    >
      {/* Cards de resumo por tipo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Object.entries(tipoRelatorioLabels).map(([key, label]) => {
          const tipoKey = key as TipoRelatorioFiscal;
          const styles = tipoCardStyles[tipoKey];
          const count = countByType[tipoKey] || 0;
          
          return (
            <Card 
              key={key}
              className={`${styles.bg} ${styles.border} hover:shadow-md transition-shadow cursor-pointer`}
              onClick={() => setTipo(key)}
            >
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm font-medium ${styles.text}`}>
                  {key.toUpperCase().replace('_', ' ')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-xs ${styles.icon}`}>{label}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {count} {count === 1 ? 'documento' : 'documentos'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Aviso sobre Lei de Responsabilidade Fiscal */}
      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Os relatórios fiscais são publicados em atendimento à Lei Complementar nº 101/2000 
          (Lei de Responsabilidade Fiscal) e à Lei nº 12.527/2011 (Lei de Acesso à Informação).
        </AlertDescription>
      </Alert>

      {/* Filtros */}
      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar relatório..."
        onClearFilters={clearFilters}
        showClearButton={search !== '' || ano !== 'all' || tipo !== 'all'}
      >
        <YearFilter value={ano} onChange={setAno} years={years} />
        <TypeFilter value={tipo} onChange={setTipo} options={relatoriosTipos} placeholder="Tipo" />
      </FilterBar>

      {/* Lista de Relatórios */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : filteredRelatorios?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <FileText className="w-12 h-12 mb-4 opacity-50" />
          <p>Nenhum relatório encontrado</p>
          {(search || ano !== 'all' || tipo !== 'all') && (
            <button
              onClick={clearFilters}
              className="mt-2 text-primary hover:underline text-sm"
            >
              Limpar filtros
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRelatorios?.map((relatorio) => {
            const styles = tipoCardStyles[relatorio.tipo];
            const periodo = getPeriodicidadeLabel(relatorio);
            
            return (
              <Card key={relatorio.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge 
                          variant="outline" 
                          className={`${styles.bg} ${styles.border} ${styles.text} text-xs`}
                        >
                          {tipoRelatorioLabels[relatorio.tipo]}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {relatorio.ano}
                        </Badge>
                        {periodo && (
                          <Badge variant="outline" className="text-xs">
                            {periodo}
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900">{relatorio.titulo}</h3>
                      {relatorio.descricao && (
                        <p className="text-sm text-gray-600 mt-1">{relatorio.descricao}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Publicado em {format(new Date(relatorio.data_publicacao), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </span>
                      </div>
                    </div>
                    <a
                      href={relatorio.arquivo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                    >
                      <Download className="w-4 h-4" />
                      Baixar PDF
                    </a>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Informações legais */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg text-sm text-gray-600">
        <h4 className="font-medium text-gray-900 mb-2">Base Legal</h4>
        <p className="mb-2">
          A publicação dos relatórios fiscais atende ao disposto na Lei Complementar nº 101/2000 
          (Lei de Responsabilidade Fiscal) que determina a elaboração e publicação:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li><strong>RREO</strong> - Bimestralmente, até 30 dias após o encerramento do bimestre</li>
          <li><strong>RGF</strong> - Quadrimestralmente, até 30 dias após o encerramento do quadrimestre</li>
          <li><strong>Pareceres do TCE</strong> - Após emissão pelo Tribunal de Contas do Estado</li>
          <li><strong>Prestação de Contas</strong> - Anualmente, conforme prazos legais</li>
        </ul>
      </div>
    </TransparenciaLayout>
  );
}
