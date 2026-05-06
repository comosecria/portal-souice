import { useState } from "react";
import { CalendarPlus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReservations } from "@/hooks/useReservations";
import { Reservation } from "@/types/reservation";
import { ReservationsTable } from "@/components/agenda/ReservationsTable";
import { ReservationDialog, DialogMode } from "@/components/agenda/ReservationDialog";
import { DateSearch } from "@/components/agenda/DateSearch";
import { toast } from "sonner";

const Index = () => {
  const { reservations, add, update, remove } = useReservations();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Reservation | null>(null);
  const [mode, setMode] = useState<DialogMode>("create");

  const handleSave = (r: Reservation) => {
    if (mode === "edit") {
      update(r);
      toast.success("Reserva atualizada");
    } else if (mode === "create") {
      add(r);
      toast.success("Reserva criada");
    }
    setEditing(null);
  };

  const openNew = () => {
    setEditing(null);
    setMode("create");
    setDialogOpen(true);
  };

  const openEdit = (r: Reservation) => {
    setEditing(r);
    setMode("edit");
    setDialogOpen(true);
  };

  const openView = (r: Reservation) => {
    setEditing(r);
    setMode("view");
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
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
        <DateSearch reservations={reservations} onView={openView} />

        <ReservationsTable
          reservations={reservations}
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
        mode={mode}
      />
    </div>
  );
};

export default Index;
