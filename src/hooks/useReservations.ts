import { useEffect, useState } from "react";
import { Reservation } from "@/types/reservation";

const KEY = "sou-ice-reservations";

const seed: Reservation[] = [
  {
    id: crypto.randomUUID(),
    date: new Date().toISOString().slice(0, 10),
    time: "14:00",
    responsible: "Maria Silva",
    phone: "(11) 98765-4321",
    address: "Rua das Flores, 123 - São Paulo",
    category: "Eventos",
    products: [
      { id: crypto.randomUUID(), name: "Cooler Grande", qty: 2, unitValue: 150 },
      { id: crypto.randomUUID(), name: "Gelo (saco 5kg)", qty: 10, unitValue: 15 },
    ],
    signal: 200,
    status: "sinal_pago",
    notes: "Entregar antes das 13h.",
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    date: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
    time: "10:30",
    responsible: "João Pereira",
    phone: "(11) 91234-5678",
    address: "Av. Paulista, 1000 - São Paulo",
    category: "Carrinho Grande",
    products: [{ id: crypto.randomUUID(), name: "Carrinho Grande", qty: 1, unitValue: 350 }],
    signal: 0,
    status: "pendente",
    notes: "",
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    date: new Date(Date.now() - 86400000 * 5).toISOString().slice(0, 10),
    time: "18:00",
    responsible: "Ana Costa",
    phone: "(11) 99999-0000",
    address: "Rua Augusta, 500 - São Paulo",
    category: "Freezer",
    products: [{ id: crypto.randomUUID(), name: "Freezer Horizontal", qty: 1, unitValue: 500 }],
    signal: 500,
    status: "pago",
    notes: "Cliente recorrente.",
    createdAt: new Date().toISOString(),
  },
];

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return seed;
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(reservations));
  }, [reservations]);

  const add = (r: Reservation) => setReservations((p) => [r, ...p]);
  const update = (r: Reservation) =>
    setReservations((p) => p.map((x) => (x.id === r.id ? r : x)));
  const remove = (id: string) =>
    setReservations((p) => p.filter((x) => x.id !== id));

  return { reservations, add, update, remove };
}
