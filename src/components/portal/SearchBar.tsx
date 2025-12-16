import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/noticias?busca=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <section className="bg-muted/50 py-6 border-b border-border">
      <div className="container">
        <form onSubmit={handleSearch} className="flex items-center gap-3 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="O que você está procurando?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-base bg-background border-border"
            />
          </div>
          <Button type="submit" className="h-12 px-6">
            Buscar
          </Button>
        </form>
      </div>
    </section>
  );
}
