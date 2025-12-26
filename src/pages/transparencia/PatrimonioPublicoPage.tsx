import { useEffect, useState } from 'react';
import { Building, Car, Package, Armchair, AlertCircle, Info, ExternalLink, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TransparenciaLayout } from '@/components/transparencia/TransparenciaLayout';
import { usePatrimonioPublico, TipoBemPublico, tipoBemPublicoLabels, situacaoBemLabels } from '@/hooks/usePatrimonioPublico';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ListPagination } from '@/components/ui/list-pagination';
import { usePagination } from '@/hooks/usePagination';

const tipoIcons: Record<TipoBemPublico, React.ReactNode> = {
  imovel: <Building className="w-5 h-5" />,
  veiculo: <Car className="w-5 h-5" />,
  equipamento: <Package className="w-5 h-5" />,
  mobiliario: <Armchair className="w-5 h-5" />,
  outros: <Package className="w-5 h-5" />,
};

const situacaoStyles: Record<string, string> = {
  bom: 'bg-green-100 text-green-800',
  regular: 'bg-yellow-100 text-yellow-800',
  ruim: 'bg-orange-100 text-orange-800',
  inservivel: 'bg-red-100 text-red-800',
  alienado: 'bg-gray-100 text-gray-800',
};

export default function PatrimonioPublicoPage() {
  const [tipoFilter, setTipoFilter] = useState<TipoBemPublico | 'all'>('all');
  const { data: patrimonio, isLoading } = usePatrimonioPublico(
    tipoFilter !== 'all' ? tipoFilter : undefined
  );

  // Filter items by type for tabs
  const imoveis = patrimonio?.filter(p => p.tipo === 'imovel') || [];
  const veiculos = patrimonio?.filter(p => p.tipo === 'veiculo') || [];
  const outros = patrimonio?.filter(p => !['imovel', 'veiculo'].includes(p.tipo)) || [];

  // Pagination for each tab
  const paginationImoveis = usePagination(imoveis, { initialItemsPerPage: 10 });
  const paginationVeiculos = usePagination(veiculos, { initialItemsPerPage: 10 });
  const paginationOutros = usePagination(outros, { initialItemsPerPage: 10 });

  // Reset pagination when filter changes
  useEffect(() => {
    paginationImoveis.setCurrentPage(1);
    paginationVeiculos.setCurrentPage(1);
    paginationOutros.setCurrentPage(1);
  }, [tipoFilter]);

  useEffect(() => {
    document.title = 'Patrimônio Público | Portal da Transparência - Ipubi';
  }, []);

  const formatCurrency = (value: number | null | undefined) => {
    if (!value) return '-';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
  };

  // Count by type
  const countByType = patrimonio?.reduce(
    (acc, item) => {
      acc[item.tipo] = (acc[item.tipo] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  ) || {};

  // Total value
  const totalValor = patrimonio?.reduce((acc, item) => acc + (item.valor_atual || item.valor_aquisicao || 0), 0) || 0;


  return (
    <TransparenciaLayout
      title="Patrimônio Público"
      description="Relação de bens públicos do Município de Ipubi"
    >
      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Sobre esta seção</p>
            <p>
              Esta página apresenta a relação dos principais bens públicos do Município, incluindo 
              imóveis, veículos e equipamentos relevantes, conforme determina a Lei de Acesso à Informação.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {Object.entries(tipoBemPublicoLabels).map(([tipo, label]) => (
          <Card 
            key={tipo}
            className={`cursor-pointer transition-all ${tipoFilter === tipo ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setTipoFilter(tipo as TipoBemPublico)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-muted-foreground">
                  {tipoIcons[tipo as TipoBemPublico]}
                </div>
                <span className="text-sm text-muted-foreground">{label}</span>
              </div>
              {isLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <p className="text-2xl font-bold">{countByType[tipo] || 0}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Total Value Card */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <span className="font-medium">Valor Total do Patrimônio</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-40" />
            ) : (
              <p className="text-2xl font-bold text-primary">{formatCurrency(totalValor)}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filter */}
      <div className="flex items-center gap-4 mb-6">
        <Select value={tipoFilter} onValueChange={(v) => setTipoFilter(v as TipoBemPublico | 'all')}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            {Object.entries(tipoBemPublicoLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {tipoFilter !== 'all' && (
          <button 
            onClick={() => setTipoFilter('all')}
            className="text-sm text-primary hover:underline"
          >
            Limpar filtro
          </button>
        )}
      </div>

      {/* Content Tabs */}
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
      ) : patrimonio && patrimonio.length > 0 ? (
        <Tabs defaultValue="imoveis" className="space-y-4">
          <TabsList>
            <TabsTrigger value="imoveis">
              <Building className="w-4 h-4 mr-2" />
              Imóveis ({imoveis.length})
            </TabsTrigger>
            <TabsTrigger value="veiculos">
              <Car className="w-4 h-4 mr-2" />
              Veículos ({veiculos.length})
            </TabsTrigger>
            <TabsTrigger value="outros">
              <Package className="w-4 h-4 mr-2" />
              Outros ({outros.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="imoveis">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bens Imóveis</CardTitle>
                <CardDescription>Relação de imóveis pertencentes ao Município</CardDescription>
              </CardHeader>
              <CardContent>
                {imoveis.length > 0 ? (
                  <>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Descrição</TableHead>
                            <TableHead>Endereço</TableHead>
                            <TableHead>Área (m²)</TableHead>
                            <TableHead>Situação</TableHead>
                            <TableHead className="text-right">Valor</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginationImoveis.paginatedItems.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.descricao}</TableCell>
                              <TableCell>{item.endereco || '-'}</TableCell>
                              <TableCell>{item.area_m2?.toLocaleString('pt-BR') || '-'}</TableCell>
                              <TableCell>
                                <Badge className={`${situacaoStyles[item.situacao || 'bom']} border-0`}>
                                  {situacaoBemLabels[item.situacao || 'bom']}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(item.valor_atual || item.valor_aquisicao)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <ListPagination
                      currentPage={paginationImoveis.currentPage}
                      totalPages={paginationImoveis.totalPages}
                      totalItems={paginationImoveis.totalItems}
                      startIndex={paginationImoveis.startIndex}
                      endIndex={paginationImoveis.endIndex}
                      itemsPerPage={paginationImoveis.itemsPerPage}
                      onPageChange={paginationImoveis.setCurrentPage}
                      onItemsPerPageChange={paginationImoveis.setItemsPerPage}
                      isFirstPage={paginationImoveis.isFirstPage}
                      isLastPage={paginationImoveis.isLastPage}
                      itemLabel="imóvel"
                      isTransitioning={paginationImoveis.isTransitioning}
                    />
                  </>
                ) : (
                  <p className="text-center text-muted-foreground py-8">Nenhum imóvel cadastrado.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="veiculos">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Frota de Veículos</CardTitle>
                <CardDescription>Relação de veículos pertencentes ao Município</CardDescription>
              </CardHeader>
              <CardContent>
                {veiculos.length > 0 ? (
                  <>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Descrição</TableHead>
                            <TableHead>Marca/Modelo</TableHead>
                            <TableHead>Placa</TableHead>
                            <TableHead>Ano</TableHead>
                            <TableHead>Situação</TableHead>
                            <TableHead>Secretaria</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginationVeiculos.paginatedItems.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.descricao}</TableCell>
                              <TableCell>{item.marca_modelo || '-'}</TableCell>
                              <TableCell>{item.placa || '-'}</TableCell>
                              <TableCell>{item.ano_fabricacao || '-'}</TableCell>
                              <TableCell>
                                <Badge className={`${situacaoStyles[item.situacao || 'bom']} border-0`}>
                                  {situacaoBemLabels[item.situacao || 'bom']}
                                </Badge>
                              </TableCell>
                              <TableCell>{item.secretaria_responsavel || '-'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <ListPagination
                      currentPage={paginationVeiculos.currentPage}
                      totalPages={paginationVeiculos.totalPages}
                      totalItems={paginationVeiculos.totalItems}
                      startIndex={paginationVeiculos.startIndex}
                      endIndex={paginationVeiculos.endIndex}
                      itemsPerPage={paginationVeiculos.itemsPerPage}
                      onPageChange={paginationVeiculos.setCurrentPage}
                      onItemsPerPageChange={paginationVeiculos.setItemsPerPage}
                      isFirstPage={paginationVeiculos.isFirstPage}
                      isLastPage={paginationVeiculos.isLastPage}
                      itemLabel="veículo"
                      isTransitioning={paginationVeiculos.isTransitioning}
                    />
                  </>
                ) : (
                  <p className="text-center text-muted-foreground py-8">Nenhum veículo cadastrado.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="outros">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Outros Bens</CardTitle>
                <CardDescription>Equipamentos, mobiliário e outros bens relevantes</CardDescription>
              </CardHeader>
              <CardContent>
                {outros.length > 0 ? (
                  <>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Descrição</TableHead>
                            <TableHead>Nº Patrimônio</TableHead>
                            <TableHead>Situação</TableHead>
                            <TableHead>Localização</TableHead>
                            <TableHead className="text-right">Valor</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginationOutros.paginatedItems.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>
                                <Badge variant="outline">{tipoBemPublicoLabels[item.tipo]}</Badge>
                              </TableCell>
                              <TableCell className="font-medium">{item.descricao}</TableCell>
                              <TableCell>{item.numero_patrimonio || '-'}</TableCell>
                              <TableCell>
                                <Badge className={`${situacaoStyles[item.situacao || 'bom']} border-0`}>
                                  {situacaoBemLabels[item.situacao || 'bom']}
                                </Badge>
                              </TableCell>
                              <TableCell>{item.localizacao_atual || '-'}</TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(item.valor_atual || item.valor_aquisicao)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <ListPagination
                      currentPage={paginationOutros.currentPage}
                      totalPages={paginationOutros.totalPages}
                      totalItems={paginationOutros.totalItems}
                      startIndex={paginationOutros.startIndex}
                      endIndex={paginationOutros.endIndex}
                      itemsPerPage={paginationOutros.itemsPerPage}
                      onPageChange={paginationOutros.setCurrentPage}
                      onItemsPerPageChange={paginationOutros.setItemsPerPage}
                      isFirstPage={paginationOutros.isFirstPage}
                      isLastPage={paginationOutros.isLastPage}
                      itemLabel="bem"
                      isTransitioning={paginationOutros.isTransitioning}
                    />
                  </>
                ) : (
                  <p className="text-center text-muted-foreground py-8">Nenhum bem cadastrado.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Nenhum bem encontrado com os filtros selecionados.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Legal Info */}
      <div className="mt-8 p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Base Legal:</strong> As informações sobre patrimônio público são disponibilizadas 
          em cumprimento à Lei de Acesso à Informação (Lei nº 12.527/2011) e aos critérios de 
          auditoria do Tribunal de Contas do Estado de Pernambuco (TCE-PE).
        </p>
      </div>
    </TransparenciaLayout>
  );
}
