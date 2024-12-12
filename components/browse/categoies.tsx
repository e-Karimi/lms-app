"use client";

import React from "react";

import type { Category } from "@prisma/client";
import CategoryItem from "@/components/browse/category-item";

import { FcMusic, FcSportsMode } from "react-icons/fc";
import { FaLaptopCode } from "react-icons/fa";
import { TbMathIntegralX } from "react-icons/tb";
import { FaDatabase } from "react-icons/fa6";
import { IconType } from "react-icons/lib";
import { MdOutlineSecurity } from "react-icons/md";
import { FcCommandLine } from "react-icons/fc";
interface CategoiesProps {
  items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
  Backend: FcCommandLine,
  Database: FaDatabase,
  Frontend: FaLaptopCode,
  Math: TbMathIntegralX,
  Music: FcMusic,
  Security: MdOutlineSecurity,
  Sport: FcSportsMode,
};

export default function Categoies({ items }: CategoiesProps) {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {items.map((item) => {
        const icon = iconMap[item.name];
        return <CategoryItem key={item.id} label={item.name} value={item.id} icon={icon} />;
      })}
    </div>
  );
}
