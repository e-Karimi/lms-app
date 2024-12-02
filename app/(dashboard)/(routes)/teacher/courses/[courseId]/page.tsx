import React from "react";

export default function CourseIdPage({ params }: { params: { courseId: string } }) {
  return <div>CourseIdPage {params.courseId}</div>;
}
