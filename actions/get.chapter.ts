import db from "@/data/db";
import { Chapter, Attachment } from "@prisma/client";

interface GetChapterProps {
  chapterId: string;
  courseId: string;
  userId: string;
}

export const getChapter = async ({ chapterId, courseId, userId }: GetChapterProps) => {
  try {
    //* Whether or not use has bought the course?
    const purchase = await db.purchase.findUnique({
      where: {
        courseId_userId: {
          courseId,
          userId,
        },
      },
    });

    //*Get price of the course
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
      select: {
        price: true,
      },
    });

    const chapter = await db.chapter.findUnique({
      where: {
        courseId: courseId,
        id: chapterId,
        isPublished: true,
      },
    });

    if (!course || !chapter) {
      throw new Error("Course or chapter not found");
    }

    let muxData = null;
    let attachments: Attachment[] = [];
    let nextChapter: Chapter | null = null;

    
    //* If the strip functionality has been implemented, the right if(){} is : if(purchase){}
    if (!purchase || chapter.isFree) {
      attachments = await db.attachment.findMany({
        where: {
          courseId,
        },
      });
    }

    if (purchase || chapter.isFree) {
      muxData = await db.muxData.findUnique({
        where: {
          chapterId,
        },
      });

      nextChapter = await db.chapter.findFirst({
        where: {
          courseId: courseId,
          isPublished: true,
          position: {
            gt: chapter?.position,
          },
        },
        orderBy: {
          position: "asc",
        },
      });
    }

    const userProgress = await db.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
    });

    return {
      chapter,
      course,
      muxData,
      attachments,
      nextChapter,
      userProgress,
      purchase,
    };
  } catch (error) {
    console.log("[actions/getChapter] =>error:", error);
    return {
      chapter: null,
      course: null,
      muxData: null,
      attachments: null,
      nextChapter: null,
      userProgress: null,
      purchase: null,
    };
  }
};
