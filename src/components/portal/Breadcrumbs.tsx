import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  variant?: "default" | "light";
}

export function Breadcrumbs({ items, className, variant = "default" }: BreadcrumbsProps) {
  const isLight = variant === "light";
  
  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn("py-4", className)}
    >
      <ol className="flex items-center flex-wrap gap-1 text-sm">
        <li className="flex items-center">
          <Link 
            to="/" 
            className={cn(
              "transition-colors flex items-center gap-1",
              isLight 
                ? "text-white/80 hover:text-white" 
                : "text-muted-foreground hover:text-primary"
            )}
          >
            <Home className="w-4 h-4" />
            <span className="sr-only md:not-sr-only">Início</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight className={cn(
              "w-4 h-4 mx-2",
              isLight ? "text-white/50" : "text-muted-foreground/50"
            )} />
            {item.href && index < items.length - 1 ? (
              <Link 
                to={item.href} 
                className={cn(
                  "transition-colors",
                  isLight 
                    ? "text-white/80 hover:text-white" 
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                {item.label}
              </Link>
            ) : (
              <span className={cn(
                "font-medium truncate max-w-[200px] md:max-w-none",
                isLight ? "text-white" : "text-foreground"
              )}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
