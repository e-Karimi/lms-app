/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { z } from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { File, Loader2, PlusCircle, X } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import FileUpload from "@/components/file-upload";

interface AttachmentFormProps {
  courseId: string;
  attachments: {
    name: string;
    id: string;
    url: string;
  }[];
}

const formSchema = z.object({
  url: z.string().min(1),
});

export default function AttachmentForm({ courseId, attachments }: AttachmentFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values);
      toast.success("attachment added successfully");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.log("[AttachmentForm]=> error:", error);
      toast.error("Something went wrong");
    }
  };

  const onDelete = async (attachmentId: string) => {
    try {
      setDeletingId(attachmentId);

      await axios.delete(`/api/courses/${courseId}/attachments/${attachmentId}`);
      toast.success("Attachment deleted");
      router.refresh();
    } catch (error) {
      console.log("[AttachmentForm]=> error:", error);
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="flex items-center justify-between font-medium mb-2">
        <span>Course Attachmens</span>
        <Button variant="ghost" onClick={() => setIsEditing((prev) => !prev)}>
          {!isEditing && (
            <>
              <PlusCircle className="w-4 h-4 " />
              Add a file
            </>
          )}
          {isEditing && <>Cancel</>}
        </Button>
      </div>
      <div>
        {!isEditing ? (
          <div>
            {attachments.length === 0 ? (
              <p className="text-slate-500 italic text-sm ">No Attachments yet</p>
            ) : (
              <div className="space-y-2">
                {attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center p-3 w-full bg-sky-100 border border-sky-200 text-sky-700 rounded-md  "
                  >
                    <File className="w-4 h-4 mr-2 flex-shrink-0" />
                    <p className="text-xs line-clamp-1"> {attachment.name}</p>
                    {deletingId === attachment.id ? (
                      <div>
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                    ) : (
                      <Button
                        onClick={() => onDelete(attachment.id)}
                        variant="ghost"
                        className="ml-auto hover:bg-sky-100 transition"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <FileUpload
              endpoint="courseAttachment"
              onChange={(url) => {
                if (url) {
                  onSubmit({ url });
                }
              }}
            />
            <p className="text-xs text-muted-foreground mt-4">
              Add anything your students might need to complete the course.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
