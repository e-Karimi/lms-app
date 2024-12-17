/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { getChapter } from "@/actions/get.chapter";
import Banner from "@/components/banner";
import VideoPlayer from "@/components/video-player";
import CourseEnrollButton from "@/components/course-enroll-button";
import CourseProgressButton from "@/components/course-progress-button";

import { Separator } from "@/components/ui/separator";
import EditorPreview from "@/components/editor-preview";
import Link from "next/link";
import { File } from "lucide-react";

export default async function ChapterIdPage({ params }: { params: { courseId: string; chapterId: string } }) {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const { chapter, course, muxData, attachments, nextChapter, userProgress, purchase } = await getChapter({
    chapterId: params.chapterId,
    courseId: params.courseId,
    userId,
  });

  if (!chapter || !course) {
    return redirect("/");
  }

  const isLocked = !chapter.isFree && !purchase;

  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div>
      <div>{userProgress?.isCompleted && <Banner variant="success" label="You already completed this chapter" />}</div>
      <div>
        {isLocked && <Banner variant="warning" label="You need to purchase this course to watch this chapter" />}
      </div>
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            title={chapter.title}
            chapterId={params.chapterId}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId!}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between p-4">
          <h2 className="text-2xl mb-2 font-semibold">{chapter.title}</h2>
          {purchase || chapter.isFree ? (
            <CourseProgressButton
              chapterId={params.chapterId}
              courseId={params.courseId}
              nextChapterId={nextChapter?.id}
              isCompleted={!!userProgress?.isCompleted}
            />
          ) : (
            <CourseEnrollButton courseId={params.courseId} price={course.price!} />
          )}
        </div>
        <Separator className="mt-2" />
        <div className="">
          <EditorPreview value={chapter.description!} />
        </div>
        {!!attachments?.length && (
          <>
            <Separator />
            <div className="p-4">
              {attachments.map((attachment) => (
                <Link
                  key={attachment.id}
                  href={attachment.url}
                  target="_blank"
                  className="flex item-center p- w-full bg-sky-100 text-slate-700 border rounded-[2px] hover:underline my-2 px-1 py-1 text-sm"
                >
                  <File className="w-4 h-4 mr-2" />
                  <span className="line-clamp-1">{attachment.name}</span>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
