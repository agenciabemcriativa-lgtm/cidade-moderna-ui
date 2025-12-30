import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAutoVerificacao, type CategoriaVerificacao, type ItemVerificacao } from "@/hooks/useAutoVerificacao";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  Shield, 
  FileText, 
  Users, 
  Gavel, 
  MessageSquare, 
  Plane, 
  HardHat, 
  Building, 
  Landmark, 
  Scale, 
  Network, 
  FileCheck, 
  Database,
  Clock,
  Info,
  AlertCircle,
  Download,
  TrendingUp
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

const iconeMap: Record<string, React.ElementType> = {
  FileText,
  Users,
  Gavel,
  MessageSquare,
  Plane,
  HardHat,
  Building,
  Landmark,
  Scale,
  Network,
  FileCheck,
  Database,
};

const statusConfig = {
  conforme: {
    label: 'Conforme',
    color: 'bg-green-500',
    textColor: 'text-green-700',
    bgLight: 'bg-green-50',
    icon: CheckCircle,
  },
  parcial: {
    label: 'Parcial',
    color: 'bg-yellow-500',
    textColor: 'text-yellow-700',
    bgLight: 'bg-yellow-50',
    icon: AlertTriangle,
  },
  nao_conforme: {
    label: 'Não Conforme',
    color: 'bg-red-500',
    textColor: 'text-red-700',
    bgLight: 'bg-red-50',
    icon: XCircle,
  },
  nao_aplicavel: {
    label: 'N/A',
    color: 'bg-gray-400',
    textColor: 'text-gray-600',
    bgLight: 'bg-gray-50',
    icon: Info,
  },
};

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
}

function getProgressColor(score: number): string {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
}

