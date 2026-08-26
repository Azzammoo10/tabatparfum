import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Bot,
  Wallet,
  Flame,
  Sun,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import ThemeToggle from "@/components/ThemeToggle";

const NAV = [
  { to: "/admin", label: "Tableau de bord", icon: LayoutDashboard, end: true },
  { to: "/admin/produits", label: "Produits", icon: Package },
  { to: "/admin/bestsellers", label: "Best Sellers", icon: Flame },
  { to: "/admin/saison", label: "Parfums de Saison", icon: Sun },
  { to: "/admin/commandes", label: "Commandes", icon: ShoppingBag },
  { to: "/admin/finances", label: "Finances", icon: Wallet },
  { to: "/admin/clients", label: "Clients", icon: Users },
  { to: "/admin/bot", label: "Assistant", icon: Bot },
  { to: "/admin/parametres", label: "Paramètres", icon: Settings },
];

const TITLES: Record<string, string> = {
  "/admin": "Tableau de bord",
  "/admin/produits": "Produits",
  "/admin/bestsellers": "Gestion des Best Sellers",
  "/admin/saison": "Gestion des Parfums de Saison",
  "/admin/commandes": "Commandes",
  "/admin/finances": "Finances",
  "/admin/clients": "Clients",
  "/admin/bot": "Assistant virtuel",
  "/admin/parametres": "Paramètres",
};


const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const title = TITLES[location.pathname] || "Admin";

  const logout = () => {
    localStorage.removeItem("tabat_admin_session");
    supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  // Sidebar uses fixed dark palette in BOTH themes (per spec).
  const SidebarContent = (
    <div className="flex flex-col h-full bg-[#111827] text-[#F9FAFB]">
      <div className="px-6 py-6 border-b border-white/5">
        <div className="font-brand text-xl tracking-wide text-[#C9A96E]">TABAT</div>
        <div className="text-xs text-white/50 mt-1">Admin Panel</div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-[#C9A96E] text-[#111827] font-medium"
                  : "text-[#F9FAFB]/80 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-white/5">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-[#F9FAFB]/80 hover:bg-white/5 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0F0F0F] font-sans text-[#111827] dark:text-[#F9FAFB]">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-60 z-30">
        {SidebarContent}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="md:hidden fixed inset-y-0 left-0 w-60 z-50">
            {SidebarContent}
          </aside>
        </>
      )}

      <div className="md:ml-60 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-white dark:bg-[#1A1A1A] border-b border-[#E5E7EB] dark:border-[#2A2A2A] h-14 flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 -ml-2 rounded hover:bg-[#F8F9FA] dark:hover:bg-white/5"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-base md:text-lg font-medium">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle className="text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-white hover:bg-[#F8F9FA] dark:hover:bg-white/5" />
            <div className="hidden sm:block text-right">
              <div className="text-sm font-medium leading-tight">Admin</div>
              <div className="text-xs text-[#6B7280] dark:text-[#9CA3AF] leading-tight">admin@tabatperfume.com</div>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#111827] dark:bg-[#C9A96E] text-white dark:text-[#111827] flex items-center justify-center text-sm font-medium">
              A
            </div>
          </div>
        </header>

        <main className="flex-1 p-3 sm:p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
