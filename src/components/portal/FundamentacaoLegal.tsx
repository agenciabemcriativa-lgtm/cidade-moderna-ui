import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEsicLinksLegais } from "@/hooks/useEsicLinksLegais";

interface FundamentacaoLegalProps {
  className?: string;
}

export function FundamentacaoLegal({ className }: FundamentacaoLegalProps) {
  const { data: links = [], isLoading } = useEsicLinksLegais();

  if (isLoading || links.length === 0) {
    return null;
  }

  return (
    <Card className={`bg-muted/30 ${className ?? ""}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Fundamentação Legal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {links.map((link) =>
            link.tipo === "externo" ? (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                {link.titulo} <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <Link
                key={link.id}
                to={link.url}
                className="text-sm text-primary hover:underline"
              >
                {link.titulo}
              </Link>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}
