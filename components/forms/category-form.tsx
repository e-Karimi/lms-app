"use client";

import { useState } from "react";
import { z } from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface CategoryFormProps {
  courseId: string;
  categoryId: string | null;
  options: { label: string; value: string }[];
}

const formSchema = z.object({
  categoryId: z.string(),
});

export default function CategoryForm({ courseId, categoryId, options }: CategoryFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: categoryId || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("category updated successfully");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.log("[CategoryForm]=> error:", error);
      toast.error("Something went wrong");
    }
  };

  const selectedCategory = options.find((option) => option.value === categoryId);

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="flex items-center justify-between font-medium mb-2">
        <span>Course category</span>
        <Button variant="ghost" onClick={() => setIsEditing((prev) => !prev)}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="w-4 h-4 " />
              Edit category
            </>
          )}
        </Button>
      </div>
      <div>
        {!isEditing ? (
          <p className={cn("text-sm mt-2", !categoryId && "text-slate-500 italic")}>
            {selectedCategory?.label || "No category"}
          </p>
        ) : (
          <>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 mt-2">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Combobox {...field} options={options} />
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
