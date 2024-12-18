"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { LogOut, ArrowLeft } from "lucide-react";

import SearchInput from "@/components/search-input";
import { isTeacher } from "@/lib/teacher";

const NavbarRoutes = () => {
  const pathname = usePathname();
  const { userId } = useAuth();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCourseIdPage = pathname?.startsWith("/courses") && !pathname?.includes("/chapters");
  const isSearchPage = pathname == "/search";

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className=" w-full flex items-center justify-between">
        <div className="hidden md:flex gap-x-2 ">
          {isCourseIdPage && (
            <Button asChild size="icon" variant="ghost" title="Back to search">
              <Link href="/search">
                <ArrowLeft className="h-4 w-4 mr-2" />
              </Link>
            </Button>
          )}
        </div>
        <div className="flex gap-x-2 ml-auto md:ml-0 ">
          {isTeacherPage || isCourseIdPage ? (
            <Button asChild size="sm" variant="ghost" title="Back to dashboard">
              <Link href="/">
                <LogOut className="h-4 w-4 mr-2" />
                Exit
              </Link>
            </Button>
          ) : isTeacher(userId) ? (
            <Button asChild size="sm" variant="ghost">
              <Link href="/teacher/courses">Teacher mode</Link>
            </Button>
          ) : null}
          <UserButton />
        </div>
      </div>
    </>
  );
};

export default NavbarRoutes;
