import { useMemo, useState } from "react";
import { CalendarPlus, Settings, Wallet, CheckCircle2, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReservations } from "@/hooks/useReservations";
import { Reservation, calcTotal, formatBRL } from "@/types/reservation";
import { SummaryCard } from "@/components/agenda/SummaryCard";
import { Filters, FiltersState } from "@/components/agenda/Filters";
import { ReservationsTable } from "@/components/agenda/ReservationsTable";
import { ReservationDialog } from "@/components/agenda/ReservationDialog";
import { toast } from "sonner";

const defaultFilters: FiltersState = {
  category: "all",
  status: "all",
  from: "",
  to: "",
};

const Index = () => {
  const { reservations, add, update, remove } = useReservations();
  const [filters, setFilters] = useState<FiltersState>(defaultFilters);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Reservation | null>(null);

  const filtered = useMemo(() => {
    return reservations.filter((r) => {
      if (filters.category !== "all" && r.category !== filters.category) return false;
      if (filters.status !== "all" && r.status !== filters.status) return false;
      if (filters.from && r.date < filters.from) return false;
      if (filters.to && r.date > filters.to) return false;
      return true;
    });
  }, [reservations, filters]);

  const stats = useMemo(() => {
    let toReceive = 0;
    let paid = 0;
    let upcoming = 0;
    const today = new Date().toISOString().slice(0, 10);
    const in7 = new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10);
    for (const r of reservations) {
      const total = calcTotal(r.products);
      const signal = Number(r.signal) || 0;
      if (r.status === "pago") {
        paid += total;
      } else {
        paid += signal;
        toReceive += total - signal;
      }
      if (r.date >= today && r.date <= in7) upcoming++;
    }
    return { toReceive, paid, upcoming };
  }, [reservations]);

  const handleSave = (r: Reservation) => {
    if (editing) {
      update(r);
      toast.success("Reserva atualizada");
    } else {
      add(r);
      toast.success("Reserva criada");
    }
    setEditing(null);
  };

  const openNew = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (r: Reservation) => {
    setEditing(r);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-header text-white shadow-elevated">
        <div className="container py-8">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                Agenda de Eventos SOU ICE
              </h1>
              <p className="mt-1 text-white/80">
                Gestão completa de reservas e equipamentos
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="ghost"
                className="bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 hover:text-white"
              >
                <Settings className="mr-2 h-4 w-4" /> Configurações
              </Button>
              <Button
                onClick={openNew}
                className="bg-white text-primary shadow-md hover:bg-white/90"
              >
                <CalendarPlus className="mr-2 h-4 w-4" /> Nova Reserva
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container space-y-6 py-8">
        {/* Summary Cards */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <SummaryCard
            title="Saldo a Receber"
            value={formatBRL(stats.toReceive)}
            icon={Wallet}
            variant="amber"
            hint="Pendente de pagamento"
          />
          <SummaryCard
            title="Total Pago"
            value={formatBRL(stats.paid)}
            icon={CheckCircle2}
            variant="emerald"
            hint="Sinais e integrais"
          />
          <SummaryCard
            title="Eventos Hoje / Próximos"
            value={String(stats.upcoming)}
            icon={CalendarClock}
            variant="red"
            hint="Próximos 7 dias"
          />
        </section>

        {/* Filters */}
        <Filters
          value={filters}
          onChange={setFilters}
          onClear={() => setFilters(defaultFilters)}
        />

        {/* Table */}
        <ReservationsTable
          reservations={filtered}
          onEdit={openEdit}
          onDelete={(id) => {
            remove(id);
            toast.success("Reserva excluída");
          }}
        />
      </main>

      <ReservationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        initial={editing}
      />
    </div>
  );
};

export default Index;
