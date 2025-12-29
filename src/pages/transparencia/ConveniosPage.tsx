import { ExternalLink } from 'lucide-react';
import { TransparenciaLayout } from '@/components/transparencia/TransparenciaLayout';
import { Button } from '@/components/ui/button';

const conveniosLinks = [
  {
    titulo: 'Transferências entre Entidade',
    url: 'http://45.163.4.114:5666/transparencia/?AcessoIndividual=LnkTransf',
  },
  {
    titulo: 'Acordos Firmados que não Envolve Recursos Financeiros',
    url: 'http://45.163.4.114:5666/transparencia/?AcessoIndividual=LnkAcordos',
  },
  {
    titulo: 'Transferências',
    url: 'http://45.163.4.114:5666/transparencia/?AcessoIndividual=LnkTransferencias',
  },
  {
    titulo: 'Transferências, Recebimento de Recursos Financeiros',
    url: 'http://45.163.4.114:5666/transparencia/?AcessoIndividual=LnkRecebRecursos',
  },
  {
    titulo: 'Prestação de Contas ao Terceiro Setor / Recursos Financeiros',
    url: 'http://45.163.4.114:5666/transparencia/?AcessoIndividual=LnkPrestContas',
  },
];

export default function ConveniosPage() {
  return (
    <TransparenciaLayout 
      title="Convênios e Transferências"
      description="Consulte os convênios, transferências e parcerias firmadas pelo município"
    >
      <div className="space-y-3">
        {conveniosLinks.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button
              variant="default"
              className="w-full justify-start text-left h-auto py-4 px-6 text-base font-medium"
            >
              {link.titulo}
              <ExternalLink className="w-4 h-4 ml-auto flex-shrink-0" />
            </Button>
          </a>
        ))}
      </div>

      {/* Informações legais */}
      <div className="mt-8 p-4 bg-muted rounded-lg text-sm text-muted-foreground">
        <h4 className="font-medium text-foreground mb-2">Base Legal</h4>
        <p>
          A publicação de convênios e parcerias atende ao disposto na Lei nº 13.019/2014 (Marco Regulatório 
          das Organizações da Sociedade Civil) e Lei nº 12.527/2011, garantindo transparência nas parcerias 
          com o poder público.
        </p>
      </div>
    </TransparenciaLayout>
  );
}
