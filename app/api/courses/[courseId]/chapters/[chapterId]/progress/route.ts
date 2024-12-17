import db from "@/data/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PUT = async (req: Request, { params }: { params: { courseId: string; chapterId: string } }) => {
  try {
    const { userId } = await auth();
    const { isCompleted } = await req.json();

    if (!userId) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!courseOwner) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const userProgress = await db.userProgress.upsert({
      where: {
        userId_chapterId: {
          userId,
          chapterId: params.chapterId,
        },
      },
      update: {
        isCompleted,
      },
      create: {
        userId,
        chapterId: params.chapterId,
        isCompleted,
      },
    });

    return NextResponse.json(userProgress);
  } catch (error) {
    console.log("[courseId/chapters/chapterId/progress]-> PUT:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
};
