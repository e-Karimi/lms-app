import db from "@/data/db";

export const getProgress = async (userId: string, courseId: string): Promise<number> => {
  try {
    const publishedChaptes = await db.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
      select: {
        id: true,
      },
    });

    const publishedChapteIds = publishedChaptes.map((chapter) => chapter.id);

    const validCompletedChapters = await db.userProgress.count({
      where: {
        userId,
        chapterId: {
          in: publishedChapteIds,
        },
        isCompleted: true,
      },
    });

    const perogressPercentage = (validCompletedChapters / publishedChaptes.length) * 100;

    return perogressPercentage;
  } catch (error) {
    console.log("[actions/getProgress] => error:", error);
    return 0;
  }
};
