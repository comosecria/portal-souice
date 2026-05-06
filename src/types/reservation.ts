export type ReservationStatus = "pendente" | "sinal_pago" | "pago";

export type Category =
  | "Cooler Pequeno"
  | "Cooler Grande"
  | "Carrinho Pequeno"
  | "Carrinho Grande"
  | "Freezer"
  | "Eventos";

export interface Product {
  id: string;
  name: string;
  qty: number;
  unitValue: number;
}

export interface Reservation {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  responsible: string;
  phone: string;
  address: string;
  category: Category;
  products: Product[];
  signal: number;
  status: ReservationStatus;
  notes: string;
  createdAt: string;
}

export const CATEGORIES: Category[] = [
  "Cooler Pequeno",
  "Cooler Grande",
  "Carrinho Pequeno",
  "Carrinho Grande",
  "Freezer",
  "Eventos",
];

export const STATUS_LABEL: Record<ReservationStatus, string> = {
  pendente: "Pendente",
  sinal_pago: "Sinal Pago",
  pago: "Pago",
};

export function calcTotal(products: Product[]): number {
  return products.reduce((sum, p) => sum + p.qty * p.unitValue, 0);
}

export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
