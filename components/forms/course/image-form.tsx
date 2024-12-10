/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { z } from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import FileUpload from "@/components/file-upload";
import Image from "next/image";

interface ImageFormProps {
  courseId: string;
  imageUrl: string | null;
}

const formSchema = z.object({
  imageUrl: z.string().min(1, { message: "Image is required" }),
});

export default function ImageForm({ courseId, imageUrl }: ImageFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("image updated successfully");

      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.log("[ImageForm]=> error:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="flex items-center justify-between font-medium mb-2">
        <span>Course Image</span>
        <Button variant="ghost" onClick={() => setIsEditing((prev) => !prev)}>
          {!imageUrl && !isEditing && (
            <>
              <PlusCircle className="w-4 h-4 " />
              Add image
            </>
          )}
          {imageUrl && !isEditing && (
            <>
              <Pencil className="w-4 h-4 " />
              Edit image
            </>
          )}
          {isEditing && <>Cancel</>}
        </Button>
      </div>
      <div>
        {!imageUrl && !isEditing && (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        )}
        {imageUrl && !isEditing && (
          <div className="relative h-60  w-full aspect-video mt-2">
            <Image
              src={imageUrl}
              fill
              sizes="40vw"
              priority
              className="object-cover rounded-md"
              alt="apload Course Image"
            />
          </div>
        )}

        {isEditing && (
          <div>
            <FileUpload
              endpoint="courseImage"
              onChange={(url) => {
                if (url) {
                  onSubmit({ imageUrl: url });
                }
              }}
            />
            <p className="text-xs text-muted-foreground mt-4">16:9 aspect ratio recommended</p>
          </div>
        )}
      </div>
    </div>
  );
}
