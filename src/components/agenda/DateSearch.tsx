import { useState } from "react";
import { Search, CalendarDays, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Reservation } from "@/types/reservation";

interface Props {
  reservations: Reservation[];
  onView: (r: Reservation) => void;
}

export function DateSearch({ reservations, onView }: Props) {
  const [date, setDate] = useState("");
  const [searched, setSearched] = useState<string | null>(null);

  const results =
    searched !== null
      ? reservations
          .filter((r) => r.date === searched)
          .sort((a, b) => a.time.localeCompare(b.time))
      : [];

  const handleSearch = () => {
    if (!date) return;
    setSearched(date);
  };

  const formatDate = (d: string) =>
    new Date(d + "T00:00:00").toLocaleDateString("pt-BR");

  return (
    <div className="space-y-4 rounded-2xl border bg-card p-5 shadow-card">
      <div className="flex items-center gap-2 text-rose-500">
        <Search className="h-5 w-5" />
        <h2 className="text-lg font-bold">Buscar Disponibilidade de Data</h2>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        <div className="flex-1 space-y-1.5">
          <Label className="text-sm font-semibold">Data:</Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border-amber-300 focus-visible:ring-amber-400"
          />
        </div>
        <Button
          onClick={handleSearch}
          className="bg-orange-500 hover:bg-orange-600 text-white md:w-32"
        >
          <Search className="mr-2 h-4 w-4" /> Buscar
        </Button>
      </div>

      {searched !== null && (
        <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-rose-500">
            <CalendarDays className="h-4 w-4" />
            {results.length > 0
              ? `Reservas encontradas para ${formatDate(searched)}`
              : `Nenhuma reserva encontrada para ${formatDate(searched)}`}
          </div>

          {results.length > 0 && (
            <div className="space-y-2">
              {results.map((r) => (
                <div
                  key={r.id}
                  className="rounded-md border-l-4 border-amber-400 bg-white p-3 shadow-sm"
                >
                  <div className="text-sm">
                    <span className="font-bold">{r.time}</span> -{" "}
                    <span>{r.responsible || "Sem responsável"}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Categoria: {r.category}
                    {r.phone && ` | Tel: ${r.phone}`}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => onView(r)}
                    className="mt-2 bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Eye className="mr-2 h-3.5 w-3.5" /> Ver Detalhes
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
