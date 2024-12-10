import db from "@/data/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export const PATCH = async (req: Request, { params }: { params: { courseId: string; chapterId: string } }) => {
  try {
    const { userId } = await auth();
    const { courseId, chapterId } = params;

    if (!userId) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });

    if (!courseOwner) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const unPublishedChapter = await db.chapter.update({
      where: {
        id: chapterId,
      },
      data: {
        isPublished: false,
      },
    });

    //* Check whether the chapter we just unpublished was the only published chapter in this entire course  or not? =>  If it is,we also have to unpublish the entire course.
    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
    });

    if (!publishedChaptersInCourse.length) {
      await db.course.update({
        where: {
          id: courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(unPublishedChapter);
  } catch (error) {
    console.log("[courseId/chapters/chapterId/publish]-> PATCH:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
};
