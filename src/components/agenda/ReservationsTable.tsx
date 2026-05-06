import { Pencil, Trash2, Calendar, User, MapPin, Tag, DollarSign, Activity, Settings2 } from "lucide-react";
import { Reservation, calcTotal, formatBRL } from "@/types/reservation";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Props {
  reservations: Reservation[];
  onEdit: (r: Reservation) => void;
  onDelete: (id: string) => void;
}

export function ReservationsTable({ reservations, onEdit, onDelete }: Props) {
  if (reservations.length === 0) {
    return (
      <div className="rounded-2xl bg-card p-12 text-center shadow-card">
        <p className="text-muted-foreground">Nenhuma reserva encontrada.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-card shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-header text-white">
            <tr>
              <Th icon={<Calendar className="h-4 w-4" />}>Data / Hora</Th>
              <Th icon={<User className="h-4 w-4" />}>Cliente</Th>
              <Th icon={<MapPin className="h-4 w-4" />}>Endereço</Th>
              <Th icon={<Tag className="h-4 w-4" />}>Categoria</Th>
              <Th icon={<DollarSign className="h-4 w-4" />}>Valor Total</Th>
              <Th icon={<Activity className="h-4 w-4" />}>Status</Th>
              <Th icon={<Settings2 className="h-4 w-4" />}>Ações</Th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r, i) => {
              const total = calcTotal(r.products);
              return (
                <tr
                  key={r.id}
                  className={
                    i % 2 === 0 ? "bg-card" : "bg-muted/40"
                  }
                >
                  <td className="px-4 py-3 text-sm">
                    <div className="font-medium">
                      {new Date(r.date + "T00:00:00").toLocaleDateString("pt-BR")}
                    </div>
                    <div className="text-xs text-muted-foreground">{r.time}</div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="font-medium">{r.responsible}</div>
                    <div className="text-xs text-muted-foreground">{r.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-sm max-w-[240px] truncate">
                    {r.address}
                  </td>
                  <td className="px-4 py-3 text-sm">{r.category}</td>
                  <td className="px-4 py-3 text-sm font-semibold">
                    {formatBRL(total)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                        onClick={() => onEdit(r)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir reserva?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(r.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children, icon }: { children: React.ReactNode; icon: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
      <span className="inline-flex items-center gap-2">
        {icon}
        {children}
      </span>
    </th>
  );
}
