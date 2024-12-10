import db from "@/data/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";
import IconBadge from "@/components/icon-badge";

import ChapterTitleForm from "@/components/forms/course/chapter/chapter-title-form";
import ChapterDescriptionForm from "@/components/forms/course/chapter/chapter-description-form";
import ChapterAccessForm from "@/components/forms/course/chapter/chapter-access-form";
import ChapterVideoForm from "@/components/forms/course/chapter/chapter-video-form";
import ChapterActions from "@/components/forms/course/chapter/chapter-actions";
import Banner from "@/components/banner";

export default async function ChapterIdPage({ params }: { params: { courseId: string; chapterId: string } }) {
  const { userId } = await auth();
  const { courseId, chapterId } = params;

  if (!userId) {
    return redirect("/");
  }

  const chapter = await db.chapter.findUnique({
    where: {
      id: chapterId,
      courseId,
    },
    include: {
      muxData: true,
    },
  });

  if (!chapter) {
    return redirect("/");
  }

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];
  const totalFeilds = requiredFields.length;
  const completedFeilds = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFeilds}/${totalFeilds})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!chapter.isPublished && (
        <Banner label="This chapter is unpublished, It will not visible in the course" variant="warning" />
      )}

      <div className="p-6">
        <div className="flex items-center justify-center">
          <div className="w-full">
            <Link
              href={`/teacher/courses/${params.courseId}`}
              className="flex items-center text-sm hovr:opacity-75 transition mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to course set up
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Chapter Creation</h1>
                <span className="text-sm text-slate-700"> Complete all feilds {completionText}</span>
              </div>
              <ChapterActions
                disabled={!isComplete}
                courseId={courseId}
                chapterId={chapterId}
                isPublished={chapter.isPublished}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl"> Customize your chapter</h2>
              </div>
              <ChapterTitleForm courseId={courseId} chapterId={chapterId} title={chapter.title} />
              <ChapterDescriptionForm courseId={courseId} chapterId={chapterId} description={chapter.description} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Eye} />
                <h2 className="text-xl"> Access Settings</h2>
              </div>
              <ChapterAccessForm courseId={courseId} chapterId={chapterId} isFree={chapter.isFree} />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Video} />
                <h2 className="text-xl"> Add a Video</h2>
              </div>
              <ChapterVideoForm
                courseId={courseId}
                chapterId={chapterId}
                videoUrl={chapter.videoUrl}
                muxData={chapter.muxData}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
