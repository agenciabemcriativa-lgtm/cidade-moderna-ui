import { useEffect, useState } from 'react';
import { Plane, Calendar, DollarSign, User, MapPin, AlertCircle, Info, ExternalLink, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TransparenciaLayout } from '@/components/transparencia/TransparenciaLayout';
import { useDiariasPassagens, TipoDiariaPassagem, tipoDiariaPassagemLabels } from '@/hooks/useDiariasPassagens';
import { mesesLabels } from '@/hooks/useRemuneracaoAgentes';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ListPagination } from '@/components/ui/list-pagination';
import { usePagination } from '@/hooks/usePagination';
import { ExportListButtons } from '@/components/portal/ExportListButtons';
import { LastUpdated } from '@/components/portal/LastUpdated';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

const tipoStyles: Record<TipoDiariaPassagem, string> = {
  diaria: 'bg-blue-100 text-blue-800',
  passagem: 'bg-green-100 text-green-800',
  diaria_passagem: 'bg-purple-100 text-purple-800',
};

export default function DiariasPassagensPage() {
  const [ano, setAno] = useState<string>(String(currentYear));
  const [mes, setMes] = useState<string>('all');
  const [tipo, setTipo] = useState<TipoDiariaPassagem | 'all'>('all');
  
  const { data: diarias, isLoading } = useDiariasPassagens(
    Number(ano),
    mes !== 'all' ? Number(mes) : undefined,
    tipo !== 'all' ? tipo : undefined
  );

  const pagination = usePagination(diarias, { initialItemsPerPage: 10 });

  // Reset to page 1 when filters change
  useEffect(() => {
    pagination.setCurrentPage(1);
  }, [ano, mes, tipo]);

  useEffect(() => {
    document.title = 'Diárias e Passagens | Portal da Transparência - Ipubi';
  }, []);

  const formatCurrency = (value: number | null | undefined) => {
    if (!value) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (date: string) => {
    return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
  };

  // Summary totals
  const totalGeral = diarias?.reduce((acc, d) => acc + d.valor_total, 0) || 0;
  const totalDiarias = diarias?.filter(d => d.tipo === 'diaria' || d.tipo === 'diaria_passagem')
    .reduce((acc, d) => acc + d.valor_total, 0) || 0;
  const totalPassagens = diarias?.filter(d => d.tipo === 'passagem' || d.tipo === 'diaria_passagem')
    .reduce((acc, d) => acc + d.valor_total, 0) || 0;

  const clearFilters = () => {
    setAno(String(currentYear));
    setMes('all');
    setTipo('all');
  };

  return (
    <TransparenciaLayout
      title="Diárias e Passagens"
      description="Despesas com diárias e passagens de servidores e agentes públicos"
    >
      {/* Last Updated */}
      {diarias && diarias.length > 0 && (
        <div className="mb-6">
          <LastUpdated 
            date={diarias.reduce((latest, d) => 
              d.updated_at && new Date(d.updated_at) > new Date(latest || 0) ? d.updated_at : latest, 
              diarias[0].updated_at
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
              Esta página apresenta as despesas com diárias e passagens concedidas a servidores e agentes públicos
              para deslocamentos a serviço do Município.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Geral</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <p className="text-2xl font-bold text-primary">{formatCurrency(totalGeral)}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Plane className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-muted-foreground">Diárias</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <p className="text-2xl font-bold">{formatCurrency(totalDiarias)}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Plane className="w-4 h-4 text-green-600" />
              <span className="text-sm text-muted-foreground">Passagens</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <p className="text-2xl font-bold">{formatCurrency(totalPassagens)}</p>
            )}
          </CardContent>
        </Card>
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

          <Select value={tipo} onValueChange={(v) => setTipo(v as TipoDiariaPassagem | 'all')}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              {Object.entries(tipoDiariaPassagemLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <button 
            onClick={clearFilters}
            className="text-sm text-primary hover:underline"
          >
            Limpar filtros
          </button>
        </div>
        
        {diarias && diarias.length > 0 && (
          <ExportListButtons
            data={diarias.map(d => ({
              beneficiario: d.beneficiario_nome,
              cargo: d.beneficiario_cargo || '-',
              tipo: tipoDiariaPassagemLabels[d.tipo],
              destino: d.destino,
              finalidade: d.finalidade,
              data_inicio: formatDate(d.data_inicio),
              data_fim: formatDate(d.data_fim),
              valor_total: formatCurrency(d.valor_total),
            }))}
            filename={`diarias-passagens-${ano}`}
            columns={[
              { key: 'beneficiario', label: 'Beneficiário' },
              { key: 'cargo', label: 'Cargo' },
              { key: 'tipo', label: 'Tipo' },
              { key: 'destino', label: 'Destino' },
              { key: 'finalidade', label: 'Finalidade' },
              { key: 'data_inicio', label: 'Data Início' },
              { key: 'data_fim', label: 'Data Fim' },
              { key: 'valor_total', label: 'Valor Total' },
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
      ) : diarias && diarias.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Detalhamento das Despesas</CardTitle>
            <CardDescription>
              {diarias.length} registro(s) encontrado(s) • 
              Referência: {mes !== 'all' ? mesesLabels[Number(mes)] : 'Todos os meses'} de {ano}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Beneficiário</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Destino</TableHead>
                    <TableHead>Finalidade</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead className="text-right">Valor Total</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagination.paginatedItems.map((diaria) => (
                    <TableRow key={diaria.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{diaria.beneficiario_nome}</p>
                          {diaria.beneficiario_cargo && (
                            <p className="text-xs text-muted-foreground">{diaria.beneficiario_cargo}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${tipoStyles[diaria.tipo]} border-0`}>
                          {tipoDiariaPassagemLabels[diaria.tipo]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          {diaria.destino}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <p className="text-sm truncate" title={diaria.finalidade}>
                          {diaria.finalidade}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{formatDate(diaria.data_inicio)}</p>
                          <p className="text-muted-foreground">a {formatDate(diaria.data_fim)}</p>
                          {diaria.quantidade_dias && (
                            <p className="text-xs text-muted-foreground">({diaria.quantidade_dias} dia(s))</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {formatCurrency(diaria.valor_total)}
                      </TableCell>
                      <TableCell>
                        {diaria.link_sistema_oficial && (
                          <a
                            href={diaria.link_sistema_oficial}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
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
              itemLabel="registro"
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
          <strong>Base Legal:</strong> As informações sobre diárias e passagens são disponibilizadas 
          em cumprimento à Lei de Acesso à Informação (Lei nº 12.527/2011) e aos critérios de 
          auditoria do Tribunal de Contas do Estado de Pernambuco (TCE-PE).
        </p>
      </div>
    </TransparenciaLayout>
  );
}