export default function AdminAutoVerificacao() {
  const { data, isLoading, refetch, isFetching } = useAutoVerificacao();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const handleExportPDF = () => {
    // Implementação futura de exportação
    alert('Funcionalidade de exportação em desenvolvimento');
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="h-7 w-7 text-primary" />
              Auto Verificação de Conformidade
            </h1>
            <p className="text-muted-foreground mt-1">
              Análise automática de conformidade com a legislação de transparência
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportPDF}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Data da verificação */}
        {data && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Última verificação: {format(new Date(data.dataVerificacao), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
          </div>
        )}

        {/* Score Geral */}
        {data && (
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="text-center">
                  <div className={`text-6xl font-bold ${getScoreColor(data.scoreGeral)}`}>
                    {data.scoreGeral}%
                  </div>
                  <p className="text-muted-foreground mt-1">Score de Conformidade</p>
                </div>
                <div className="flex-1 w-full">
                  <div className="relative h-4 rounded-full bg-muted overflow-hidden">
                    <div 
                      className={`absolute left-0 top-0 h-full transition-all ${getProgressColor(data.scoreGeral)}`}
                      style={{ width: `${data.scoreGeral}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-4 gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-sm">{data.conformes} Conformes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <span className="text-sm">{data.parciais} Parciais</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="text-sm">{data.naoConformes} Não Conformes</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cards de resumo */}
        {data && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total de Itens</p>
                    <p className="text-3xl font-bold">{data.totalItens}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Conformes</p>
                    <p className="text-3xl font-bold text-green-600">{data.conformes}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Parcialmente</p>
                    <p className="text-3xl font-bold text-yellow-600">{data.parciais}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Não Conformes</p>
                    <p className="text-3xl font-bold text-red-600">{data.naoConformes}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                    <XCircle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Itens Críticos */}
        {data && data.naoConformes > 0 && (
          <Card className="border-red-200 bg-red-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <AlertCircle className="h-5 w-5" />
                Atenção: Itens Não Conformes
              </CardTitle>
              <CardDescription className="text-red-600">
                Os itens abaixo precisam de atenção imediata para atender à legislação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.categorias.flatMap(cat => 
                  cat.itens.filter(item => item.status === 'nao_conforme')
                ).map(item => (
                  <div 
                    key={item.id} 
                    className="flex items-start gap-3 p-3 bg-white rounded-lg border border-red-200"
                  >
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-red-700">{item.item}</p>
                      <p className="text-sm text-red-600">{item.detalhes}</p>
                      {item.prazoLegal && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Prazo: {item.prazoLegal}
                        </p>
                      )}
                    </div>
                    <Badge variant="outline" className="border-red-200 text-red-700 text-xs">
                      {item.baseLegal.split(' ')[0]} {item.baseLegal.split(' ')[1]}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Categorias */}
        {data && (
          <Card>
            <CardHeader>
              <CardTitle>Detalhamento por Categoria</CardTitle>
              <CardDescription>
                Clique em uma categoria para ver os itens verificados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion 
                type="multiple" 
                value={expandedCategories}
                onValueChange={setExpandedCategories}
                className="space-y-2"
              >
                {data.categorias.map((categoria) => {
                  const IconeCategoria = iconeMap[categoria.icone] || FileText;
                  
                  return (
                    <AccordionItem 
                      key={categoria.id} 
                      value={categoria.id}
                      className="border rounded-lg px-4"
                    >
                      <AccordionTrigger className="hover:no-underline py-4">
                        <div className="flex items-center gap-4 w-full">
                          <div className={`p-2 rounded-lg ${
                            categoria.percentualConformidade >= 80 
                              ? 'bg-green-100' 
                              : categoria.percentualConformidade >= 60 
                                ? 'bg-yellow-100' 
                                : 'bg-red-100'
                          }`}>
                            <IconeCategoria className={`h-5 w-5 ${
                              categoria.percentualConformidade >= 80 
                                ? 'text-green-600' 
                                : categoria.percentualConformidade >= 60 
                                  ? 'text-yellow-600' 
                                  : 'text-red-600'
                            }`} />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="font-medium">{categoria.nome}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="text-green-600">{categoria.conformes} ✓</span>
                              <span className="text-yellow-600">{categoria.parciais} ⚠</span>
                              <span className="text-red-600">{categoria.naoConformes} ✗</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-24">
                              <div className="relative h-2 rounded-full bg-muted overflow-hidden">
                                <div 
                                  className={`absolute left-0 top-0 h-full transition-all ${getProgressColor(categoria.percentualConformidade)}`}
                                  style={{ width: `${categoria.percentualConformidade}%` }}
                                />
                              </div>
                            </div>
                            <span className={`font-bold min-w-[3rem] text-right ${getScoreColor(categoria.percentualConformidade)}`}>
                              {categoria.percentualConformidade}%
                            </span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3 pt-2 pb-4">
                          {categoria.itens.map((item) => {
                            const config = statusConfig[item.status];
                            const StatusIcon = config.icon;
                            
                            return (
                              <div 
                                key={item.id}
                                className={`p-4 rounded-lg border ${config.bgLight}`}
                              >
                                <div className="flex items-start gap-3">
                                  <StatusIcon className={`h-5 w-5 mt-0.5 ${config.textColor}`} />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <p className={`font-medium ${config.textColor}`}>
                                        {item.item}
                                      </p>
                                      <Badge 
                                        variant="outline" 
                                        className={`text-xs ${config.textColor} border-current`}
                                      >
                                        {config.label}
                                      </Badge>
                                      {item.prioridade === 'alta' && (
                                        <Badge variant="destructive" className="text-xs">
                                          Prioritário
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {item.descricao}
                                    </p>
                                    <p className={`text-sm mt-2 ${config.textColor}`}>
                                      {item.detalhes}
                                    </p>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-muted-foreground">
                                      {item.prazoLegal && (
                                        <span className="flex items-center gap-1">
                                          <Clock className="h-3 w-3" />
                                          {item.prazoLegal}
                                        </span>
                                      )}
                                      <span className="flex items-center gap-1">
                                        <Scale className="h-3 w-3" />
                                        {item.baseLegal}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </CardContent>
          </Card>
        )}

        {/* Base Legal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Legislação de Referência
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-medium">Lei 12.527/2011 (LAI)</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Lei de Acesso à Informação - Regula o acesso a informações públicas
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-medium">LC 101/2000 (LRF)</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Lei de Responsabilidade Fiscal - Normas de finanças públicas
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-medium">LC 131/2009</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Lei da Transparência - Divulgação em tempo real das receitas e despesas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
