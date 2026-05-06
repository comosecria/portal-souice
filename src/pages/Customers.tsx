import { useState } from "react";
import { UserPlus, Pencil, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { useCustomers } from "@/hooks/useCustomers";
import { Customer } from "@/types/customer";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";

const empty = (): Customer => ({
  id: crypto.randomUUID(),
  name: "",
  phone: "",
  address: "",
  district: "",
  zip: "",
  rg: "",
  cpf: "",
  createdAt: new Date().toISOString(),
});

export default function Customers() {
  const { customers, add, update, remove } = useCustomers();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<Customer>(empty);
  const [editing, setEditing] = useState<string | null>(null);

  const openNew = () => {
    setData(empty());
    setEditing(null);
    setOpen(true);
  };
  const openEdit = (c: Customer) => {
    setData({ ...c });
    setEditing(c.id);
    setOpen(true);
  };

  const handleSave = () => {
    if (!data.name.trim() || !data.phone.trim()) {
      toast.error("Nome e telefone são obrigatórios");
      return;
    }
    if (editing) {
      update(data);
      toast.success("Cliente atualizado");
    } else {
      add(data);
      toast.success("Cliente cadastrado");
    }
    setOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Cadastro de Clientes"
        subtitle="Gerencie sua base de clientes"
        actions={
          <Button onClick={openNew} className="bg-white text-primary shadow-md hover:bg-white/90">
            <UserPlus className="mr-2 h-4 w-4" /> Novo Cliente
          </Button>
        }
      />

      <main className="container py-8">
        <div className="overflow-hidden rounded-2xl bg-card shadow-card">
          {customers.length === 0 ? (
            <p className="p-12 text-center text-muted-foreground">Nenhum cliente cadastrado.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-header text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Nome</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Telefone</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Endereço</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Bairro</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase">CPF</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c, i) => (
                    <tr key={c.id} className={i % 2 === 0 ? "bg-card" : "bg-muted/40"}>
                      <td className="px-4 py-3 text-sm font-medium">{c.name}</td>
                      <td className="px-4 py-3 text-sm">{c.phone}</td>
                      <td className="px-4 py-3 text-sm">{c.address}</td>
                      <td className="px-4 py-3 text-sm">{c.district}</td>
                      <td className="px-4 py-3 text-sm">{c.cpf}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                            onClick={() => openEdit(c)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:bg-red-50">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Excluir cliente?</AlertDialogTitle>
                                <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => {
                                    remove(c.id);
                                    toast.success("Cliente excluído");
                                  }}
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
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl p-0 gap-0 [&>button]:hidden">
          <div className="flex items-center justify-between border-b px-6 py-5">
            <h2 className="text-2xl font-bold text-rose-500">
              {editing ? "Editar Cliente" : "Novo Cliente"}
            </h2>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-1 text-muted-foreground hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 px-6 py-5 md:grid-cols-2">
            <Field label="Nome *" className="md:col-span-2">
              <Input value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
            </Field>
            <Field label="Telefone *">
              <Input value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} />
            </Field>
            <Field label="CEP">
              <Input value={data.zip} onChange={(e) => setData({ ...data, zip: e.target.value })} />
            </Field>
            <Field label="Endereço" className="md:col-span-2">
              <Input value={data.address} onChange={(e) => setData({ ...data, address: e.target.value })} />
            </Field>
            <Field label="Bairro">
              <Input value={data.district} onChange={(e) => setData({ ...data, district: e.target.value })} />
            </Field>
            <Field label="RG">
              <Input value={data.rg} onChange={(e) => setData({ ...data, rg: e.target.value })} />
            </Field>
            <Field label="CPF" className="md:col-span-2">
              <Input value={data.cpf} onChange={(e) => setData({ ...data, cpf: e.target.value })} />
            </Field>
          </div>

          <DialogFooter className="border-t px-6 py-4 sm:justify-between">
            <Button variant="secondary" onClick={() => setOpen(false)} className="bg-gray-200 text-gray-700 hover:bg-gray-300 min-w-[120px]">
              Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-rose-500 hover:bg-rose-600 text-white min-w-[160px]">
              Salvar Cliente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <Label className="text-sm font-semibold">{label}</Label>
      {children}
    </div>
  );
}
