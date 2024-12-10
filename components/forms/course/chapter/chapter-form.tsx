"use client";

import { useState } from "react";
import { z } from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "../../../ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Loader2, PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Chapter } from "@prisma/client";

import ChaptersList from "@/components/forms/course/chapter/chapters-list";

interface ChapterFormProps {
  courseId: string;
  chapters: Chapter[];
}

const formSchema = z.object({
  title: z.string().min(1),
});

export default function ChapterForm({ courseId, chapters }: ChapterFormProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, values);
      toast.success("chapter created successfully");
      setIsCreating(false);
      router.refresh();
    } catch (error) {
      console.log("[ChapterForm]=> error:", error);
      toast.error("Something went wrong");
    }
  };

  const onReorder = async (updatedData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);
      await axios.put(`/api/courses/${courseId}/chapters/reorder`, { updatedChapters: updatedData });
      toast.success("Chapter reordered");
    } catch (error) {
      console.log("ChapterForm ~ onReorder => error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  const onEdit = async (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${id}`);
  };

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      {isUpdating && (
        <div className="absolute top-0 right-0 w-full h-full bg-slate-500/20  flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-sky-700" />
        </div>
      )}
      <div className="flex items-center justify-between font-medium mb-2">
        <span>Course Chapters</span>
        <Button variant="ghost" onClick={() => setIsCreating((prev) => !prev)}>
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="w-4 h-4 " />
              Edit Chapter
            </>
          )}
        </Button>
      </div>
      <div>
        {!isCreating ? (
          <div>
            {chapters.length === 0 ? (
              <p className={cn("text-xs mt-2", chapters.length === 0 && "text-slate-500 italic")}>No chapters yet</p>
            ) : (
              <ChaptersList items={chapters || []} onEdit={onEdit} onReorder={onReorder} />
            )}
          </div>
        ) : (
          <>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 mt-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} disabled={isSubmitting} placeholder="e.g. 'Intoduction to the course' " />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isSubmitting || !isValid} className="tracking-wide  font-normal">
                  Create
                </Button>
              </form>
            </Form>
          </>
        )}
      </div>
    </div>
  );
}
