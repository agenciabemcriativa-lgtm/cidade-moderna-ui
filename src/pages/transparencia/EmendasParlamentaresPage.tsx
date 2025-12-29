import { useState, useEffect } from 'react';
import { FileText, Download, Calendar, ChevronDown } from 'lucide-react';
import { TransparenciaLayout } from '@/components/transparencia/TransparenciaLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEmendasParlamentares, EmendaParlamentar } from '@/hooks/useEmendasParlamentares';

export default function EmendasParlamentaresPage() {
  const { data: emendas, isLoading } = useEmendasParlamentares();
  const [selectedYear, setSelectedYear] = useState<string>('todos');

  useEffect(() => {
    document.title = 'Emendas Parlamentares - Transparência - Prefeitura de Ipubi';
  }, []);

  const years = emendas
    ? [...new Set(emendas.map((e) => e.ano_referencia))].sort((a, b) => b - a)
    : [];

  const filteredEmendas = emendas?.filter((emenda) =>
    selectedYear === 'todos' ? true : emenda.ano_referencia === parseInt(selectedYear)
  );

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return dateStr;
    }
  };

  return (
    <TransparenciaLayout
      title="Emendas Parlamentares"
      description="Consulte os documentos de emendas parlamentares do município de Ipubi."
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <p className="text-muted-foreground">
            Documentos relacionados às emendas parlamentares recebidas pelo município.
          </p>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por ano" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os anos</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredEmendas && filteredEmendas.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredEmendas.map((emenda) => (
              <Card key={emenda.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg shrink-0">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg line-clamp-2 mb-1">{emenda.titulo}</h3>
                      {emenda.descricao && (
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-2">{emenda.descricao}</p>
                      )}
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Ref: {formatDate(emenda.data_referencia)}
                        </span>
                        <span className="text-xs bg-muted px-2 py-1 rounded">
                          Postado em {formatDate(emenda.data_postagem)}
                        </span>
                      </div>
                      <Button asChild className="w-full">
                        <a href={emenda.arquivo_url} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4 mr-2" />
                          Baixar Documento
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum documento encontrado</h3>
              <p className="text-muted-foreground">
                {selectedYear !== 'todos'
                  ? `Não há documentos de emendas parlamentares para o ano de ${selectedYear}.`
                  : 'Não há documentos de emendas parlamentares cadastrados.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </TransparenciaLayout>
  );
}
