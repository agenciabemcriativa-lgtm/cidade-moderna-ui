import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building, MapPin, DollarSign, Calendar, ExternalLink, Clock, AlertCircle, CheckCircle2, PauseCircle, ClipboardList } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TransparenciaLayout } from '@/components/transparencia/TransparenciaLayout';
import { useObrasPublicas, StatusObra, statusObraLabels, fonteRecursoLabels } from '@/hooks/useObrasPublicas';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ListPagination } from '@/components/ui/list-pagination';
import { usePagination } from '@/hooks/usePagination';
import { ExportListButtons } from '@/components/portal/ExportListButtons';

const statusStyles: Record<StatusObra, { bg: string; text: string; icon: React.ReactNode }> = {
  em_andamento: { bg: 'bg-blue-100', text: 'text-blue-800', icon: <Clock className="w-4 h-4" /> },
  concluida: { bg: 'bg-green-100', text: 'text-green-800', icon: <CheckCircle2 className="w-4 h-4" /> },
  paralisada: { bg: 'bg-red-100', text: 'text-red-800', icon: <PauseCircle className="w-4 h-4" /> },
  planejada: { bg: 'bg-amber-100', text: 'text-amber-800', icon: <ClipboardList className="w-4 h-4" /> },
};

export default function ObrasPublicasPage() {
  const [statusFilter, setStatusFilter] = useState<StatusObra | 'all'>('all');
  const { data: obras, isLoading } = useObrasPublicas(
    statusFilter !== 'all' ? statusFilter : undefined
  );

  const pagination = usePagination(obras, { initialItemsPerPage: 10 });

  // Reset to page 1 when filter changes
  useEffect(() => {
    pagination.setCurrentPage(1);
  }, [statusFilter]);

  useEffect(() => {
    document.title = 'Obras Públicas | Portal da Transparência - Ipubi';
  }, []);

  const formatCurrency = (value: number | null) => {
    if (!value) return '-';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const countByStatus = obras?.reduce(
    (acc, obra) => {
      const status = obra.status || 'em_andamento';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  ) || {};

  return (
    <TransparenciaLayout
      title="Obras Públicas"
      description="Acompanhe as obras em execução, concluídas e planejadas pelo Município de Ipubi"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Object.entries(statusObraLabels).map(([status, label]) => {
          const style = statusStyles[status as StatusObra];
          return (
            <Card 
              key={status} 
              className={`cursor-pointer transition-all ${statusFilter === status ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setStatusFilter(status as StatusObra)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-2 rounded-full ${style.bg} ${style.text}`}>
                    {style.icon}
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">{label}</span>
                </div>
                {isLoading ? (
                  <Skeleton className="h-8 w-12" />
                ) : (
                  <p className="text-2xl font-bold">{countByStatus[status] || 0}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filter */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusObra | 'all')}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as obras</SelectItem>
              {Object.entries(statusObraLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {statusFilter !== 'all' && (
            <button 
              onClick={() => setStatusFilter('all')}
              className="text-sm text-primary hover:underline"
            >
              Limpar filtro
            </button>
          )}
        </div>
        {obras && obras.length > 0 && (
          <ExportListButtons
            data={obras.map(o => ({
              titulo: o.titulo,
              objeto: o.objeto,
              status: statusObraLabels[o.status || 'em_andamento'],
              valor_contratado: formatCurrency(o.valor_contratado),
              empresa_executora: o.empresa_executora || '-',
              localizacao: o.localizacao || '-',
              percentual_execucao: o.percentual_execucao ? `${o.percentual_execucao}%` : '-',
            }))}
            filename="obras-publicas-ipubi"
            columns={[
              { key: 'titulo', label: 'Título' },
              { key: 'objeto', label: 'Objeto' },
              { key: 'status', label: 'Status' },
              { key: 'valor_contratado', label: 'Valor Contratado' },
              { key: 'empresa_executora', label: 'Empresa' },
              { key: 'localizacao', label: 'Localização' },
              { key: 'percentual_execucao', label: 'Execução' },
            ]}
          />
        )}
      </div>

      {/* Obras List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : obras && obras.length > 0 ? (
        <div className="space-y-4">
          {pagination.paginatedItems.map((obra) => {
            const style = statusStyles[obra.status || 'em_andamento'];
            return (
              <Card key={obra.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={`${style.bg} ${style.text} border-0`}>
                          {style.icon}
                          <span className="ml-1">{statusObraLabels[obra.status || 'em_andamento']}</span>
                        </Badge>
                        {obra.fonte_recurso && (
                          <Badge variant="outline">
                            {fonteRecursoLabels[obra.fonte_recurso]}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg">{obra.titulo}</CardTitle>
                      <CardDescription className="mt-1">{obra.objeto}</CardDescription>
                    </div>
                    {obra.foto_url && (
                      <img 
                        src={obra.foto_url} 
                        alt={obra.titulo}
                        className="w-32 h-24 object-cover rounded-lg"
                      />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    {obra.valor_contratado && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Valor Contratado</p>
                          <p className="font-medium">{formatCurrency(obra.valor_contratado)}</p>
                        </div>
                      </div>
                    )}
                    {obra.empresa_executora && (
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Empresa Executora</p>
                          <p className="font-medium text-sm">{obra.empresa_executora}</p>
                        </div>
                      </div>
                    )}
                    {obra.data_inicio && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Prazo de Execução</p>
                          <p className="font-medium text-sm">
                            {format(new Date(obra.data_inicio), 'dd/MM/yyyy', { locale: ptBR })}
                            {obra.data_previsao_termino && (
                              <> a {format(new Date(obra.data_previsao_termino), 'dd/MM/yyyy', { locale: ptBR })}</>
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                    {obra.localizacao && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Localização</p>
                          <p className="font-medium text-sm">{obra.localizacao}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {obra.percentual_execucao !== null && obra.percentual_execucao !== undefined && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Execução</span>
                        <span className="font-medium">{obra.percentual_execucao}%</span>
                      </div>
                      <Progress value={obra.percentual_execucao} className="h-2" />
                    </div>
                  )}

                  {obra.link_sistema_oficial && (
                    <a
                      href={obra.link_sistema_oficial}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Ver no sistema oficial
                    </a>
                  )}
                </CardContent>
              </Card>
            );
          })}
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
            itemLabel="obra"
            isTransitioning={pagination.isTransitioning}
          />
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Nenhuma obra encontrada com os filtros selecionados.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Legal Info */}
      <div className="mt-8 p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Base Legal:</strong> As informações sobre obras públicas são disponibilizadas em cumprimento 
          à Lei de Acesso à Informação (Lei nº 12.527/2011) e à Lei de Responsabilidade Fiscal (LC nº 101/2000).
        </p>
      </div>
    </TransparenciaLayout>
  );
}
