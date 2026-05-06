import { ReservationStatus, STATUS_LABEL } from "@/types/reservation";
import { cn } from "@/lib/utils";

const styles: Record<ReservationStatus, string> = {
  pendente: "bg-amber-100 text-amber-800 ring-1 ring-amber-300",
  sinal_pago: "bg-blue-100 text-blue-800 ring-1 ring-blue-300",
  pago: "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300",
};

export function StatusBadge({ status }: { status: ReservationStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        styles[status]
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
