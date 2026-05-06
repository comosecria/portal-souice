import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  ShoppingCart,
  Calendar,
  CreditCard,
  FileText,
  BarChart3,
  PiggyBank,
  X,
  IdCard,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import { Customer } from "@/types/customer";
import { cn } from "@/lib/utils";

export type DialogMode = "create" | "edit" | "view";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSave: (r: Reservation) => void;
  initial?: Reservation | null;
  mode?: DialogMode;
  customers?: Customer[];
}

const empty = (): Reservation => ({
  id: crypto.randomUUID(),
  date: "",
  time: "",
  responsible: "",
  phone: "",
  address: "",
  district: "",
  zip: "",
  rg: "",
  cpf: "",
  category: "Eventos",
  products: [],
  signal: 0,
  status: "pendente",
  notes: "",
  createdAt: new Date().toISOString(),
});

const NOTES_MAX = 500;

export function ReservationDialog({
  open,
  onOpenChange,
  onSave,
  initial,
  mode = "create",
  customers = [],
}: Props) {
  const [data, setData] = useState<Reservation>(empty);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [newProduct, setNewProduct] = useState<{ name: string; qty: number; unitValue: number }>({
    name: "",
    qty: 1,
    unitValue: 0,
  });
  const readOnly = mode === "view";

  useEffect(() => {
    if (open)
      setData(initial ? { ...initial, products: [...initial.products] } : empty());
  }, [open, initial]);

  const total = useMemo(() => calcTotal(data.products), [data.products]);
  const balance = total - (Number(data.signal) || 0);

  const suggestions = useMemo(() => {
    const q = data.responsible.trim().toLowerCase();
    if (!q) return [];
    return customers
      .filter((c) => c.name.toLowerCase().includes(q) && c.name.toLowerCase() !== q)
      .slice(0, 6);
  }, [customers, data.responsible]);

  const pickCustomer = (c: Customer) => {
    setData((d) => ({
      ...d,
      responsible: c.name,
      phone: c.phone || d.phone,
      address: c.address || d.address,
      district: c.district || d.district,
      zip: c.zip || d.zip,
      rg: c.rg || d.rg,
      cpf: c.cpf || d.cpf,
    }));
    setShowSuggestions(false);
  };

  const addProduct = () => {
    if (!newProduct.name.trim()) return;
    setData((d) => ({
      ...d,
      products: [
        { id: crypto.randomUUID(), ...newProduct },
        ...d.products,
      ],
    }));
    setNewProduct({ name: "", qty: 1, unitValue: 0 });
  };

  const removeProduct = (id: string) =>
    setData((d) => ({ ...d, products: d.products.filter((p) => p.id !== id) }));

  const handleSave = () => {
    onSave(data);
    onOpenChange(false);
  };

  const title =
    mode === "view"
      ? "Detalhes da Reserva"
      : mode === "edit"
      ? "Editar Reserva"
      : "Nova Reserva";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto p-0 gap-0 [&>button]:hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-5">
          <h2 className="text-2xl font-bold text-rose-500">{title}</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-full p-1 text-muted-foreground hover:bg-muted"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          {/* Dados básicos */}
          <Section
            icon={<Calendar className="h-4 w-4" />}
            title="Dados da Reserva"
            tone="amber"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Data da Reserva:">
                <Input
                  type="date"
                  value={data.date}
                  disabled={readOnly}
                  onChange={(e) => setData({ ...data, date: e.target.value })}
                  className="border-amber-300 focus-visible:ring-amber-400"
                />
              </Field>
              <Field label="Horário:">
                <Input
                  type="time"
                  value={data.time}
                  disabled={readOnly}
                  onChange={(e) => setData({ ...data, time: e.target.value })}
                  className="border-amber-300 focus-visible:ring-amber-400"
                />
              </Field>
              <Field label="Categoria de Reserva:" className="md:col-span-2">
                <Select
                  value={data.category}
                  disabled={readOnly}
                  onValueChange={(v) =>
                    setData({ ...data, category: v as Category })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </Section>

          {/* Identificação do Cliente */}
          <Section
            icon={<IdCard className="h-4 w-4" />}
            title="Identificação do Cliente"
            tone="emerald"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Nome *" className="md:col-span-2">
                <div className="relative">
                  <Input
                    value={data.responsible}
                    disabled={readOnly}
                    placeholder="Comece a digitar..."
                    onChange={(e) => {
                      setData({ ...data, responsible: e.target.value });
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    className="border-emerald-300 focus-visible:ring-emerald-400"
                  />
                  {!readOnly && showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg">
                      {suggestions.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onMouseDown={() => pickCustomer(c)}
                          className="block w-full px-3 py-2 text-left text-sm hover:bg-muted"
                        >
                          <div className="font-medium">{c.name}</div>
                          {c.phone && (
                            <div className="text-xs text-muted-foreground">{c.phone}</div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </Field>
              <Field label="Telefone *">
                <Input
                  value={data.phone}
                  disabled={readOnly}
                  placeholder="(11) 99999-9999"
                  onChange={(e) => setData({ ...data, phone: e.target.value })}
                  className="border-emerald-300 focus-visible:ring-emerald-400"
                />
              </Field>
              <Field label="CEP">
                <Input
                  value={data.zip || ""}
                  disabled={readOnly}
                  onChange={(e) => setData({ ...data, zip: e.target.value })}
                  className="border-emerald-300 focus-visible:ring-emerald-400"
                />
              </Field>
              <Field label="Endereço" className="md:col-span-2">
                <Input
                  value={data.address}
                  disabled={readOnly}
                  onChange={(e) => setData({ ...data, address: e.target.value })}
                  className="border-emerald-300 focus-visible:ring-emerald-400"
                />
              </Field>
              <Field label="Bairro">
                <Input
                  value={data.district || ""}
                  disabled={readOnly}
                  onChange={(e) => setData({ ...data, district: e.target.value })}
                  className="border-emerald-300 focus-visible:ring-emerald-400"
                />
              </Field>
              <Field label="RG">
                <Input
                  value={data.rg || ""}
                  disabled={readOnly}
                  onChange={(e) => setData({ ...data, rg: e.target.value })}
                  className="border-emerald-300 focus-visible:ring-emerald-400"
                />
              </Field>
              <Field label="CPF" className="md:col-span-2">
                <Input
                  value={data.cpf || ""}
                  disabled={readOnly}
                  onChange={(e) => setData({ ...data, cpf: e.target.value })}
                  className="border-emerald-300 focus-visible:ring-emerald-400"
                />
              </Field>
            </div>
          </Section>

          {/* Produtos */}
          <Section
            icon={<ShoppingCart className="h-4 w-4" />}
            title="Produtos"
            tone="amber"
          >
            {!readOnly && (
              <div className="mb-3 grid grid-cols-12 gap-2 items-end">
                <div className="col-span-12 md:col-span-5">
                  <Label className="mb-1 block text-xs font-semibold">Produto</Label>
                  <Input
                    placeholder="Nome do produto"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    onKeyDown={(e) => e.key === "Enter" && addProduct()}
                    className="border-amber-300 focus-visible:ring-amber-400"
                  />
                </div>
                <div className="col-span-4 md:col-span-2">
                  <Label className="mb-1 block text-xs font-semibold">Qtd</Label>
                  <Input
                    type="number"
                    min={1}
                    value={newProduct.qty}
                    onChange={(e) => setNewProduct({ ...newProduct, qty: Number(e.target.value) })}
                    className="border-amber-300 focus-visible:ring-amber-400"
                  />
                </div>
                <div className="col-span-4 md:col-span-3">
                  <Label className="mb-1 block text-xs font-semibold">Valor unit.</Label>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="0,00"
                    value={newProduct.unitValue || ""}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, unitValue: Number(e.target.value) })
                    }
                    className="border-amber-300 focus-visible:ring-amber-400"
                  />
                </div>
                <div className="col-span-4 md:col-span-2">
                  <Button
                    type="button"
                    onClick={addProduct}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    <Plus className="mr-1 h-4 w-4" /> Adicionar
                  </Button>
                </div>
              </div>
            )}

            {data.products.length === 0 ? (
              <p className="rounded-md border border-dashed border-amber-300 bg-white/50 p-4 text-center text-sm text-muted-foreground">
                Nenhum produto adicionado
              </p>
            ) : (
              <div
                className={cn(
                  "rounded-md border border-amber-200 bg-white/60",
                  data.products.length > 4 && "max-h-[240px] overflow-y-auto"
                )}
              >
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-amber-100/80 backdrop-blur">
                    <tr className="text-xs font-semibold text-amber-800">
                      <th className="px-3 py-2 text-left">Produto</th>
                      <th className="px-2 py-2 text-center">Qtd</th>
                      <th className="px-2 py-2 text-right">Valor</th>
                      <th className="px-2 py-2 text-right">Total</th>
                      {!readOnly && <th className="px-2 py-2 w-10"></th>}
                    </tr>
                  </thead>
                  <tbody>
                    {data.products.map((p) => {
                      const lineTotal = p.qty * p.unitValue;
                      return (
                        <tr key={p.id} className="border-t border-amber-100">
                          <td className="px-3 py-2">{p.name}</td>
                          <td className="px-2 py-2 text-center">{p.qty}</td>
                          <td className="px-2 py-2 text-right">{formatBRL(p.unitValue)}</td>
                          <td className="px-2 py-2 text-right font-semibold">
                            {formatBRL(lineTotal)}
                          </td>
                          {!readOnly && (
                            <td className="px-2 py-2">
                              <Button
                                type="button"
                                size="icon"
                                onClick={() => removeProduct(p.id)}
                                className="h-7 w-7 bg-red-500 hover:bg-red-600 text-white"
                              >
                                <span className="text-lg leading-none">−</span>
                              </Button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-amber-700">
                <PiggyBank className="h-4 w-4" /> Total do Pedido
              </div>
              <div className="mt-1 text-2xl font-bold text-orange-500">
                {formatBRL(total)}
              </div>
            </div>
          </Section>

          {/* Pagamento */}
          <Section
            icon={<CreditCard className="h-4 w-4" />}
            title="Controle de Pagamento"
            tone="emerald"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Valor (R$):">
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="0,00"
                  value={data.signal || ""}
                  disabled={readOnly}
                  onChange={(e) =>
                    setData({ ...data, signal: Number(e.target.value) })
                  }
                  className="border-amber-300 focus-visible:ring-amber-400"
                />
              </Field>
              <Field label="Status do Pagamento:">
                <Select
                  value={data.status}
                  disabled={readOnly}
                  onValueChange={(v) =>
                    setData({ ...data, status: v as ReservationStatus })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">🔴 Pendente</SelectItem>
                    <SelectItem value="sinal_pago">🟡 Sinal Pago</SelectItem>
                    <SelectItem value="pago">🟢 Pago</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50/40 p-4">
              <div className="mb-3 flex items-center justify-center gap-2 text-sm font-semibold text-blue-600">
                <BarChart3 className="h-4 w-4" /> Resumo Financeiro
              </div>
              <SummaryRow
                icon={<PiggyBank className="h-4 w-4 text-amber-500" />}
                label="Total do Pedido:"
                value={formatBRL(total)}
                valueClass="text-rose-500"
              />
              <SummaryRow
                icon={<CreditCard className="h-4 w-4 text-emerald-500" />}
                label="Sinal Pago:"
                value={formatBRL(Number(data.signal) || 0)}
                valueClass="text-rose-500"
              />
              <SummaryRow
                icon={<BarChart3 className="h-4 w-4 text-blue-500" />}
                label="Saldo Restante:"
                value={formatBRL(balance)}
                valueClass="text-blue-600 font-bold"
              />
            </div>
          </Section>

          {/* Observações */}
          <Section
            icon={<FileText className="h-4 w-4" />}
            title="Observações"
            tone="amber"
          >
            <Textarea
              rows={3}
              maxLength={NOTES_MAX}
              value={data.notes}
              disabled={readOnly}
              onChange={(e) => setData({ ...data, notes: e.target.value })}
              placeholder="Observações adicionais..."
              className="border-amber-300 focus-visible:ring-amber-400"
            />
            <div className="mt-1 text-right text-xs text-muted-foreground">
              {data.notes.length}/{NOTES_MAX} caracteres
            </div>
          </Section>
        </div>

        <DialogFooter className="border-t px-6 py-4 sm:justify-between">
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            className="bg-gray-200 text-gray-700 hover:bg-gray-300 min-w-[120px]"
          >
            {readOnly ? "Fechar" : "Cancelar"}
          </Button>
          {!readOnly && (
            <Button
              onClick={handleSave}
              className="bg-rose-500 hover:bg-rose-600 text-white min-w-[160px]"
            >
              Salvar Reserva
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const TONES = {
  amber: "border-amber-200 bg-amber-50/30",
  emerald: "border-emerald-200 bg-emerald-50/30",
} as const;

function Section({
  icon,
  title,
  children,
  tone = "amber",
  action,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  tone?: keyof typeof TONES;
  action?: React.ReactNode;
}) {
  return (
    <div className={cn("rounded-xl border-2 p-4", TONES[tone])}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-base font-semibold text-rose-500">
          {icon}
          {title}
        </div>
        {action}
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
      <Label className="text-sm font-semibold text-foreground">{label}</Label>
      {children}
    </div>
  );
}

function SummaryRow({
  icon,
  label,
  value,
  valueClass = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between py-1 text-sm">
      <span className="flex items-center gap-2 text-foreground">
        {icon}
        {label}
      </span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}
