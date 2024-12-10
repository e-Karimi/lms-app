/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { z } from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, VideoIcon } from "lucide-react";
import toast from "react-hot-toast";

import FileUpload from "@/components/file-upload";
import { MuxData } from "@prisma/client";
import MuxPlayer from "@mux/mux-player-react";

interface ChapterVideoFormProps {
  courseId: string;
  chapterId: string;
  videoUrl: string | null;
  muxData: MuxData | null;
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

export default function ChapterVideoForm({ courseId, chapterId, videoUrl, muxData }: ChapterVideoFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
      toast.success("Chapter updated successfully");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.log("[ChapterTitleForm]=> error:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="flex items-center justify-between font-medium mb-2">
        <span>Chapter Video</span>
        <Button variant="ghost" onClick={() => setIsEditing((prev) => !prev)}>
          {!videoUrl && !isEditing && (
            <>
              <PlusCircle className="w-4 h-4 " />
              Add Video
            </>
          )}
          {videoUrl && !isEditing && (
            <>
              <Pencil className="w-4 h-4 " />
              Edit Video
            </>
          )}
          {isEditing && <>Cancel</>}
        </Button>
      </div>
      <div>
        {!videoUrl && !isEditing && (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <VideoIcon className="h-10 w-10 text-slate-500" />
          </div>
        )}
        {videoUrl && !isEditing && (
          <>
            <div className="relative h-60  w-full aspect-video mt-2">
              <MuxPlayer playbackId={muxData?.playbackId || ""} accentColor="#075985" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Video can take a few minuts to process. Refresh the page if video does not appear
            </p>
          </>
        )}

        {isEditing && (
          <div>
            <FileUpload
              endpoint="chapterVideo"
              onChange={(url) => {
                if (url) {
                  onSubmit({ videoUrl: url });
                }
              }}
            />
            <p className="text-xs text-muted-foreground mt-2">Upload this chapter&lsquo;s video</p>
          </div>
        )}
      </div>
    </div>
  );
}
