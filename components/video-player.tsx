/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";
import { cn } from "@/lib/utils";
import { useConfettiStore } from "@/hooks/use-confetti-store";

import { Loader2, Lock } from "lucide-react";
import { toast } from "react-hot-toast";

interface VideoPlayerProps {
  title: string;
  chapterId: string;
  courseId: string;
  nextChapterId?: string;
  playbackId: string;
  isLocked: boolean;
  completeOnEnd: boolean;
}

export default function VideoPlayer({
  title,
  chapterId,
  courseId,
  nextChapterId,
  playbackId,
  isLocked,
  completeOnEnd,
}: VideoPlayerProps) {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const confetti = useConfettiStore();

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, { isCompleted: true });
      }

      if (!nextChapterId) {
        confetti.onOpen();
      }

      toast.success("Progress updated");
      router.refresh();

      if (nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }
    } catch (error) {
      console.log("[VideoPlayer -> onEnd] ~ error:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="relative aspect-video">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="w-8 h-8 animate-spin text-secondary" />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-y-2 bg-slate-800 text-secondary">
          <Lock className="w-8 h-8 " />
          <p className="text-sm">This chapter is Locked</p>
        </div>
      )}
      {!isLocked && (
        <MuxPlayer
          title={title}
          playbackId={playbackId}
          onCanPlay={() => setIsReady(true)}
          onEnded={onEnd}
          autoPlay
          className={cn(!isReady && "hidden")}
        />
      )}
    </div>
  );
}
