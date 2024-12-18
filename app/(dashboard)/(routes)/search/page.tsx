import db from "@/data/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import Categoies from "@/components/categoies";
import SearchInput from "@/components/search-input";
import { getCourses } from "@/actions/get-courses";
import CoursesList from "@/components/courses-list";

type SearchPageProps = {
  searchParams: {
    title: string;
    categoryId: string;
  };
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { userId } = await auth();
  const { title, categoryId } = searchParams;

  if (!userId) {
    return redirect("/");
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const courses = await getCourses({ userId, title, categoryId });

  return (
    <>
      <div className="px-6 pt-6 md:mb-0 block md:hidden">
        <Suspense>
          <SearchInput />
        </Suspense>
      </div>
      <div className="p-6 space-y-5">
        <Categoies items={categories} />
        <CoursesList courses={courses} />
      </div>
    </>
  );
}
