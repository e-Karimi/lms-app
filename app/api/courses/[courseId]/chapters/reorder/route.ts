import db from "@/data/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PUT = async (req: Request, { params }: { params: { courseId: string } }) => {
  try {
    const { userId } = await auth();
    const { updatedChapters } = await req.json();

    if (!userId) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        userId,
        id: params.courseId,
      },
    });

    if (!courseOwner) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    for (const chapter of updatedChapters) {
      await db.chapter.update({
        where: { id: chapter.id },
        data: {
          position: chapter.position,
        },
      });
    }
    return NextResponse.json(updatedChapters);
  } catch (error) {
    console.log("[courseId/chapters/reorder]-> PUT:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
};
