import { Link } from "react-router-dom";
import { Users, FileText, CalendarDays } from "lucide-react";

const tiles = [
  {
    to: "/clientes",
    icon: Users,
    title: "Cadastro de Clientes",
    desc: "Gerencie sua base de clientes",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    to: "/propostas",
    icon: FileText,
    title: "Geração de Propostas",
    desc: "Crie propostas comerciais",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    to: "/agenda",
    icon: CalendarDays,
    title: "Agenda de Eventos",
    desc: "Reservas e equipamentos",
    gradient: "from-fuchsia-500 to-purple-600",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-header text-white shadow-elevated">
        <div className="container py-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">SOU ICE</h1>
          <p className="mt-2 text-white/80">Sistema de gestão completo</p>
        </div>
      </header>

      <main className="container py-16">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {tiles.map(({ to, icon: Icon, title, desc, gradient }) => (
            <Link
              key={to}
              to={to}
              className="group rounded-2xl bg-card p-8 text-center shadow-card transition-all hover:-translate-y-1 hover:shadow-elevated"
            >
              <div
                className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg transition-transform group-hover:scale-110`}
              >
                <Icon className="h-10 w-10" />
              </div>
              <h2 className="text-xl font-bold text-foreground">{title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
