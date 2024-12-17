/* eslint-disable @typescript-eslint/no-unused-vars */
import db from "@/data/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export const PATCH = async (req: Request, { params }: { params: { courseId: string; chapterId: string } }) => {
  try {
    const { userId } = await auth();
    const { courseId, chapterId } = params;
    const { isPublished, ...values } = await req.json();

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

    const chapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId,
      },
      data: {
        ...values,
      },
    });

    //* handle video upload
    if (values.video) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId,
        },
      });

      if (existingMuxData) {
        await mux.video.assets.delete(existingMuxData.assetId);

        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }

      const asset = await mux.video.assets.create({
        input: values.videoUrl,
        test: false,
        playback_policy: ["public"],
      });

      await db.muxData.create({
        data: {
          chapterId,
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0]?.id,
        },
      });
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[courseId/chapters/chapterId]-> PATCH:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (req: Request, { params }: { params: { courseId: string; chapterId: string } }) => {
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

    if (!chapter) {
      return NextResponse.json("Not Found", { status: 404 });
    }
    //* delete related videos to the chapter
    if (chapter.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId,
        },
      });

      if (existingMuxData) {
        await mux.video.assets.delete(existingMuxData.assetId);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }
    }

    //* delete target chapter
    const deletedChapter = await db.chapter.delete({
      where: {
        id: chapterId,
        courseId,
      },
    });

    //* Because the condition of publishing a course is to have atleast one published chapter,when we delete a chapter, we have to check whether related course has any other published chapters or not? If the course has not any active chapters, this course has to be unpublished.

    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
    });

    //*Unpublishing related Course
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

    return NextResponse.json(deletedChapter);
  } catch (error) {
    console.log("[courseId/chapters/chapterId]-> DELETE:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
};
