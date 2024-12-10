"use client";

import { useState } from "react";
import { z } from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";

interface PriceFormProps {
  courseId: string;
  price: number | null;
}

const formSchema = z.object({
  price: z.coerce.number(),
});

export default function PriceForm({ courseId, price }: PriceFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: price || 0,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("price updated successfully");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.log("[PriceForm]=> error:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="flex items-center justify-between font-medium mb-2">
        <span>Course price</span>
        <Button variant="ghost" onClick={() => setIsEditing((prev) => !prev)}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="w-4 h-4 " />
              Edit price
            </>
          )}
        </Button>
      </div>
      <div>
        {!isEditing ? (
          <p className={cn("text-sm mt-2", !price && "text-slate-500 italic")}>
            {price ? formatPrice(price) : "No price"}
          </p>
        ) : (
          <>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 mt-2">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          disabled={isSubmitting}
                          placeholder="Set a price for your course"
                        />
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
