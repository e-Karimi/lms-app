"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { z } from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import Editor from "@/components/editor";
import EditorPreview from "@/components/editor-preview";

import { Pencil } from "lucide-react";
import toast from "react-hot-toast";

interface ChapterDescriptionFormProps {
  courseId: string;
  chapterId: string;
  description: string | null;
}

const formSchema = z.object({
  description: z.string().min(1),
});

export default function ChapterDescriptionForm({ courseId, chapterId, description }: ChapterDescriptionFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: description || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

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
        <span>Chapter description</span>
        <Button variant="ghost" onClick={() => setIsEditing((prev) => !prev)}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="w-4 h-4 " />
              Edit description
            </>
          )}
        </Button>
      </div>
      <div>
        {!isEditing ? (
          <div className={cn("text-sm mt-2", !description && "text-slate-500 italic")}>
            {description ? <EditorPreview value={description} /> : "No description"}
          </div>
        ) : (
          <>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 mt-2">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Editor {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isSubmitting || !isValid} className="tracking-wide  font-normal">
                  save
                </Button>
              </form>
            </Form>
          </>
        )}
      </div>
    </div>
  );
}
