"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, XCircle } from "lucide-react";

import { useConfettiStore } from "@/hooks/use-confetti-store";

import toast from "react-hot-toast";

interface CourseProgressButtonProps {
  chapterId: string;
  courseId: string;
  nextChapterId?: string;
  isCompleted: boolean;
}

export default function CourseProgressButton({
  chapterId,
  courseId,
  nextChapterId,
  isCompleted,
}: CourseProgressButtonProps) {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);

  const Icon = isCompleted ? XCircle : CheckCircle;

  const onClick = async () => {
    try {
      setIsLoading(true);

      await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, { isCompleted: !isCompleted });

      if (!isCompleted && !nextChapterId) {
        confetti.onOpen();
      }

      if (!isCompleted && nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }
      toast.success("Progress updated");
      router.refresh();
    } catch (error) {
      console.log("[courseProgressButton] => error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-3 md:pt-0 w-2/3  md:w-auto  mx-auto md:mx-0">
      <Button onClick={onClick} variant={isCompleted ? "destructive" : "success"} className="w-full">
        {isLoading && <Loader2 className="w-4 h-4  ml-2" />} {isCompleted ? "Not completed" : "Mark as complete"}
        <Icon className="w-4 h-4  ml-2" />
      </Button>
    </div>
  );
}
