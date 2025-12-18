import { useState } from 'react';
import { ExternalLink, AlertCircle, Handshake } from 'lucide-react';
import { TransparenciaLayout } from '@/components/transparencia/TransparenciaLayout';
import { DataTable, ExternalLinkButton, Column } from '@/components/transparencia/DataTable';
import { FilterBar, YearFilter, TypeFilter } from '@/components/transparencia/FilterBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ConvenioItem {
  id: string;
  numero: string;
  objeto: string;
  concedente: string;
  valor: number;
  vigencia: string;
  status: 'vigente' | 'encerrado' | 'em_execucao';
  link: string;
}

const conveniosTipos = [
  { value: 'convenio', label: 'Convênio' },
  { value: 'termo_colaboracao', label: 'Termo de Colaboração' },
  { value: 'termo_fomento', label: 'Termo de Fomento' },
  { value: 'acordo_cooperacao', label: 'Acordo de Cooperação' },
];

const statusOptions = [
  { value: 'vigente', label: 'Vigente' },
  { value: 'em_execucao', label: 'Em Execução' },
  { value: 'encerrado', label: 'Encerrado' },
];

const currentYear = new Date().getFullYear();
const years = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3, currentYear - 4];

// Dados simulados
const conveniosData: ConvenioItem[] = [];

export default function ConveniosPage() {
  const [search, setSearch] = useState('');
  const [ano, setAno] = useState<string>('all');
  const [tipo, setTipo] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');

  const getStatusBadge = (status: string) => {
    const styles = {
      vigente: 'bg-green-100 text-green-800',
      em_execucao: 'bg-blue-100 text-blue-800',
      encerrado: 'bg-gray-100 text-gray-800',
    };
    const labels = {
      vigente: 'Vigente',
      em_execucao: 'Em Execução',
      encerrado: 'Encerrado',
    };
    return (
      <Badge className={styles[status as keyof typeof styles] || 'bg-gray-100'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const columns: Column<ConvenioItem>[] = [
    { key: 'numero', label: 'Número' },
    { key: 'objeto', label: 'Objeto', className: 'max-w-xs' },
    { key: 'concedente', label: 'Concedente' },
    { 
      key: 'valor', 
      label: 'Valor',
      render: (item) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor)
    },
    { key: 'vigencia', label: 'Vigência' },
    { 
      key: 'status', 
      label: 'Status',
      render: (item) => getStatusBadge(item.status)
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
    setTipo('all');
    setStatus('all');
  };

  return (
    <TransparenciaLayout 
      title="Convênios e Parcerias"
      description="Consulte os convênios, termos de colaboração e parcerias firmadas pelo município"
    >
      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-teal-50 border-teal-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-teal-800">Convênios Vigentes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-teal-900">-</p>
            <p className="text-xs text-teal-600 mt-1">
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
            <CardTitle className="text-sm font-medium text-blue-800">Em Execução</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-900">-</p>
            <p className="text-xs text-blue-600 mt-1">Parcerias ativas</p>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Valor Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-900">-</p>
            <p className="text-xs text-green-600 mt-1">Recursos conveniados</p>
          </CardContent>
        </Card>
      </div>

      {/* Aviso sobre sistema oficial */}
      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Os dados detalhados de convênios e parcerias estão disponíveis no sistema oficial de transparência. 
          Clique no botão abaixo para acessar informações completas sobre repasses e prestações de contas.
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
            <Handshake className="w-5 h-5 mr-2" />
            Acessar Sistema de Convênios
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </a>
      </div>

      {/* Filtros */}
      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por número, objeto ou concedente..."
        onClearFilters={clearFilters}
        showClearButton={search !== '' || ano !== 'all' || tipo !== 'all' || status !== 'all'}
      >
        <YearFilter value={ano} onChange={setAno} years={years} />
        <TypeFilter value={tipo} onChange={setTipo} options={conveniosTipos} placeholder="Tipo" />
        <TypeFilter value={status} onChange={setStatus} options={statusOptions} placeholder="Status" />
      </FilterBar>

      {/* Tabela */}
      <DataTable
        columns={columns}
        data={conveniosData}
        keyExtractor={(item) => item.id}
        emptyMessage="Os dados de convênios estão disponíveis no sistema oficial de transparência. Clique no botão acima para acessar."
      />

      {/* Informações legais */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg text-sm text-gray-600">
        <h4 className="font-medium text-gray-900 mb-2">Base Legal</h4>
        <p>
          A publicação de convênios e parcerias atende ao disposto na Lei nº 13.019/2014 (Marco Regulatório 
          das Organizações da Sociedade Civil) e Lei nº 12.527/2011, garantindo transparência nas parcerias 
          com o poder público.
        </p>
      </div>
    </TransparenciaLayout>
  );
}
