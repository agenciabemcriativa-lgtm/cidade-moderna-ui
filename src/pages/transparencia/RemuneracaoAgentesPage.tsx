import { useEffect, useState } from 'react';
import { User, DollarSign, Calendar, Building2, AlertCircle, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TransparenciaLayout } from '@/components/transparencia/TransparenciaLayout';
import { useRemuneracaoAgentes, CargoAgentePolitico, cargoAgentePoliticoLabels, mesesLabels } from '@/hooks/useRemuneracaoAgentes';
import { ListPagination } from '@/components/ui/list-pagination';
import { usePagination } from '@/hooks/usePagination';
import { ExportListButtons } from '@/components/portal/ExportListButtons';
import { LastUpdated } from '@/components/portal/LastUpdated';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

export default function RemuneracaoAgentesPage() {
  const [ano, setAno] = useState<string>(String(currentYear));
  const [mes, setMes] = useState<string>('all');
  
  const { data: agentes, isLoading } = useRemuneracaoAgentes(
    Number(ano),
    mes !== 'all' ? Number(mes) : undefined
  );

  const pagination = usePagination(agentes, { initialItemsPerPage: 10 });

  // Reset pagination when filters change
  useEffect(() => {
    pagination.setCurrentPage(1);
  }, [ano, mes]);

  useEffect(() => {
    document.title = 'Remuneração de Agentes Políticos | Portal da Transparência - Ipubi';
  }, []);

  const formatCurrency = (value: number | null | undefined) => {
    if (!value) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  // Group by cargo for summary
  const summaryByCargo = agentes?.reduce(
    (acc, agente) => {
      acc[agente.cargo] = (acc[agente.cargo] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  ) || {};

  return (
    <TransparenciaLayout
      title="Remuneração de Agentes Políticos"
      description="Subsídios mensais do Prefeito, Vice-Prefeito e Secretários Municipais"
    >
      {/* Last Updated */}
      {agentes && agentes.length > 0 && (
        <div className="mb-6">
          <LastUpdated 
            date={agentes.reduce((latest, a) => 
              a.updated_at && new Date(a.updated_at) > new Date(latest || 0) ? a.updated_at : latest, 
              agentes[0].updated_at
            )}
          />
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Sobre esta seção</p>
            <p>
              Esta página apresenta os subsídios dos agentes políticos do Poder Executivo Municipal, 
              conforme determina a Lei de Acesso à Informação (Lei nº 12.527/2011, art. 8º, §1º, III).
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Object.entries(cargoAgentePoliticoLabels).map(([cargo, label]) => (
          <Card key={cargo}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{label}</span>
              </div>
              {isLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <p className="text-2xl font-bold">{summaryByCargo[cargo] || 0}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <Select value={ano} onValueChange={setAno}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={String(year)}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={mes} onValueChange={setMes}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Mês" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os meses</SelectItem>
              {Object.entries(mesesLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {agentes && agentes.length > 0 && (
          <ExportListButtons
            data={agentes.map(a => ({
              nome: a.nome,
              cargo: a.cargo_descricao || cargoAgentePoliticoLabels[a.cargo],
              secretaria: a.secretaria || '-',
              mes_ano: `${mesesLabels[a.mes_referencia]}/${a.ano_referencia}`,
              subsidio_mensal: formatCurrency(a.subsidio_mensal),
              verba_representacao: formatCurrency(a.verba_representacao),
              outros_valores: formatCurrency(a.outros_valores),
              total_bruto: formatCurrency(a.total_bruto || (a.subsidio_mensal + (a.verba_representacao || 0) + (a.outros_valores || 0))),
            }))}
            filename={`remuneracao-agentes-${ano}`}
            columns={[
              { key: 'nome', label: 'Nome' },
              { key: 'cargo', label: 'Cargo' },
              { key: 'secretaria', label: 'Secretaria' },
              { key: 'mes_ano', label: 'Mês/Ano' },
              { key: 'subsidio_mensal', label: 'Subsídio Mensal' },
              { key: 'verba_representacao', label: 'Verba Repr.' },
              { key: 'outros_valores', label: 'Outros' },
              { key: 'total_bruto', label: 'Total Bruto' },
            ]}
          />
        )}
      </div>

      {/* Data Table */}
      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : agentes && agentes.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Detalhamento da Remuneração</CardTitle>
            <CardDescription>
              Referência: {mes !== 'all' ? mesesLabels[Number(mes)] : 'Todos os meses'} de {ano}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agente</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Mês/Ano</TableHead>
                    <TableHead className="text-right">Subsídio Mensal</TableHead>
                    <TableHead className="text-right">Verba de Repr.</TableHead>
                    <TableHead className="text-right">Outros</TableHead>
                    <TableHead className="text-right">Total Bruto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagination.paginatedItems.map((agente) => (
                    <TableRow key={agente.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={agente.foto_url || undefined} alt={agente.nome} />
                            <AvatarFallback>{getInitials(agente.nome)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{agente.nome}</p>
                            {agente.secretaria && (
                              <p className="text-xs text-muted-foreground">{agente.secretaria}</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {agente.cargo_descricao || cargoAgentePoliticoLabels[agente.cargo]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {mesesLabels[agente.mes_referencia]}/{agente.ano_referencia}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(agente.subsidio_mensal)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(agente.verba_representacao)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(agente.outros_valores)}
                      </TableCell>
                      <TableCell className="text-right font-bold text-primary">
                        {formatCurrency(agente.total_bruto || (agente.subsidio_mensal + (agente.verba_representacao || 0) + (agente.outros_valores || 0)))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
              itemLabel="agente"
              isTransitioning={pagination.isTransitioning}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Nenhum registro encontrado para o período selecionado.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Legal Info */}
      <div className="mt-8 p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Base Legal:</strong> As informações sobre remuneração de agentes políticos são disponibilizadas 
          em cumprimento à Lei de Acesso à Informação (Lei nº 12.527/2011, art. 8º, §1º, III) e à 
          Constituição Federal (art. 37, caput - princípio da publicidade).
        </p>
      </div>
    </TransparenciaLayout>
  );
}
