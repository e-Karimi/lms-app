import db from "@/data/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export const DELETE = async (req: Request, { params }: { params: { courseId: string; attachmentId: string } }) => {
  try {
    const { userId } = await auth();

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

    const attachment = await db.attachment.delete({
      where: {
        id: params.attachmentId,
        courseId: params.courseId,
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.log("[courseId/attachments/attachmentId]-> DELET:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
};
