import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  showBack?: boolean;
}

export function PageHeader({ title, subtitle, actions, showBack = true }: Props) {
  return (
    <header className="bg-gradient-header text-white shadow-elevated">
      <div className="container py-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            {showBack && (
              <Link to="/">
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 hover:text-white"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
            )}
            <div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
              {subtitle && <p className="mt-1 text-white/80">{subtitle}</p>}
            </div>
          </div>
          {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </div>
      </div>
    </header>
  );
}
