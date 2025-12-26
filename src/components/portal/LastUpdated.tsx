import { Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface LastUpdatedProps {
  date: string | Date | null | undefined;
  label?: string;
  className?: string;
}

export function LastUpdated({ date, label = "Última atualização", className = "" }: LastUpdatedProps) {
  if (!date) return null;

  const formattedDate = format(new Date(date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });

  return (
    <div className={`flex items-center gap-2 text-sm text-muted-foreground ${className}`}>
      <Clock className="w-4 h-4" />
      <span>
        {label}: <time dateTime={new Date(date).toISOString()}>{formattedDate}</time>
      </span>
    </div>
  );
}
