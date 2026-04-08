"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  BookCheck,
  Users,
  Sword,
  PanelBottom,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";





interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
}

const NavItem = ({ to, icon: Icon, label, isActive }: NavItemProps) => (
  <Link href={to} className="w-full">
    <div
      className={cn(
        "flex items-center py-2 px-3 mb-1 rounded-md text-sm cursor-pointer transition-colors",
        isActive
          ? "bg-accent text-accent-foreground"
          : "hover:bg-muted text-foreground/80 hover:text-foreground"
      )}
    >
      <Icon size={18} className="min-w-[18px]" />
      <span className="ml-3 truncate">{label}</span>
    </div>
  </Link>
);

interface NavGroupProps {
  title: string;
  children: React.ReactNode;
}

const NavGroup = ({ title, children }: NavGroupProps) => (
  <div className="mb-6">
    <h2 className="text-xs font-medium text-muted-foreground/80 uppercase tracking-wider mb-2 px-3">
      {title}
    </h2>
    <div className="space-y-1">{children}</div>
  </div>
);

export function Sidebar() {

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const SidebarContent = () => (
    <div className="h-full flex flex-col justify-between py-4">
      <div className="px-3 flex items-center justify-between mb-6">
        <h1 className="text-lg font-bold tracking-tight">SISCAUT</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        <NavGroup title="Geral">
          <NavItem
            to="/inicio/home"
            icon={Home}
            label="Início"
            isActive={pathname === "/inicio/home" || pathname === "/"}
          />
        </NavGroup>

        <NavGroup title="Cautelas">
          <NavItem
            to="/cautelas/novo"
            icon={BookCheck}
            label="Nova Cautela"
            isActive={pathname === "/cautelas/novo"}
          />
          <NavItem
            to="/cautelas"
            icon={BookCheck}
            label="Listar Cautelas"
            isActive={pathname === "/cautelas"}
          />
        </NavGroup>

        <NavGroup title="Militar">
          <NavItem
            to="/militar/novo"
            icon={Users}
            label="Novo Militar"
            isActive={pathname === "/militar/novo"}
          />
          <NavItem
            to="/militar"
            icon={Users}
            label="Listar Militares"
            isActive={pathname === "/militar"}
          />
        </NavGroup>

        <NavGroup title="Armamento">
          <NavItem
            to="/arma/novo"
            icon={Sword}
            label="Nova Arma"
            isActive={pathname === "/arma/novo"}
          />
          <NavItem
            to="/arma"
            icon={Sword}
            label="Listar Armas"
            isActive={pathname === "/arma"}
          />
        </NavGroup>

        <NavGroup title="Coletes">
          <NavItem
            to="/colete/novo"
            icon={Shield}
            label="Novo Colete"
            isActive={pathname === "/colete/novo"}
          />
          <NavItem
            to="/colete"
            icon={Shield}
            label="Listar Coletes"
            isActive={pathname === "/colete"}
          />
        </NavGroup>
      </div>

      <div className="px-3 py-2 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-sm text-muted-foreground hover:text-foreground"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Sair
        </Button>
        <div className="text-xs text-muted-foreground/70">
          Sistema de Cautela de Armamentos v1.0
        </div>
      </div>


    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <PanelBottom className="w-5 h-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] p-0">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-screen max-h-screen overflow-hidden fixed z-20 transition-all border-r w-60">
        <SidebarContent />
      </div>
    </>
  );
}
