import { LucideIcon } from "lucide-react";
import IconBadge from "@/components/icon-badge";

interface InfoCardProps {
  icon: LucideIcon;
  label: string;
  numberOfItems: number;
  variant?: "default" | "success";
}

export default function InfoCard({ icon: Icon, label, numberOfItems, variant }: InfoCardProps) {
  return (
    <div className="border rounded-md flex items-center gap-x- p-3">
      <IconBadge icon={Icon} variant={variant} />
      <div className="ml-3">
        <p className="font-medium ">{label}</p>
        <p className="text-sm text-gray-500 ">
          {numberOfItems} {numberOfItems === 1 ? "course" : "courses"}
        </p>
      </div>
    </div>
  );
}
