import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import CoursesList from "@/components/courses-list";
import { getDashboardCourses } from "@/actions/get-ashboard-courses";
import InfoCard from "@/components/info-card";
import { CheckCircle, Clock } from "lucide-react";

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const { completedCourses, courseInProgress } = await getDashboardCourses(userId);

  return (
    <div className="p-6 space-y-4 ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard icon={Clock} label="In Progress" numberOfItems={courseInProgress.length} variant="default" />
        <InfoCard icon={CheckCircle} label="Completed" numberOfItems={completedCourses.length} variant="success" />
      </div>
      <CoursesList courses={[...courseInProgress, ...completedCourses]} />
    </div>
  );
}
