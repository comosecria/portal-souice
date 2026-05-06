import { useEffect, useState } from "react";
import { Customer } from "@/types/customer";

const KEY = "sou-ice-customers";

const seed: Customer[] = [
  {
    id: crypto.randomUUID(),
    name: "Maria Silva",
    phone: "(11) 98765-4321",
    address: "Rua das Flores, 123",
    district: "Jardins",
    zip: "01000-000",
    rg: "",
    cpf: "",
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: "João Pereira",
    phone: "(11) 91234-5678",
    address: "Av. Paulista, 1000",
    district: "Bela Vista",
    zip: "01310-100",
    rg: "",
    cpf: "",
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    name: "Ana Costa",
    phone: "(11) 99999-0000",
    address: "Rua Augusta, 500",
    district: "Consolação",
    zip: "01304-000",
    rg: "",
    cpf: "",
    createdAt: new Date().toISOString(),
  },
];

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return seed;
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(customers));
  }, [customers]);

  const add = (c: Customer) => setCustomers((p) => [c, ...p]);
  const update = (c: Customer) =>
    setCustomers((p) => p.map((x) => (x.id === c.id ? c : x)));
  const remove = (id: string) =>
    setCustomers((p) => p.filter((x) => x.id !== id));

  return { customers, add, update, remove };
}
