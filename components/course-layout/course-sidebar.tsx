import { redirect } from "next/navigation";

import db from "@/data/db";

import { auth } from "@clerk/nextjs/server";
import { Chapter, Course, UserProgress } from "@prisma/client";

import CourseSidebarItem from "@/components/course-layout/course-sidebar-item";
import CourseProgress from "@/components/course-progress";

interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
}

export default async function CourseSidebar({ course, progressCount }: CourseSidebarProps) {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const purchase = await db.purchase.findUnique({
    where: {
      courseId_userId: {
        userId,
        courseId: course.id,
      },
    },
  });

  return (
    <div className="h-full border-r flex-col overflow-y-auto overflow-x-hidden shadow-sm">
      <div className="p-8 flex flex-col border-b">
        <h1 className="text-sm font-semibold">{course.title}</h1>
        {!purchase && (
          <div className="mt-10">
            <CourseProgress variant="success" value={progressCount} size="default" />
          </div>
        )}
      </div>
      <div className="flex flex-col w-full">
        {course.chapters.map((chapter) => {
          return (
            <CourseSidebarItem
              key={chapter.id}
              id={chapter.id}
              courseId={course.id}
              label={chapter.title}
              isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
              isLocked={!chapter.isFree && !purchase}
            />
          );
        })}
      </div>
    </div>
  );
}
