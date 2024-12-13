"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

import { IconType } from "react-icons/lib";
import queryString from "query-string";

interface CategoryItemProps {
  label: string;
  value?: string;
  icon?: IconType;
}

export default function CategoryItem({ label, value, icon: Icon }: CategoryItemProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParam = useSearchParams();

  const currentCategoryId = searchParam.get("categoryId");
  const currentTitle = searchParam.get("title");

  const isSelected = currentCategoryId === value;

  const onClick = () => {
    const url = queryString.stringifyUrl(
      {
        url: pathname,
        query: { title: currentTitle, categoryId: isSelected ? null : value },
      },
      { skipNull: true, skipEmptyString: true }
    );

    router.push(url);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "py-2 px-3 text-sm border border-slate-200 rounded-full flex items-centergap-x-1 hover:border-sky-700 transition",
        isSelected && " border-2 border-indigo-700/30 bg-indigo-400/20 text-indigo-800/90"
      )}
      type="button"
    >
      {Icon && <Icon size={20} />}
      <span className="truncate ml-2">{label}</span>
    </button>
  );
}
