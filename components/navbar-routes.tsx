"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { LogOut, ArrowLeft } from "lucide-react";

import SearchInput from "@/components/search-input";

const NavbarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname?.startsWith("/courses");
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
          {isCoursePage && (
            <Button asChild size="icon" variant="ghost" title="Back to search">
              <Link href="/search">
                <ArrowLeft className="h-4 w-4 mr-2" />
              </Link>
            </Button>
          )}
        </div>
        <div className="flex gap-x-2 ml-auto md:ml-0 ">
          {isTeacherPage || isCoursePage ? (
            <Button asChild size="sm" variant="ghost" title="Back to dashboard">
              <Link href="/">
                <LogOut className="h-4 w-4 mr-2" />
                Exit
              </Link>
            </Button>
          ) : (
            <Button asChild size="sm" variant="ghost">
              <Link href="/teacher/courses">Teacher mode</Link>
            </Button>
          )}
          <UserButton />
        </div>
      </div>
    </>
  );
};

export default NavbarRoutes;
