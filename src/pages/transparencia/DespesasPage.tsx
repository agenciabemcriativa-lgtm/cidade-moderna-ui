import { useState } from 'react';
import { ExternalLink, AlertCircle, DollarSign } from 'lucide-react';
import { TransparenciaLayout } from '@/components/transparencia/TransparenciaLayout';
import { DataTable, ExternalLinkButton, Column } from '@/components/transparencia/DataTable';
import { FilterBar, YearFilter, MonthFilter, TypeFilter } from '@/components/transparencia/FilterBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface DespesaItem {
  id: string;
  tipo: string;
  descricao: string;
  valor: number;
  data: string;
  favorecido: string;
  link: string;
}

const despesasTipos = [
  { value: 'empenho', label: 'Empenho' },
  { value: 'liquidacao', label: 'Liquidação' },
  { value: 'pagamento', label: 'Pagamento' },
];

const currentYear = new Date().getFullYear();
const years = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3, currentYear - 4];

// Dados simulados - em produção viriam do sistema oficial
const despesasData: DespesaItem[] = [];

export default function DespesasPage() {
  const [search, setSearch] = useState('');
  const [ano, setAno] = useState<string>('all');
  const [mes, setMes] = useState<string>('all');
  const [tipo, setTipo] = useState<string>('all');

  const columns: Column<DespesaItem>[] = [
    { key: 'tipo', label: 'Tipo' },
    { key: 'descricao', label: 'Descrição', className: 'max-w-xs' },
    { key: 'favorecido', label: 'Favorecido' },
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
      title="Despesas Públicas"
      description="Consulte os empenhos, liquidações e pagamentos realizados pelo município"
    >
      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-red-50 border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-800">Empenhos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-900">-</p>
            <p className="text-xs text-red-600 mt-1">
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
        
        <Card className="bg-orange-50 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Liquidações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-900">-</p>
            <p className="text-xs text-orange-600 mt-1">
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
        
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Pagamentos</CardTitle>
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
      </div>

      {/* Aviso sobre sistema oficial */}
      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Os dados detalhados de despesas públicas estão disponíveis no sistema oficial de transparência. 
          Clique no botão abaixo para acessar informações completas sobre empenhos, liquidações e pagamentos.
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
            <DollarSign className="w-5 h-5 mr-2" />
            Acessar Sistema de Despesas
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </a>
      </div>

      {/* Filtros */}
      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por descrição ou favorecido..."
        onClearFilters={clearFilters}
        showClearButton={search !== '' || ano !== 'all' || mes !== 'all' || tipo !== 'all'}
      >
        <YearFilter value={ano} onChange={setAno} years={years} />
        <MonthFilter value={mes} onChange={setMes} />
        <TypeFilter value={tipo} onChange={setTipo} options={despesasTipos} placeholder="Tipo" />
      </FilterBar>

      {/* Tabela */}
      <DataTable
        columns={columns}
        data={despesasData}
        keyExtractor={(item) => item.id}
        emptyMessage="Os dados de despesas estão disponíveis no sistema oficial de transparência. Clique no botão acima para acessar."
      />

      {/* Informações legais */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg text-sm text-gray-600">
        <h4 className="font-medium text-gray-900 mb-2">Base Legal</h4>
        <p>
          A publicação das despesas públicas atende ao disposto na Lei Complementar nº 131/2009 e 
          Lei nº 12.527/2011, que determinam a divulgação em tempo real de informações pormenorizadas 
          sobre a execução orçamentária e financeira.
        </p>
      </div>
    </TransparenciaLayout>
  );
}
