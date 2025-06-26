import { ArrowUpDown } from "lucide-react";
import { Button } from "./ui/button";
import type { Column } from "@tanstack/react-table";

const SortHeader = ({
  col,
  children,
}: {
  col: Column<any, any>;
  children: React.ReactNode;
}) => (
  <div className="flex items-center gap-1">
    {children}
    <Button
      variant="ghost"
      size="icon"
      onClick={() => col.toggleSorting(col.getIsSorted() === "asc")}
    >
      <ArrowUpDown />
    </Button>
  </div>
);

export default SortHeader;
