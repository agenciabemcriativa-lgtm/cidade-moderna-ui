import { useState } from 'react';
import { ExternalLink, AlertCircle, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TransparenciaLayout } from '@/components/transparencia/TransparenciaLayout';
import { DataTable, ExternalLinkButton, Column } from '@/components/transparencia/DataTable';
import { FilterBar, TypeFilter } from '@/components/transparencia/FilterBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ServidorItem {
  id: string;
  nome: string;
  cargo: string;
  lotacao: string;
  vinculo: string;
  remuneracao: number;
  link: string;
}

const vinculosTipos = [
  { value: 'efetivo', label: 'Efetivo' },
  { value: 'comissionado', label: 'Comissionado' },
  { value: 'contratado', label: 'Contratado' },
  { value: 'temporario', label: 'Temporário' },
];

// Dados simulados
const servidoresData: ServidorItem[] = [];

export default function ServidoresPage() {
  const [search, setSearch] = useState('');
  const [vinculo, setVinculo] = useState<string>('all');
  const [lotacao, setLotacao] = useState<string>('all');

  const lotacoes = [
    { value: 'administracao', label: 'Secretaria de Administração' },
    { value: 'educacao', label: 'Secretaria de Educação' },
    { value: 'saude', label: 'Secretaria de Saúde' },
    { value: 'obras', label: 'Secretaria de Obras' },
    { value: 'assistencia', label: 'Secretaria de Assistência Social' },
  ];

  const columns: Column<ServidorItem>[] = [
    { key: 'nome', label: 'Nome' },
    { key: 'cargo', label: 'Cargo' },
    { key: 'lotacao', label: 'Lotação' },
    { key: 'vinculo', label: 'Vínculo' },
    { 
      key: 'remuneracao', 
      label: 'Remuneração',
      render: (item) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.remuneracao)
    },
    { 
      key: 'link', 
      label: 'Ações',
      render: (item) => <ExternalLinkButton href={item.link} label="Detalhes" />
    },
  ];

  const clearFilters = () => {
    setSearch('');
    setVinculo('all');
    setLotacao('all');
  };

  return (
    <TransparenciaLayout 
      title="Servidores e Pessoal"
      description="Consulte informações sobre servidores públicos municipais"
    >
      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Efetivos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-900">-</p>
            <p className="text-xs text-blue-600 mt-1">Servidores concursados</p>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Comissionados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-900">-</p>
            <p className="text-xs text-purple-600 mt-1">Cargos de confiança</p>
          </CardContent>
        </Card>
        
        <Card className="bg-orange-50 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Contratados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-900">-</p>
            <p className="text-xs text-orange-600 mt-1">Contratos temporários</p>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-900">-</p>
            <p className="text-xs text-green-600 mt-1">Servidores ativos</p>
          </CardContent>
        </Card>
      </div>

      {/* Links rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Link to="/governo/estrutura-organizacional">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Estrutura Organizacional</h3>
                <p className="text-sm text-gray-600">Veja a estrutura administrativa do município</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        
        <a 
          href="https://mdinfor.com.br/espelhorh/contracheque/index.php"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <ExternalLink className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Contracheque Online</h3>
                <p className="text-sm text-gray-600">Acesso ao sistema de contracheques</p>
              </div>
            </CardContent>
          </Card>
        </a>
      </div>

      {/* Aviso sobre sistema oficial */}
      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Os dados detalhados de servidores e folha de pagamento estão disponíveis no sistema oficial de transparência. 
          Clique no botão abaixo para acessar informações completas.
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
            <Users className="w-5 h-5 mr-2" />
            Acessar Folha de Pagamento
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </a>
      </div>

      {/* Filtros */}
      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por nome ou cargo..."
        onClearFilters={clearFilters}
        showClearButton={search !== '' || vinculo !== 'all' || lotacao !== 'all'}
      >
        <TypeFilter value={vinculo} onChange={setVinculo} options={vinculosTipos} placeholder="Vínculo" />
        <TypeFilter value={lotacao} onChange={setLotacao} options={lotacoes} placeholder="Lotação" />
      </FilterBar>

      {/* Tabela */}
      <DataTable
        columns={columns}
        data={servidoresData}
        keyExtractor={(item) => item.id}
        emptyMessage="Os dados de servidores estão disponíveis no sistema oficial de transparência. Clique no botão acima para acessar."
      />

      {/* Informações legais */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg text-sm text-gray-600">
        <h4 className="font-medium text-gray-900 mb-2">Base Legal</h4>
        <p>
          A divulgação da remuneração dos servidores públicos atende ao disposto na Lei nº 12.527/2011 (LAI), 
          garantindo o acesso à informação sobre gastos com pessoal, respeitando a privacidade dos dados sensíveis.
        </p>
      </div>
    </TransparenciaLayout>
  );
}
