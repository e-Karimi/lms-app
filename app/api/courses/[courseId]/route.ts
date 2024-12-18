import db from "@/data/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Mux from "@mux/mux-node";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export const PATCH = async (req: Request, { params }: { params: { courseId: string } }) => {
  try {
    const { userId } = await auth();
    const values = await req.json();

    if (!userId) {
      return NextResponse.json("Unathorized", { status: 401 });
    }

    const course = await db.course.update({
      where: {
        id: params.courseId,
        userId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[courseId]-> PATCH:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (req: Request, { params }: { params: { courseId: string } }) => {
  try {
    const { userId } = await auth();
    const { courseId } = params;

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

    //* course with related chapters containing video
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json("Not Found", { status: 404 });
    }

    //*Delete asset from the Mux
    for (const chapter of course.chapters) {
      if (chapter.muxData?.assetId) {
        await mux.video.assets.delete(chapter.muxData.assetId);
      }
    }

    const deletedCourse = await db.course.delete({
      where: {
        id: courseId,
      },
    });

    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.log("[courseId]-> DELETE:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
};
