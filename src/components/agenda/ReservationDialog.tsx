import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Package, User, Calendar, DollarSign, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Category,
  CATEGORIES,
  Product,
  Reservation,
  ReservationStatus,
  calcTotal,
  formatBRL,
} from "@/types/reservation";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSave: (r: Reservation) => void;
  initial?: Reservation | null;
}

const empty = (): Reservation => ({
  id: crypto.randomUUID(),
  date: new Date().toISOString().slice(0, 10),
  time: "12:00",
  responsible: "",
  phone: "",
  address: "",
  category: "Eventos",
  products: [{ id: crypto.randomUUID(), name: "", qty: 1, unitValue: 0 }],
  signal: 0,
  status: "pendente",
  notes: "",
  createdAt: new Date().toISOString(),
});

export function ReservationDialog({ open, onOpenChange, onSave, initial }: Props) {
  const [data, setData] = useState<Reservation>(empty);

  useEffect(() => {
    if (open) setData(initial ? { ...initial, products: [...initial.products] } : empty());
  }, [open, initial]);

  const total = useMemo(() => calcTotal(data.products), [data.products]);
  const balance = total - (Number(data.signal) || 0);

  const updateProduct = (id: string, patch: Partial<Product>) =>
    setData((d) => ({
      ...d,
      products: d.products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));

  const addProduct = () =>
    setData((d) => ({
      ...d,
      products: [
        ...d.products,
        { id: crypto.randomUUID(), name: "", qty: 1, unitValue: 0 },
      ],
    }));

  const removeProduct = (id: string) =>
    setData((d) => ({ ...d, products: d.products.filter((p) => p.id !== id) }));

  const handleSave = () => {
    onSave(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {initial ? "Editar Reserva" : "Nova Reserva"}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados completos da reserva.
          </DialogDescription>
        </DialogHeader>

        <Section icon={<Calendar className="h-4 w-4" />} title="Dados Básicos">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Data">
              <Input
                type="date"
                value={data.date}
                onChange={(e) => setData({ ...data, date: e.target.value })}
              />
            </Field>
            <Field label="Horário">
              <Input
                type="time"
                value={data.time}
                onChange={(e) => setData({ ...data, time: e.target.value })}
              />
            </Field>
            <Field label="Responsável">
              <Input
                value={data.responsible}
                onChange={(e) => setData({ ...data, responsible: e.target.value })}
                placeholder="Nome do cliente"
              />
            </Field>
            <Field label="Telefone">
              <Input
                value={data.phone}
                onChange={(e) => setData({ ...data, phone: e.target.value })}
                placeholder="(11) 99999-9999"
              />
            </Field>
            <Field label="Endereço" className="md:col-span-2">
              <Input
                value={data.address}
                onChange={(e) => setData({ ...data, address: e.target.value })}
                placeholder="Rua, número, bairro, cidade"
              />
            </Field>
            <Field label="Categoria" className="md:col-span-2">
              <Select
                value={data.category}
                onValueChange={(v) => setData({ ...data, category: v as Category })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c, i) => (
                    <SelectItem key={c} value={c}>
                      {i + 1} - {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
        </Section>

        <Section icon={<Package className="h-4 w-4" />} title="Produtos">
          <div className="space-y-2">
            <div className="hidden md:grid grid-cols-12 gap-2 px-1 text-xs font-semibold text-muted-foreground">
              <div className="col-span-5">Produto</div>
              <div className="col-span-2">Qtd</div>
              <div className="col-span-2">Valor Unit.</div>
              <div className="col-span-2">Total</div>
              <div className="col-span-1"></div>
            </div>
            {data.products.map((p) => {
              const lineTotal = p.qty * p.unitValue;
              return (
                <div
                  key={p.id}
                  className="grid grid-cols-12 gap-2 rounded-lg border bg-muted/30 p-2"
                >
                  <Input
                    className="col-span-12 md:col-span-5"
                    placeholder="Nome do produto"
                    value={p.name}
                    onChange={(e) => updateProduct(p.id, { name: e.target.value })}
                  />
                  <Input
                    type="number"
                    min={0}
                    className="col-span-4 md:col-span-2"
                    value={p.qty}
                    onChange={(e) =>
                      updateProduct(p.id, { qty: Number(e.target.value) })
                    }
                  />
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    className="col-span-4 md:col-span-2"
                    value={p.unitValue}
                    onChange={(e) =>
                      updateProduct(p.id, { unitValue: Number(e.target.value) })
                    }
                  />
                  <div className="col-span-3 md:col-span-2 flex items-center px-2 text-sm font-semibold">
                    {formatBRL(lineTotal)}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="col-span-1 text-red-600 hover:bg-red-50"
                    onClick={() => removeProduct(p.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
            <Button
              variant="outline"
              onClick={addProduct}
              className="w-full border-dashed"
            >
              <Plus className="mr-2 h-4 w-4" /> Adicionar Produto
            </Button>
            <div className="flex items-center justify-end gap-2 pt-2 text-lg font-bold">
              <span className="text-muted-foreground text-sm">Total Geral:</span>
              <span className="text-primary">{formatBRL(total)}</span>
            </div>
          </div>
        </Section>

        <Section icon={<DollarSign className="h-4 w-4" />} title="Financeiro">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Valor do Sinal (R$)">
              <Input
                type="number"
                min={0}
                step="0.01"
                value={data.signal}
                onChange={(e) =>
                  setData({ ...data, signal: Number(e.target.value) })
                }
              />
            </Field>
            <Field label="Status">
              <Select
                value={data.status}
                onValueChange={(v) =>
                  setData({ ...data, status: v as ReservationStatus })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="sinal_pago">Sinal Pago</SelectItem>
                  <SelectItem value="pago">Pago</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 rounded-xl bg-gradient-header p-4 text-white">
            <Metric label="Total" value={formatBRL(total)} />
            <Metric label="Sinal" value={formatBRL(Number(data.signal) || 0)} />
            <Metric label="Saldo Restante" value={formatBRL(balance)} highlight />
          </div>
        </Section>

        <Section icon={<FileText className="h-4 w-4" />} title="Observações">
          <Textarea
            rows={3}
            value={data.notes}
            onChange={(e) => setData({ ...data, notes: e.target.value })}
            placeholder="Observações adicionais..."
          />
        </Section>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gradient-header hover:opacity-90"
          >
            Salvar Reserva
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
        {icon}
        {title}
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function Metric({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="text-center">
      <p className="text-xs uppercase tracking-wider text-white/80">{label}</p>
      <p className={`mt-1 font-bold ${highlight ? "text-xl" : "text-base"}`}>
        {value}
      </p>
    </div>
  );
}
