import db from "@/data/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export const PATCH = async (req: Request, { params }: { params: { courseId: string } }) => {
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

    //*Check the course whether it has atleast one published chapter or not?
    const hasPublishedChapter = course.chapters.some((chapter) => chapter.isPublished);

    if (
      !course.title ||
      !course.description ||
      !course.imageUrl ||
      !course.price ||
      !course.categoryId ||
      !hasPublishedChapter
    ) {
      return NextResponse.json("Missing required fields", { status: 401 });
    }

    const publishedCourse = await db.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(publishedCourse);
  } catch (error) {
    console.log("[courseId/publish]-> PATCH:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
};
