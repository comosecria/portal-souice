import { useMemo, useState } from "react";
import { BarChart3, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Reservation, calcTotal, formatBRL, STATUS_LABEL } from "@/types/reservation";
import { Customer } from "@/types/customer";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  reservations: Reservation[];
  customers: Customer[];
}

export function ReportsDialog({ open, onOpenChange, reservations, customers }: Props) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [customer, setCustomer] = useState<string>("all");

  const filtered = useMemo(() => {
    return reservations.filter((r) => {
      if (from && r.date < from) return false;
      if (to && r.date > to) return false;
      if (customer !== "all" && r.responsible !== customer) return false;
      return true;
    });
  }, [reservations, from, to, customer]);

  const totals = useMemo(() => {
    let total = 0;
    let pago = 0;
    let pendente = 0;
    filtered.forEach((r) => {
      const t = calcTotal(r.products);
      total += t;
      if (r.status === "pago") pago += t;
      else pendente += t - (Number(r.signal) || 0);
    });
    return { total, pago, pendente, count: filtered.length };
  }, [filtered]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto p-0 gap-0 [&>button]:hidden">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-rose-500">
            <BarChart3 className="h-6 w-6" /> Relatórios
          </h2>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-full p-1 text-muted-foreground hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">De:</Label>
              <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">Até:</Label>
              <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">Cliente:</Label>
              <Select value={customer} onValueChange={setCustomer}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {customers.map((c) => (
                    <SelectItem key={c.id} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat label="Reservas" value={String(totals.count)} tone="blue" />
            <Stat label="Total" value={formatBRL(totals.total)} tone="purple" />
            <Stat label="Pago" value={formatBRL(totals.pago)} tone="emerald" />
            <Stat label="A Receber" value={formatBRL(totals.pendente)} tone="amber" />
          </div>

          <div className="overflow-hidden rounded-xl border">
            <table className="w-full text-sm">
              <thead className="bg-gradient-header text-white">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Data</th>
                  <th className="px-3 py-2 text-left font-semibold">Cliente</th>
                  <th className="px-3 py-2 text-left font-semibold">Categoria</th>
                  <th className="px-3 py-2 text-left font-semibold">Status</th>
                  <th className="px-3 py-2 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-6 text-center text-muted-foreground">
                      Nenhuma reserva no período
                    </td>
                  </tr>
                ) : (
                  filtered.map((r, i) => (
                    <tr key={r.id} className={i % 2 === 0 ? "bg-card" : "bg-muted/40"}>
                      <td className="px-3 py-2">{new Date(r.date + "T00:00:00").toLocaleDateString("pt-BR")}</td>
                      <td className="px-3 py-2">{r.responsible}</td>
                      <td className="px-3 py-2">{r.category}</td>
                      <td className="px-3 py-2">{STATUS_LABEL[r.status]}</td>
                      <td className="px-3 py-2 text-right font-semibold">
                        {formatBRL(calcTotal(r.products))}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <DialogFooter className="border-t px-6 py-4">
          <Button onClick={() => onOpenChange(false)} className="bg-rose-500 hover:bg-rose-600 text-white">
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const TONES = {
  blue: "from-blue-500 to-blue-600",
  purple: "from-fuchsia-500 to-purple-600",
  emerald: "from-emerald-500 to-teal-500",
  amber: "from-amber-500 to-orange-500",
} as const;

function Stat({ label, value, tone }: { label: string; value: string; tone: keyof typeof TONES }) {
  return (
    <div className={`rounded-xl bg-gradient-to-br ${TONES[tone]} p-4 text-white shadow-card`}>
      <div className="text-xs font-semibold uppercase opacity-90">{label}</div>
      <div className="mt-1 text-xl font-bold">{value}</div>
    </div>
  );
}
