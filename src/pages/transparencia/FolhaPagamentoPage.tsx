import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { TopBar } from '@/components/portal/TopBar';
import { AccessibilityBar } from '@/components/portal/AccessibilityBar';
import { Header } from '@/components/portal/Header';
import { Breadcrumbs } from '@/components/portal/Breadcrumbs';
import { Footer } from '@/components/portal/Footer';
import { TransparenciaLayout } from '@/components/transparencia/TransparenciaLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Search, DollarSign, Building2 } from 'lucide-react';
import { useFolhaPagamento, mesesLabels, vinculoLabels } from '@/hooks/useFolhaPagamento';
import { ExportListButtons } from '@/components/portal/ExportListButtons';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

export default function FolhaPagamentoPage() {
  const [ano, setAno] = useState<number>(currentYear);
  const [mes, setMes] = useState<number>(new Date().getMonth() + 1);
  const [busca, setBusca] = useState('');

  const { data: servidores, isLoading } = useFolhaPagamento(ano, mes);

  const servidoresFiltrados = servidores?.filter(s => 
    s.nome_servidor.toLowerCase().includes(busca.toLowerCase()) ||
    s.cargo.toLowerCase().includes(busca.toLowerCase()) ||
    s.secretaria?.toLowerCase().includes(busca.toLowerCase())
  ) || [];

  const formatCurrency = (value: number | null) => {
    if (!value) return 'R$ 0,00';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const totalBruto = servidoresFiltrados.reduce((acc, s) => acc + (s.total_bruto || 0), 0);
  const totalLiquido = servidoresFiltrados.reduce((acc, s) => acc + (s.salario_liquido || 0), 0);

  const exportColumns = [
    { key: 'nome_servidor', label: 'Nome' },
    { key: 'matricula', label: 'Matrícula' },
    { key: 'cargo', label: 'Cargo' },
    { key: 'secretaria', label: 'Secretaria' },
    { key: 'vinculo', label: 'Vínculo' },
    { key: 'salario_base', label: 'Salário Base' },
    { key: 'total_bruto', label: 'Total Bruto' },
    { key: 'total_descontos', label: 'Descontos' },
    { key: 'salario_liquido', label: 'Salário Líquido' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Folha de Pagamento - Portal da Transparência - Prefeitura de Ipubi</title>
        <meta name="description" content="Consulte a folha de pagamento dos servidores públicos municipais de Ipubi. Transparência na gestão de pessoal." />
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
        description="Consulte a remuneração dos servidores públicos municipais"
      >
        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Search className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Ano</label>
                <Select value={ano.toString()} onValueChange={(v) => setAno(parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(y => (
                      <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Mês</label>
                <Select value={mes.toString()} onValueChange={(v) => setMes(parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(mesesLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-2 block">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Nome, cargo ou secretaria..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total de Servidores</p>
                  <p className="text-2xl font-bold">{servidoresFiltrados.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-green-500/10">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Bruto</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalBruto)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-blue-500/10">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Líquido</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalLiquido)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">
              Servidores - {mesesLabels[mes]}/{ano}
            </CardTitle>
            <ExportListButtons
              data={servidoresFiltrados as unknown as Record<string, unknown>[]}
              columns={exportColumns}
              filename={`folha-pagamento-${mes}-${ano}`}
            />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : servidoresFiltrados.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum registro encontrado para o período selecionado.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Servidor</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead>Secretaria</TableHead>
                      <TableHead>Vínculo</TableHead>
                      <TableHead className="text-right">Salário Base</TableHead>
                      <TableHead className="text-right">Total Bruto</TableHead>
                      <TableHead className="text-right">Descontos</TableHead>
                      <TableHead className="text-right">Líquido</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {servidoresFiltrados.map((servidor) => (
                      <TableRow key={servidor.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{servidor.nome_servidor}</p>
                            {servidor.matricula && (
                              <p className="text-xs text-muted-foreground">Mat: {servidor.matricula}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{servidor.cargo}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            {servidor.secretaria || '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {vinculoLabels[servidor.vinculo || 'efetivo'] || servidor.vinculo}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(servidor.salario_base)}</TableCell>
                        <TableCell className="text-right font-medium text-green-600">
                          {formatCurrency(servidor.total_bruto)}
                        </TableCell>
                        <TableCell className="text-right text-red-600">
                          {formatCurrency(servidor.total_descontos)}
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {formatCurrency(servidor.salario_liquido)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </TransparenciaLayout>

      <Footer />
    </div>
  );
}
