import { useState } from "react";
import { CalendarPlus, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReservations } from "@/hooks/useReservations";
import { useCustomers } from "@/hooks/useCustomers";
import { Reservation } from "@/types/reservation";
import { ReservationsTable } from "@/components/agenda/ReservationsTable";
import { ReservationDialog, DialogMode } from "@/components/agenda/ReservationDialog";
import { DateSearch } from "@/components/agenda/DateSearch";
import { ReportsDialog } from "@/components/agenda/ReportsDialog";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";

const Index = () => {
  const { reservations, add, update, remove } = useReservations();
  const { customers, add: addCustomer } = useCustomers();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
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
    // Auto-cadastro de cliente novo
    if (r.responsible && !customers.find((c) => c.name.toLowerCase() === r.responsible.toLowerCase())) {
      addCustomer({
        id: crypto.randomUUID(),
        name: r.responsible,
        phone: r.phone,
        address: r.address,
        district: r.district,
        zip: r.zip,
        rg: r.rg,
        cpf: r.cpf,
        createdAt: new Date().toISOString(),
      });
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
      <PageHeader
        title="Agenda de Eventos SOU ICE"
        subtitle="Gestão completa de reservas e equipamentos"
        actions={
          <>
            <Button
              variant="ghost"
              onClick={() => setReportsOpen(true)}
              className="bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 hover:text-white"
            >
              <BarChart3 className="mr-2 h-4 w-4" /> Relatórios
            </Button>
            <Button onClick={openNew} className="bg-white text-primary shadow-md hover:bg-white/90">
              <CalendarPlus className="mr-2 h-4 w-4" /> Nova Reserva
            </Button>
          </>
        }
      />

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
        customers={customers}
      />

      <ReportsDialog
        open={reportsOpen}
        onOpenChange={setReportsOpen}
        reservations={reservations}
        customers={customers}
      />
    </div>
  );
};

export default Index;
