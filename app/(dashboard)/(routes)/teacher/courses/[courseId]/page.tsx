import React from "react";
import db from "@/data/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import IconBadge from "@/components/icon-badge";
import { LayoutDashboard } from "lucide-react";
import TitleForm from "@/components/forms/title-form";
import DescriptionForm from "@/components/forms/description-form";

export default async function CourseIdPage({ params }: { params: { courseId: string } }) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
  });

  if (!course) {
    redirect("/");
  }

  const { id, title, description, imageUrl, price, categoryId } = course;

  const requiredFields = [title, description, imageUrl, price, categoryId];
  const totalFeilds = requiredFields.length;
  const completedFeilds = requiredFields.filter(Boolean).length;
  const completionFeilds = `(${completedFeilds}/${totalFeilds})`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course setup</h1>
          <span className="text-sm text-slate-700">Complet all feilds {completionFeilds}</span>
        </div>
      </div>
      <div className="grid drid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl">Customize your course</h2>
          </div>
          <TitleForm title={title} courseId={id} />
          <DescriptionForm description={description} courseId={id} />
        </div>
      </div>
    </div>
  );
}
