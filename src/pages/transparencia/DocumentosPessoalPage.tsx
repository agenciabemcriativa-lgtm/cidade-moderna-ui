import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, Download, Calendar, ChevronDown } from 'lucide-react';
import { TransparenciaLayout } from '@/components/transparencia/TransparenciaLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  useDocumentosPessoal,
  TipoDocumentoPessoal,
  tipoLabels,
  mesesLabels,
} from '@/hooks/useDocumentosPessoal';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

export default function DocumentosPessoalPage() {
  const { tipo } = useParams<{ tipo: string }>();
  const [anoFiltro, setAnoFiltro] = useState<number | undefined>(undefined);
  
  const tipoDoc = tipo as TipoDocumentoPessoal;
  const { data: documentos, isLoading } = useDocumentosPessoal(tipoDoc, anoFiltro);

  const titulo = tipoLabels[tipoDoc] || 'Documentos';

  useEffect(() => {
    document.title = `${titulo} - Transparência - Prefeitura de Ipubi`;
  }, [titulo]);

  return (
    <TransparenciaLayout
      title={titulo}
      description={`Consulte os documentos de ${titulo.toLowerCase()} do município de Ipubi.`}
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <p className="text-muted-foreground">
            Documentos disponíveis para consulta pública.
          </p>
          <Select
            value={anoFiltro?.toString() || 'todos'}
            onValueChange={(v) => setAnoFiltro(v === 'todos' ? undefined : parseInt(v))}
          >
            <SelectTrigger className="w-40">
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : documentos && documentos.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {documentos.map((doc) => (
              <Card key={doc.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-start gap-2">
                    <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{doc.titulo}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Referência:</span>{' '}
                    {mesesLabels[doc.mes_referencia]}/{doc.ano_referencia}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Postado em {new Date(doc.data_postagem).toLocaleDateString('pt-BR')}
                  </div>
                  <Button asChild className="w-full" size="sm">
                    <a href={doc.arquivo_url} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-2" />
                      Baixar Documento
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum documento encontrado.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </TransparenciaLayout>
  );
}
