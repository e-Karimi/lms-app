import db from "@/data/db";

import type { Category, Course } from "@prisma/client";
import { getProgress } from "@/actions/get-progress";

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

type GetCourses = {
  userId: string;
  title?: string;
  categoryId?: string;
};

export const getCourses = async ({
  userId,
  title,
  categoryId,
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        title: {
          search: title,
        },
        categoryId,
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
        purchases: {
          where: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const coursesWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
      //* set progress to all courses
      courses.map(async (course) => {
        const perogressPercentage = await getProgress(userId, course.id);

        return {
          ...course,
          progress: perogressPercentage,
        };
      })
    );

    return coursesWithProgress;
  } catch (error) {
    console.log("[actions/getCourses] =>error:", error);
    return [];
  }
};



//**** */ When purchase functionality has been implemented

// const coursesWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
//   //* set progress to null if course is not bought ->  if (course.purchases.length === 0) {}
//   courses.map(async (course) => {
//     if (course.purchases.length === 0) {
//       return {
//         ...course,
//         progress: null,
//       };
//     }
//     //* set progress to perogressPercentage if course is buyed
//     const perogressPercentage = await getProgress(userId, course.id);

//     return {
//       ...course,
//       progress: perogressPercentage,
//     };
//   })
// );
