import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileJson, FileSpreadsheet, FileCode, FileText } from "lucide-react";

interface ExportListButtonsProps {
  data: Record<string, unknown>[];
  filename: string;
  columns?: { key: string; label: string }[];
}

export function ExportListButtons({ data, filename, columns }: ExportListButtonsProps) {
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

  const getColumnKeys = () => {
    if (columns) return columns.map(c => c.key);
    if (data.length === 0) return [];
    return Object.keys(data[0]);
  };

  const getColumnLabels = () => {
    if (columns) return columns.map(c => c.label);
    return getColumnKeys();
  };

  const exportAsJSON = () => {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, 'json', 'application/json');
  };

  const exportAsCSV = () => {
    const keys = getColumnKeys();
    const labels = getColumnLabels();
    
    const escapeCSV = (value: unknown): string => {
      if (value === null || value === undefined) return '';
      if (typeof value === 'object') return JSON.stringify(value);
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    const rows = data.map(item => 
      keys.map(key => escapeCSV(item[key])).join(',')
    );
    
    const csvContent = [labels.join(','), ...rows].join('\n');
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

    const keys = getColumnKeys();
    
    const xmlItems = data.map(item => {
      const fields = keys.map(key => {
        const safeKey = key.replace(/[^a-zA-Z0-9_]/g, '_');
        return `      <${safeKey}>${escapeXml(item[key])}</${safeKey}>`;
      }).join('\n');
      return `    <item>\n${fields}\n    </item>`;
    }).join('\n');

    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<dados>
  <registros>
${xmlItems}
  </registros>
</dados>`;
    
    downloadFile(xmlContent, 'xml', 'application/xml');
  };

  const exportAsPDF = () => {
    const keys = getColumnKeys();
    const labels = getColumnLabels();
    
    // Create a simple HTML table for printing
    const tableRows = data.map(item => 
      `<tr>${keys.map(key => `<td style="border: 1px solid #ddd; padding: 8px;">${item[key] ?? '-'}</td>`).join('')}</tr>`
    ).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${filename}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; font-size: 18px; margin-bottom: 20px; }
          table { border-collapse: collapse; width: 100%; font-size: 12px; }
          th { background-color: #f4f4f4; border: 1px solid #ddd; padding: 10px; text-align: left; }
          td { border: 1px solid #ddd; padding: 8px; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .footer { margin-top: 20px; font-size: 10px; color: #666; }
        </style>
      </head>
      <body>
        <h1>${filename}</h1>
        <p style="font-size: 12px; color: #666;">Total de registros: ${data.length}</p>
        <table>
          <thead>
            <tr>${labels.map(label => `<th style="border: 1px solid #ddd; padding: 10px; background: #f4f4f4;">${label}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
        <div class="footer">
          <p>Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
          <p>Prefeitura Municipal de Ipubi - Portal da Transparência</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  if (data.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Exportar
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
        <DropdownMenuItem onClick={exportAsPDF} className="gap-2 cursor-pointer">
          <FileText className="h-4 w-4" />
          Imprimir/PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
