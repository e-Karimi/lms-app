/* eslint-disable @typescript-eslint/no-explicit-any */
import db from "@/data/db";
import { Category, Course, Chapter } from "@prisma/client";
import { getProgress } from "@/actions/get-progress";

type CourseWithProgressWithCategory = Course & {
  category: Category;
  chapters: Chapter[];
  progress: number | null;
};

type DashboardCourses = {
  completedCourses: CourseWithProgressWithCategory[];
  courseInProgress: CourseWithProgressWithCategory[];
};

export const getDashboardCourses = async (userId: string): Promise<DashboardCourses> => {
  try {
    const purchasedCourses = await db.purchase.findMany({
      where: {
        userId,
      },
      select: {
        course: {
          include: {
            category: true,
            chapters: {
              where: {
                isPublished: true,
              },
            },
          },
        },
      },
    });

    const courses = purchasedCourses.map(
      (purchasedCourse) => purchasedCourse.course
    ) as CourseWithProgressWithCategory[];

    for (const course of courses) {
      const progress = await getProgress(userId, course.id);
      course["progress"] = progress;
    }

    const completedCourses = courses.filter((course) => course.progress === 100);
    const courseInProgress = courses.filter((course) => course.progress !== 100);

    return {
      completedCourses,
      courseInProgress,
    };
  } catch (error) {
    console.log("[actions/getDashboardCourses] =>error:", error);
    return {
      completedCourses: [],
      courseInProgress: [],
    };
  }
};
