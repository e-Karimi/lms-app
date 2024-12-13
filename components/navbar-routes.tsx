"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

import SearchInput from "@/components/search-input";

const NavbarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isPlayerPage = pathname?.includes("chapter");
  const isSearchPage = pathname == "/search";

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="flex gap-x-2 ml-auto">
        {isTeacherPage || isPlayerPage ? (
          <Button asChild size="sm" variant="ghost">
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
    </>
  );
};

export default NavbarRoutes;
