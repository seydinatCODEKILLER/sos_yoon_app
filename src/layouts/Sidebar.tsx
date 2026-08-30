import { NavLink } from "react-router-dom";
import type { NavItem } from "@/config/navigation";

interface SidebarProps {
  navItems: NavItem[];
}

export function Sidebar({ navItems }: SidebarProps) {
  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-paper/10 bg-ink text-paper">
      <div className="px-5 py-5">
        <span className="font-display text-lg">SOS Yoon</span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-signal text-ink font-medium"
                  : "text-paper/70 hover:bg-paper/10 hover:text-paper"
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
