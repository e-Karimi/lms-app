import { Chapter, Course, UserProgress } from "@prisma/client";
import NavbarRoutes from "@/components/navbar-routes";
import CourseMobileSidebar from "@/components/course-layout/course-mobile-sidebar";

interface CourseNavbarProps {
  course: Course & { chapters: (Chapter & { userProgress: UserProgress[] | null })[] };
  progressCount: number;
}

export default function CourseNavbar({ course, progressCount }: CourseNavbarProps) {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <CourseMobileSidebar course={course} progressCount={progressCount} />
      <NavbarRoutes />
    </div>
  );
}
