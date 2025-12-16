import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, Building2, Image, Wrench, FileText } from "lucide-react";

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [noticias, secretarias, slides, servicos, licitacoes] = await Promise.all([
        supabase.from("noticias").select("id", { count: "exact", head: true }),
        supabase.from("secretarias").select("id", { count: "exact", head: true }),
        supabase.from("banner_slides").select("id", { count: "exact", head: true }),
        supabase.from("servicos").select("id", { count: "exact", head: true }),
        supabase.from("licitacoes").select("id", { count: "exact", head: true }),
      ]);
      
      return {
        noticias: noticias.count || 0,
        secretarias: secretarias.count || 0,
        slides: slides.count || 0,
        servicos: servicos.count || 0,
        licitacoes: licitacoes.count || 0,
      };
    },
  });

  const cards = [
    { title: "Notícias", value: stats?.noticias || 0, icon: Newspaper, color: "text-blue-500" },
    { title: "Secretarias", value: stats?.secretarias || 0, icon: Building2, color: "text-green-500" },
    { title: "Licitações", value: stats?.licitacoes || 0, icon: FileText, color: "text-amber-500" },
    { title: "Slides", value: stats?.slides || 0, icon: Image, color: "text-purple-500" },
    { title: "Serviços", value: stats?.servicos || 0, icon: Wrench, color: "text-orange-500" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Bem-vindo ao painel administrativo</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
