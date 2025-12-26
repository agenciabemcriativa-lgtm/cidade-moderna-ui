import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileJson, FileSpreadsheet, FileCode } from "lucide-react";

interface ExportMetadataButtonsProps {
  data: Record<string, unknown>;
  filename: string;
}

export function ExportMetadataButtons({ data, filename }: ExportMetadataButtonsProps) {
  const sanitizeFilename = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const downloadFile = (content: string, extension: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${sanitizeFilename(filename)}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportAsJSON = () => {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, 'json', 'application/json');
  };

  const exportAsCSV = () => {
    const headers = Object.keys(data);
    const values = Object.values(data).map(value => {
      if (value === null || value === undefined) return '';
      if (typeof value === 'object') return JSON.stringify(value);
      const stringValue = String(value);
      // Escape quotes and wrap in quotes if contains comma or newline
      if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    });
    
    const csvContent = [
      headers.join(','),
      values.join(',')
    ].join('\n');
    
    downloadFile(csvContent, 'csv', 'text/csv;charset=utf-8');
  };

  const exportAsXML = () => {
    const escapeXml = (value: unknown): string => {
      if (value === null || value === undefined) return '';
      const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
      return stringValue
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    };

    const xmlEntries = Object.entries(data)
      .map(([key, value]) => {
        const safeKey = key.replace(/[^a-zA-Z0-9_]/g, '_');
        return `    <${safeKey}>${escapeXml(value)}</${safeKey}>`;
      })
      .join('\n');

    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<documento>
${xmlEntries}
</documento>`;
    
    downloadFile(xmlContent, 'xml', 'application/xml');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Exportar Metadados
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportAsJSON} className="gap-2 cursor-pointer">
          <FileJson className="h-4 w-4" />
          Exportar JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsCSV} className="gap-2 cursor-pointer">
          <FileSpreadsheet className="h-4 w-4" />
          Exportar CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsXML} className="gap-2 cursor-pointer">
          <FileCode className="h-4 w-4" />
          Exportar XML
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
