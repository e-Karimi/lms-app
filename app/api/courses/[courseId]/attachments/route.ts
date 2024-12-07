import db from "@/data/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export const POST = async (req: Request, { params }: { params: { courseId: string } }) => {
  try {
    const { userId } = await auth();
    const {url} = await req.json();

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

    const attachments = await db.attachment.create({
      data: {
        courseId: params.courseId,
        url,
        name: url.split("/").pop(),
      },
    });

    return NextResponse.json(attachments);
  } catch (error) {
    console.log("[courseId/attachments]-> POST:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
};
