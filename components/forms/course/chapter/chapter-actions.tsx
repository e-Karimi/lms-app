"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import ConfirmModal from "@/components/modals/confirm-modal";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface ChapterActionsProps {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  isPublished: boolean;
}

export default function ChapterActions({ disabled, courseId, chapterId, isPublished }: ChapterActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
      toast.success("Chapter deleted!");
      router.refresh();
      router.push(`/teacher/courses/${courseId}`);
    } catch (error) {
      console.log("[ChapterActions => onDelete]:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onPublish = async () => {
    try {
      setIsLoading(true);
      if(isPublished){
        await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`);
        toast.success("Chapter unpublished!");
      }else{
        await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`);
        toast.success("Chapter published!");
      }
      router.refresh();
      router.push(`/teacher/courses/${courseId}`);
    } catch (error) {
      console.log("[ChapterActions => onPublish]:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button onClick={onPublish} disabled={disabled} variant={`${disabled ?'outline':'default'}`} size="sm" >
        {isPublished ? "unPublish" : "Publish"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button disabled={isLoading} variant="destructive" size="sm">
          <TrashIcon className="w-4 h-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
}
