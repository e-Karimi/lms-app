"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

type SidebarItemProps = {
  label: string;
  icon: LucideIcon;
  href: string;
};

const SidebarItem = ({ label, icon: Icon, href }: SidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (pathname === "/" && href === "/") || pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <button
      onClick={() => router.push(href)}
      className={cn(
        "flex items-center gap-x-2 text-slatw-500 text-sm font-[500] pl-6 transition-all hover:text-slat-600 hover:bg-slate-300/20",
        isActive && "text-sky-700 bg-sky-200/20 hover:text-sky-700/20 hover:bg-sky-200/20"
      )}
    >
      <div className="flex items-center gap-x-2 py-4 w-full">
        <Icon size={22} className={cn("text-slate-500", isActive && "text-sky-700")} />
        <span>{label}</span>
      </div>
      <div
        className={cn("opacity-0 ml-auto border-2 border-sky-700 h-full transition-all", isActive && "opacity-100")}
      />
    </button>
  );
};

export default SidebarItem;
