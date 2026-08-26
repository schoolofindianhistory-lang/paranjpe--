import { Link } from "@/lib/navigation";
import { ChevronRight } from "lucide-react";

export function Breadcrumb({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav className="text-sm text-foreground/80 flex items-center gap-1 flex-wrap">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {item.to ? (
            <Link to={item.to} className="hover:text-gold transition-colors">{item.label}</Link>
          ) : (
            <span className="text-gold">{item.label}</span>
          )}
          {i < items.length - 1 && <ChevronRight size={14} className="opacity-60" />}
        </span>
      ))}
    </nav>
  );
}
