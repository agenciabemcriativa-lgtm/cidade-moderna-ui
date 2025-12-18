import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, Clock, CheckCircle, AlertTriangle, Users, TrendingUp, 
  Search, Filter, Download, Eye, MessageSquare, Calendar
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  useAllSolicitacoes, 
  useESicEstatisticas,
  statusLabels, 
  statusColors,
  type StatusESic
} from '@/hooks/useESic';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function AdminESic() {
  const [filters, setFilters] = useState<{
    status?: StatusESic;
    search?: string;
  }>({});

  const { data: solicitacoes, isLoading } = useAllSolicitacoes(filters);
  const { data: estatisticas, isLoading: loadingStats } = useESicEstatisticas();

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value || undefined }));
  };

  const handleStatusFilter = (value: string) => {
    setFilters(prev => ({ 
      ...prev, 
      status: value === 'todos' ? undefined : value as StatusESic 
    }));
  };

  const calcularDiasRestantes = (dataLimite: string, dataProrrogacao?: string) => {
    const limite = new Date(dataProrrogacao || dataLimite);
    const hoje = new Date();
    const diffTime = limite.getTime() - hoje.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">e-SIC - Gestão de Solicitações</h1>
            <p className="text-muted-foreground">
              Gerencie as solicitações de acesso à informação
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exportar Relatório
          </Button>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total de Solicitações</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingStats ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <span className="text-2xl font-bold">{estatisticas?.total || 0}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pendentes</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingStats ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-500" />
                  <span className="text-2xl font-bold">
                    {(estatisticas?.porStatus?.pendente || 0) + (estatisticas?.porStatus?.em_andamento || 0)}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Taxa de Resposta</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingStats ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span className="text-2xl font-bold">{estatisticas?.taxaResposta || 0}%</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className={estatisticas?.proximasDoPrazo ? 'border-orange-200' : ''}>
            <CardHeader className="pb-2">
              <CardDescription>Próximas do Prazo</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingStats ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`w-5 h-5 ${estatisticas?.proximasDoPrazo ? 'text-orange-500' : 'text-muted-foreground'}`} />
                  <span className={`text-2xl font-bold ${estatisticas?.proximasDoPrazo ? 'text-orange-600' : ''}`}>
                    {estatisticas?.proximasDoPrazo || 0}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por protocolo, nome ou assunto..."
                    className="pl-10"
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              </div>
              <Select onValueChange={handleStatusFilter} defaultValue="todos">
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="em_andamento">Em Andamento</SelectItem>
                  <SelectItem value="respondida">Respondida</SelectItem>
                  <SelectItem value="prorrogada">Prorrogada</SelectItem>
                  <SelectItem value="recurso">Em Recurso</SelectItem>
                  <SelectItem value="arquivada">Arquivada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Solicitações */}
        <Card>
          <CardHeader>
            <CardTitle>Solicitações</CardTitle>
            <CardDescription>
              {solicitacoes?.length || 0} solicitações encontradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : solicitacoes && solicitacoes.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Protocolo</TableHead>
                      <TableHead>Solicitante</TableHead>
                      <TableHead>Assunto</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Prazo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {solicitacoes.map((sol) => {
                      const diasRestantes = calcularDiasRestantes(sol.data_limite, sol.data_prorrogacao || undefined);
                      const isPendente = sol.status === 'pendente' || sol.status === 'em_andamento';
                      
                      return (
                        <TableRow key={sol.id} className={diasRestantes < 0 && isPendente ? 'bg-red-50' : ''}>
                          <TableCell className="font-mono font-medium">
                            {sol.protocolo}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{sol.solicitante_nome}</p>
                              <p className="text-sm text-muted-foreground">{sol.solicitante_email}</p>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {sol.assunto}
                          </TableCell>
                          <TableCell>
                            {format(new Date(sol.data_solicitacao), 'dd/MM/yyyy', { locale: ptBR })}
                          </TableCell>
                          <TableCell>
                            {isPendente && (
                              <span className={`text-sm ${
                                diasRestantes < 0 ? 'text-red-600 font-semibold' :
                                diasRestantes <= 5 ? 'text-orange-600' : 
                                'text-muted-foreground'
                              }`}>
                                {diasRestantes < 0 ? `${Math.abs(diasRestantes)}d atrasado` : `${diasRestantes}d restantes`}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge className={`${statusColors[sol.status]} border`}>
                              {statusLabels[sol.status]}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Link to={`/admin/esic/${sol.id}`}>
                              <Button variant="ghost" size="sm" className="gap-1">
                                <Eye className="w-4 h-4" />
                                Ver
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma solicitação encontrada</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
