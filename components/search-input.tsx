"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

export default function SearchInput() {
  const [value, setValue] = useState("");
  const debounceValue = useDebounce(value);

  const searchparam = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentCategoryId = searchparam.get("categoryId");

  useEffect(() => {
    const url = queryString.stringifyUrl(
      {
        url: pathname,
        query: { categoryId: currentCategoryId, title: debounceValue },
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  }, [debounceValue, currentCategoryId, pathname, router]);

  return (
    <div className="relative ">
      <Search className=" w-4 h-4 absolute top-3 left-3 teat-slate-600" />
      <Input
        className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200 "
        placeholder="Search for a course"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}
