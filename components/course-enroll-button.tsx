"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import toast from "react-hot-toast";

interface CourseEnrollButtonProps {
  courseId: string;
  price: number;
}

export default function CourseEnrollButton({ courseId, price }: CourseEnrollButtonProps) {
  const onClick = () => {
    toast.error("Sorry! this functionalty has not yet implemented");
    console.log("CourseEnrollButton ~ courseId:", courseId);
  };
  return (
    <div className="pt-3 md:pt-0 w-2/3  md:w-auto  mx-auto md:mx-0">
      <Button onClick={onClick} size="sm" className=" w-full">
        Enroll for {formatPrice(price)}
      </Button>
    </div>
  );
}
