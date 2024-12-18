import db from "@/data/db";
import { Course, Purchase } from "@prisma/client";

type PurchaseWithCourse = Purchase & {
  course: Course;
};

const groupByCourse = (purchases: PurchaseWithCourse[]) => {
  const grouped: { [courseTitle: string]: number } = {};

  purchases.map((purchase) => {
    const courseTitle = purchase.course.title;

    if (!grouped[courseTitle]) {
      grouped[courseTitle] = 0;
    }

    grouped[courseTitle] += purchase.course.price!;
  });

  return grouped;
};

export const getAnalytics = async (userId: string) => {
  try {
    const purchases = await db.purchase.findMany({
      where: {
        course: {
          userId,
        },
      },
      include: {
        course: true,
      },
    });

    const groupedEarnings = groupByCourse(purchases);

    const data = Object.entries(groupedEarnings).map(([courseTitle, total]) => {
      return {
        name: courseTitle,
        total: total,
      };
    });

    const totalRevenue = data.reduce((prev, current) => {
      return prev + current.total;
    }, 0);

    const totalSales = purchases.length;

    return {
      data,
      totalRevenue,
      totalSales,
    };
  } catch (error) {
    console.log("[actions/getAnalytics] =>error:", error);
    return {
      data: [],
      totalRevenue: 0,
      totalSales: 0,
    };
  }
};
