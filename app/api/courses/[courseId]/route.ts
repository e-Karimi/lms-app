import db from "@/data/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export const PATCH = async (req: Request, { params }: { params: { courseId: string } }) => {
  try {
    const { userId } = await auth();
    const values = await req.json();

    if (!userId) {
      return NextResponse.json("Unathorized", { status: 401 });
    }

    await db.course.update({
      where: {
        id: params.courseId,
        userId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json("Title updated successfully");
  } catch (error) {
    console.log("[courseId]-> PATCH:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
};
