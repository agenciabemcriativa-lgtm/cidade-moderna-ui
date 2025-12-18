import { useState } from 'react';
import { ExternalLink, AlertCircle, BarChart3, Download, FileText } from 'lucide-react';
import { TransparenciaLayout } from '@/components/transparencia/TransparenciaLayout';
import { DataTable, DownloadButton, Column } from '@/components/transparencia/DataTable';
import { FilterBar, YearFilter, TypeFilter } from '@/components/transparencia/FilterBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface RelatorioItem {
  id: string;
  tipo: string;
  periodo: string;
  ano: number;
  dataPublicacao: string;
  arquivo: string;
}

const relatoriosTipos = [
  { value: 'rreo', label: 'RREO - Relatório Resumido da Execução Orçamentária' },
  { value: 'rgf', label: 'RGF - Relatório de Gestão Fiscal' },
  { value: 'balanco', label: 'Balanço Anual' },
  { value: 'parecer_tce', label: 'Parecer do TCE' },
  { value: 'prestacao_contas', label: 'Prestação de Contas' },
];

const currentYear = new Date().getFullYear();
const years = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3, currentYear - 4];

// Dados simulados
const relatoriosData: RelatorioItem[] = [];

export default function RelatoriosPage() {
  const [search, setSearch] = useState('');
  const [ano, setAno] = useState<string>('all');
  const [tipo, setTipo] = useState<string>('all');

  const columns: Column<RelatorioItem>[] = [
    { key: 'tipo', label: 'Tipo' },
    { key: 'periodo', label: 'Período' },
    { key: 'ano', label: 'Ano' },
    { 
      key: 'dataPublicacao', 
      label: 'Data de Publicação',
      render: (item) => new Date(item.dataPublicacao).toLocaleDateString('pt-BR')
    },
    { 
      key: 'arquivo', 
      label: 'Download',
      render: (item) => <DownloadButton href={item.arquivo} label="Baixar PDF" />
    },
  ];

  const clearFilters = () => {
    setSearch('');
    setAno('all');
    setTipo('all');
  };

  return (
    <TransparenciaLayout 
      title="Relatórios Fiscais"
      description="RREO, RGF, balanços e pareceres do Tribunal de Contas"
    >
      {/* Cards com links diretos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <a 
          href="https://www.ipubi.pe.gov.br/portaldatransparencia/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Card className="bg-blue-50 border-blue-200 hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">RREO</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-blue-600">Relatório Resumido da Execução Orçamentária</p>
              <div className="flex items-center gap-1 mt-2 text-blue-700 text-xs">
                <ExternalLink className="w-3 h-3" />
                Acessar
              </div>
            </CardContent>
          </Card>
        </a>
        
        <a 
          href="https://www.ipubi.pe.gov.br/portaldatransparencia/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Card className="bg-green-50 border-green-200 hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-800">RGF</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-green-600">Relatório de Gestão Fiscal</p>
              <div className="flex items-center gap-1 mt-2 text-green-700 text-xs">
                <ExternalLink className="w-3 h-3" />
                Acessar
              </div>
            </CardContent>
          </Card>
        </a>
        
        <a 
          href="https://www.ipubi.pe.gov.br/portaldatransparencia/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Card className="bg-purple-50 border-purple-200 hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-800">Balanços</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-purple-600">Demonstrativos Contábeis Anuais</p>
              <div className="flex items-center gap-1 mt-2 text-purple-700 text-xs">
                <ExternalLink className="w-3 h-3" />
                Acessar
              </div>
            </CardContent>
          </Card>
        </a>
        
        <a 
          href="https://www.ipubi.pe.gov.br/portaldatransparencia/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Card className="bg-orange-50 border-orange-200 hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-800">Pareceres TCE</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-orange-600">Pareceres do Tribunal de Contas</p>
              <div className="flex items-center gap-1 mt-2 text-orange-700 text-xs">
                <ExternalLink className="w-3 h-3" />
                Acessar
              </div>
            </CardContent>
          </Card>
        </a>
      </div>

      {/* Aviso sobre sistema oficial */}
      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Os relatórios fiscais completos estão disponíveis no sistema oficial de transparência. 
          Acesse para visualizar RREO, RGF e demais demonstrativos exigidos pela Lei de Responsabilidade Fiscal.
        </AlertDescription>
      </Alert>

      {/* Botão de acesso ao sistema oficial */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <a
          href="https://www.ipubi.pe.gov.br/portaldatransparencia/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <Button className="w-full" size="lg">
            <BarChart3 className="w-5 h-5 mr-2" />
            Acessar Relatórios Fiscais
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </a>
      </div>

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

      {/* Tabela */}
      <DataTable
        columns={columns}
        data={relatoriosData}
        keyExtractor={(item) => item.id}
        emptyMessage="Os relatórios fiscais estão disponíveis no sistema oficial de transparência. Clique no botão acima para acessar."
      />

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
          <li><strong>Balanço Anual</strong> - Até 30 de junho do exercício seguinte</li>
        </ul>
      </div>
    </TransparenciaLayout>
  );
}
