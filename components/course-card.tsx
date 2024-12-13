import Image from "next/image";
import Link from "next/link";
import IconBadge from "./icon-badge";
import { BookOpen } from "lucide-react";
import { formatPrice } from "@/lib/format";

type CourseCardProps = {
  id: string;
  title: string;
  imageUrl: string;
  chaptersLength: number;
  price: number;
  progress: number | null;
  category: string | undefined;
};

export default function CourseCard({
  id,
  title,
  imageUrl,
  chaptersLength,
  price,
  progress,
  category,
}: CourseCardProps) {
  return (
    <Link href={`courses/${id}`}>
      <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p- h-full">
        <div className="relative w-full aspect-video rounded-md  overflow-hidden">
          <Image src={imageUrl} fill sizes="50" priority className="object-cover" alt={title} />
        </div>
        <div className="flex flex-col pt-">
          <h3 className="text-lg md:text-base font-medium group-hover:text-sky-70 transition line-clamp-2">{title}</h3>
          <p className="text-xs text-muted-foreground">{category}</p>
          <div className="my- flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge size="sm" icon={BookOpen} />
              <span className="">
                {chaptersLength}
                {chaptersLength === 1 ? "Chapter" : "Chaptes"}
              </span>
            </div>
          </div>
          {progress === null ? (
            <p className="tetx-md md:text-sm font-medium text-slate-700">{formatPrice(price)}</p>
          ) : (
            <div className=""> ProgressBar</div>
          )}
        </div>
      </div>
    </Link>
  );
}
