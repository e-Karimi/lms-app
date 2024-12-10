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

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId,
      },
    });

    const muxData = await db.muxData.findUnique({
      where: {
        chapterId,
      },
    });


    if (!chapter || !muxData || !chapter.title || !chapter.description || !chapter.videoUrl) {
      return NextResponse.json("Missing required fields", { status: 400 });
    }

    const publishedChapter = await db.chapter.update({
      where: {
        id: chapterId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(publishedChapter);
  } catch (error) {
    console.log("[courseId/chapters/chapterId/publish]-> PATCH:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
};
