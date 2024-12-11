"use client";

import ReactConfetti from "react-confetti";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { useWindowSize } from "react-use";

export const ConfettiProvider = () => {
  const confetti = useConfettiStore();
  const { width, height } = useWindowSize();

  if (!confetti.isOpen) return null;

  return (
    <ReactConfetti
      className="z-[100] pointer-events-none"
      width={width}
      height={height}
      numberOfPieces={500}
      recycle={false}
      onConfettiComplete={() => {
        confetti.onClose();
      }}
    />
  );
};
