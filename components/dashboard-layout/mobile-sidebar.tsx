import { Menu } from "lucide-react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Sheet, SheetContent, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import Sidebar from "@/components/dashboard-layout/sidebr";

const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-white">
        <VisuallyHidden.Root>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>Menu Description </SheetDescription>
        </VisuallyHidden.Root>
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
