import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Shield, Mail, Lock, User, ArrowLeft } from "lucide-react";
import brasaoIpubi from "@/assets/brasao-ipubi.png";

export default function AdminRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasAdmins, setHasAdmins] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there are existing admins
    const checkAdmins = async () => {
      const { count, error } = await supabase
        .from("user_roles")
        .select("*", { count: "exact", head: true })
        .eq("role", "admin");
      
      if (!error) {
        setHasAdmins((count || 0) > 0);
      }
    };
    checkAdmins();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      // Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin`,
        },
      });

      if (signUpError) {
        if (signUpError.message.includes("already registered")) {
          toast.error("Este email já está cadastrado");
        } else {
          toast.error(signUpError.message);
        }
        setLoading(false);
        return;
      }

      if (authData.user) {
        // Add admin role using secure RPC function (atomic, prevents race conditions)
        const { data: success, error: roleError } = await supabase
          .rpc("create_first_admin");

        if (roleError || !success) {
          toast.error(roleError?.message || "Já existe um administrador cadastrado");
          setLoading(false);
          return;
        }

        toast.success("Administrador cadastrado com sucesso!");
        navigate("/admin");
      }
    } catch (error) {
      toast.error("Erro ao cadastrar administrador");
    }

    setLoading(false);
  };

  if (hasAdmins === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (hasAdmins) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <img src={brasaoIpubi} alt="Brasão de Ipubi" className="h-20" />
            </div>
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Shield className="h-6 w-6 text-primary" />
              Registro Desabilitado
            </CardTitle>
            <CardDescription>
              Já existe um administrador cadastrado no sistema. Entre em contato com o administrador existente para obter acesso.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/admin/login">
              <Button className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Ir para Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img src={brasaoIpubi} alt="Brasão de Ipubi" className="h-20" />
          </div>
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <User className="h-6 w-6 text-primary" />
            Primeiro Administrador
          </CardTitle>
          <CardDescription>
            Cadastre o primeiro administrador do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@prefeitura.gov.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar Administrador"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Link to="/admin/login" className="text-sm text-muted-foreground hover:text-primary">
              Já tem uma conta? Faça login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
