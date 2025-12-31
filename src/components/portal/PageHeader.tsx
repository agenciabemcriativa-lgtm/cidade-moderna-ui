import { ReactNode } from "react";
import { Breadcrumbs } from "./Breadcrumbs";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbItems: BreadcrumbItem[];
  children?: ReactNode;
}

export function PageHeader({ title, subtitle, breadcrumbItems, children }: PageHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-primary to-primary/90">
      <div className="container">
        <Breadcrumbs items={breadcrumbItems} variant="light" />
      </div>
      <div className="container pb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground mb-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-primary-foreground/80 text-lg max-w-3xl">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
