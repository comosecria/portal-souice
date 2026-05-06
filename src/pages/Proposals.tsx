import { PageHeader } from "@/components/PageHeader";
import { FileText } from "lucide-react";

export default function Proposals() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Geração de Propostas" subtitle="Crie propostas comerciais" />
      <main className="container py-16">
        <div className="mx-auto max-w-2xl rounded-2xl bg-card p-12 text-center shadow-card">
          <FileText className="mx-auto mb-4 h-16 w-16 text-emerald-500" />
          <h2 className="text-2xl font-bold">Em breve</h2>
          <p className="mt-2 text-muted-foreground">
            O módulo de geração de propostas estará disponível em breve.
          </p>
        </div>
      </main>
    </div>
  );
}
