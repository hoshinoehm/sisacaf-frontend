"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideSidebar = pathname === "/login";

  return (
    <>
      {!hideSidebar && <Sidebar />}
      <div className={cn({ "md:ml-60": !hideSidebar }, "p-4")}>
        {children}
      </div>
      <Toaster richColors />
    </>
  );
}
