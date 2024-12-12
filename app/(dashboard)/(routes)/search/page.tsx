import db from "@/data/db";
import Categoies from "@/components/browse/categoies";
import SearchInput from "@/components/search-input";

export default async function searchPage() {
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
  // function

  return (
    <>
      <div className="px-6 pt-6 md:mb-0 block md:hidden">
        <SearchInput />
      </div>
      <div className="p-6">
        <Categoies items={categories} />
      </div>
    </>
  );
}
