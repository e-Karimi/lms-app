import { Chapter, Course, UserProgress } from "@prisma/client";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

import CourseSidebar from "@/components/course-layout/course-sidebar";

interface CourseMobileSidebarProps {
  course: Course & { chapters: (Chapter & { userProgress: UserProgress[] | null })[] };
  progressCount: number;
}

export default function CourseMobileSidebar({ course, progressCount }: CourseMobileSidebarProps) {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="bg-white p-0 w-72">
        <VisuallyHidden.Root>
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>Menu Description </SheetDescription>
          </SheetHeader>
        </VisuallyHidden.Root>
        <CourseSidebar course={course} progressCount={progressCount} />
      </SheetContent>
    </Sheet>
  );
}
