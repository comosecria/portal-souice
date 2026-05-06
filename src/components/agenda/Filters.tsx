import { Filter, Search, X } from "lucide-react";
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
import { CATEGORIES } from "@/types/reservation";

export interface FiltersState {
  category: string;
  status: string;
  from: string;
  to: string;
}

interface FiltersProps {
  value: FiltersState;
  onChange: (v: FiltersState) => void;
  onClear: () => void;
}

export function Filters({ value, onChange, onClear }: FiltersProps) {
  return (
    <div className="rounded-2xl bg-card p-6 shadow-md">
      <div className="mb-4 flex items-center gap-2">
        <Filter className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Filtros</h2>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1.5">
          <Label>Categoria</Label>
          <Select
            value={value.category}
            onValueChange={(v) => onChange({ ...value, category: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Status do Pagamento</Label>
          <Select
            value={value.status}
            onValueChange={(v) => onChange({ ...value, status: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="sinal_pago">Sinal Pago</SelectItem>
              <SelectItem value="pago">Pago</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Período De</Label>
          <Input
            type="date"
            value={value.from}
            onChange={(e) => onChange({ ...value, from: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Até</Label>
          <Input
            type="date"
            value={value.to}
            onChange={(e) => onChange({ ...value, to: e.target.value })}
          />
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Search className="mr-2 h-4 w-4" /> Filtrar
        </Button>
        <Button
          variant="outline"
          onClick={onClear}
          className="border-blue-500 text-blue-600 hover:bg-blue-50"
        >
          <X className="mr-2 h-4 w-4" /> Limpar
        </Button>
      </div>
    </div>
  );
}
