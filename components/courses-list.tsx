import { Category, Course } from "@prisma/client";
import CourseCard from "@/components/course-card";

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

interface CoursesListProps {
  courses: CourseWithProgressWithCategory[];
}

export default function CoursesList({ courses }: CoursesListProps) {

  return (
    <div>
      {courses.length === 0 ? (
        <div className="text-center text-sm text-muted-foreground mt-10">No Courses found</div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-col-4 gap-4">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              imageUrl={course.imageUrl!}
              chaptersLength={course.chapters.length}
              price={course.price!}
              progress={course.progress}
              category={course?.category?.name}
            />
          ))}
        </div>
      )}
    </div>
  );
}
