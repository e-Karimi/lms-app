import { auth } from "@clerk/nextjs/server";
import db from "@/data/db";
import { redirect } from "next/navigation";

import { DataTable } from "@/components/courses-tabel/data-table";
import { columns } from "@/components/courses-tabel/columns";

export default async function CoursesPage() {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const courses = await db.course.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
      <div className="p-6">
        <h1 className="text-xl font-medium tracking-wider">Courses</h1>
        <div className="mx-auto py-5">
          <DataTable columns={columns} data={courses} />
        </div>
      </div>
    </>
  );
}
