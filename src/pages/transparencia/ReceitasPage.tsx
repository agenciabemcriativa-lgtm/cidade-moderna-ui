import { useState } from 'react';
import { ExternalLink, AlertCircle } from 'lucide-react';
import { TransparenciaLayout } from '@/components/transparencia/TransparenciaLayout';
import { DataTable, ExternalLinkButton, Column } from '@/components/transparencia/DataTable';
import { FilterBar, YearFilter, MonthFilter, TypeFilter } from '@/components/transparencia/FilterBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useReceitasCategorias } from '@/hooks/useReceitasCategorias';

interface ReceitaItem {
  id: string;
  tipo: string;
  descricao: string;
  valor: number;
  data: string;
  origem: string;
  link: string;
}

const receitasTipos = [
  { value: 'tributaria', label: 'Receita Tributária' },
  { value: 'transferencia', label: 'Transferências' },
  { value: 'patrimonial', label: 'Receita Patrimonial' },
  { value: 'servicos', label: 'Receita de Serviços' },
  { value: 'outras', label: 'Outras Receitas' },
];

const currentYear = new Date().getFullYear();
const years = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3, currentYear - 4];

// Dados simulados
const receitasData: ReceitaItem[] = [];

export default function ReceitasPage() {
  const { data: categorias, isLoading: loadingCategorias } = useReceitasCategorias();
  const [search, setSearch] = useState('');
  const [ano, setAno] = useState<string>('all');
  const [mes, setMes] = useState<string>('all');
  const [tipo, setTipo] = useState<string>('all');

  const columns: Column<ReceitaItem>[] = [
    { key: 'tipo', label: 'Tipo' },
    { key: 'descricao', label: 'Descrição', className: 'max-w-xs' },
    { key: 'origem', label: 'Origem' },
    { 
      key: 'valor', 
      label: 'Valor',
      render: (item) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor)
    },
    { 
      key: 'data', 
      label: 'Data',
      render: (item) => new Date(item.data).toLocaleDateString('pt-BR')
    },
    { 
      key: 'link', 
      label: 'Ações',
      render: (item) => <ExternalLinkButton href={item.link} label="Detalhes" />
    },
  ];

  const clearFilters = () => {
    setSearch('');
    setAno('all');
    setMes('all');
    setTipo('all');
  };

  return (
    <TransparenciaLayout 
      title="Receitas Públicas"
      description="Consulte a arrecadação municipal e transferências recebidas"
    >
      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Receitas Próprias</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-900">-</p>
            <p className="text-xs text-green-600 mt-1">
              <a 
                href="https://www.ipubi.pe.gov.br/portaldatransparencia/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline flex items-center gap-1"
              >
                Ver no sistema oficial <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Transferências</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-900">-</p>
            <p className="text-xs text-blue-600 mt-1">
              <a 
                href="https://www.ipubi.pe.gov.br/portaldatransparencia/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline flex items-center gap-1"
              >
                Ver no sistema oficial <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Outras Receitas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-900">-</p>
            <p className="text-xs text-purple-600 mt-1">
              <a 
                href="https://www.ipubi.pe.gov.br/portaldatransparencia/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline flex items-center gap-1"
              >
                Ver no sistema oficial <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Categorias de Receitas */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Categorias de Receitas</h3>
        <div className="flex flex-col gap-2">
          {loadingCategorias ? (
            <>
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </>
          ) : categorias && categorias.length > 0 ? (
            categorias.map((categoria) => (
              <a
                key={categoria.id}
                href={categoria.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-[#1e88c7] hover:bg-[#1976b0] text-white px-6 py-4 rounded transition-colors"
              >
                <span className="font-medium">{categoria.titulo}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">
              Nenhuma categoria disponível.
            </p>
          )}
        </div>
      </div>

      {/* Aviso sobre sistema oficial */}
      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Os dados detalhados de receitas públicas estão disponíveis no sistema oficial de transparência. 
          Clique nas categorias acima para acessar informações completas sobre arrecadação e transferências.
        </AlertDescription>
      </Alert>

      {/* Filtros */}
      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por descrição ou origem..."
        onClearFilters={clearFilters}
        showClearButton={search !== '' || ano !== 'all' || mes !== 'all' || tipo !== 'all'}
      >
        <YearFilter value={ano} onChange={setAno} years={years} />
        <MonthFilter value={mes} onChange={setMes} />
        <TypeFilter value={tipo} onChange={setTipo} options={receitasTipos} placeholder="Tipo" />
      </FilterBar>

      {/* Tabela */}
      <DataTable
        columns={columns}
        data={receitasData}
        keyExtractor={(item) => item.id}
        emptyMessage="Os dados de receitas estão disponíveis no sistema oficial de transparência. Clique no botão acima para acessar."
      />

      {/* Informações legais */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg text-sm text-gray-600">
        <h4 className="font-medium text-gray-900 mb-2">Base Legal</h4>
        <p>
          A divulgação das receitas públicas atende ao disposto na Lei Complementar nº 131/2009 e 
          Lei nº 12.527/2011, garantindo o acesso às informações sobre a arrecadação municipal.
        </p>
      </div>
    </TransparenciaLayout>
  );
}
