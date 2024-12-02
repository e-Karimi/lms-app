"use client";

import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import toast from "react-hot-toast";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
});

export default function CreateCoursePage() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("onSubmit ~ values:", values);

    try {
      const response = await axios.post("/api/courses", values);
      router.push(`/teacher/courses/${response.data.id}`);
      toast.success("Course created successfully");
    } catch (error) {
      console.log("onSubmit ~ error:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="max-w-5xl max-auto flex md:items-center md:justify-center h-full p-6 ">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Name your course</h1>
        <p className="text-sm text-slate-600 ">
          What would you like to name your course? Don&apos;t worry, you can change this later
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 'Sdvanced web development'" {...field} />
                  </FormControl>
                  <FormDescription>What will you teach in this course?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button type="button" asChild variant="outline" size="sm">
                <Link href="/">Cancel</Link>
              </Button>
              <Button type="submit" disabled={!isValid || isSubmitting} size="sm" variant="default">
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
