"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { z } from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormLabel, FormField, FormItem } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

import { Pencil } from "lucide-react";
import toast from "react-hot-toast";

interface ChapterAccessFormProps {
  courseId: string;
  chapterId: string;
  isFree: boolean;
}

const formSchema = z.object({
  isFree: z.boolean(),
});

export default function ChapterAccessForm({ courseId, chapterId, isFree }: ChapterAccessFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isFree: !!isFree,
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
        <span>Chapter Access </span>
        <Button variant="ghost" onClick={() => setIsEditing((prev) => !prev)}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="w-4 h-4 " />
              Edit access
            </>
          )}
        </Button>
      </div>
      <div>
        {!isEditing ? (
          <p className={cn("text-sm mt-2", !isFree && "text-slate-500 italic")}>
            {isFree ? (
              <span>
                This chapter is <span className="text-sky-600">free</span> for preview
              </span>
            ) : (
              <span>This chapter is not free for preview</span>
            )}
          </p>
        ) : (
          <>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 mt-2">
                <FormField
                  control={form.control}
                  name="isFree"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Check this box if you want to make this chapter <span className="text-sky-600">free</span> for
                          preview
                        </FormLabel>
                      </div>
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
