import db from "@/data/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { isTeacher } from "@/lib/teacher";

export const POST = async (req: Request) => {
  try {
    const { title } = await req.json();
    const { userId } = await auth();

    if (!userId || !isTeacher(userId)) {
      return NextResponse.json("Unathorized", { status: 401 });
    }

    const course = await db.course.create({
      data: {
        userId,
        title,
      },
    });
    return NextResponse.json(course);
  } catch (error) {
    console.log("[courses]-> POST:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
};
