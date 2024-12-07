import React from "react";
import db from "@/data/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import IconBadge from "@/components/icon-badge";
import { CircleDollarSign, File, LayoutDashboard, ListCheck } from "lucide-react";
import TitleForm from "@/components/forms/title-form";
import DescriptionForm from "@/components/forms/description-form";
import ImageForm from "@/components/forms/image-form";
import CategoryForm from "@/components/forms/category-form";
import PriceForm from "@/components/forms/price-form";
import AttachmentForm from "@/components/forms/attachment-form";

export default async function CourseIdPage({ params }: { params: { courseId: string } }) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!course) {
    redirect("/");
  }

  const { id, title, description, imageUrl, price, categoryId, attachments } = course;

  const requiredFields = [title, description, imageUrl, price, categoryId];
  const totalFeilds = requiredFields.length;
  const completedFeilds = requiredFields.filter(Boolean).length;
  const completionFeilds = `(${completedFeilds}/${totalFeilds})`;

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const categoriesOptions = categories.map((category) => ({ label: category.name, value: category.id }));

  const courseAttachments = attachments.map((attachment) => ({
    id: attachment.id,
    name: attachment.name,
    url: attachment.url,
  }));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course setup</h1>
          <span className="text-sm text-slate-700">Compelet all feilds {completionFeilds}</span>
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
          <ImageForm imageUrl={imageUrl} courseId={id} />
          <CategoryForm options={categoriesOptions} categoryId={categoryId} courseId={id} />
        </div>
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListCheck} />
              <h2 className="text-xl"> Course chapters</h2>
            </div>
            <div className="">CHAPTER</div>
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={CircleDollarSign} />
              <h2 className="text-xl"> Sell your course</h2>
            </div>
            <PriceForm price={price} courseId={id} />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={File} />
              <h2 className="text-xl"> Resorcess & Attachments</h2>
            </div>
            <AttachmentForm attachments={courseAttachments} courseId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}
