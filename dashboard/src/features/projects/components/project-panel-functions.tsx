import QueryHandler from "@/components/query-handler";
import useCurrentProjectFunctions from "../hooks/use-current-project-functions";
import { ScrollArea } from "@/components/ui/scroll-area";
import type {
  FunctionList,
  FunctionListElem,
} from "@/features/functions/types";
import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { dateToESString } from "@/utils/date-formatter";
import { GitPullRequestArrow } from "lucide-react";
import fuzzyFilter from "@/utils/fuzzy-filter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";

const columns: ColumnDef<FunctionListElem>[] = [
  {
    id: "name",
    header: "Nombre",
    accessorKey: "name",
    enableGlobalFilter: true,
  },
  {
    id: "latest_commit",
    header: "Último commit",
    accessorKey: "commit_date",
    cell: ({ row }) => {
      const commit_date = dateToESString(new Date(row.original.commit_date));
      const { commit_desc } = row.original;
      return (
        <div>
          <div>{commit_date}</div>
          <div className="flex items-center gap-2">
            <GitPullRequestArrow size={16} />
            <div>{commit_desc}</div>
          </div>
        </div>
      );
    },
    enableGlobalFilter: false,
  },
];

const FunctionsTable = ({ functions }: { functions: FunctionList }) => {
  const table = useReactTable({
    data: functions,
    columns,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="flex grow flex-col gap-4">
      <div className="flex justify-between">
        <Input
          className="w-72"
          placeholder="Busca por nombre de función o ruta"
          value={table.getState().globalFilter}
          onChange={(e) => table.setGlobalFilter(String(e.target.value))}
        />
        <Button>Invitar miembros</Button>
      </div>
      <DataTable table={table} />
    </div>
  );
};

const ProjectPanelFunctions = () => {
  const functionsQr = useCurrentProjectFunctions();
  const { data } = functionsQr;

  if (!data) return <QueryHandler qr={functionsQr} />;

  return (
    <ScrollArea className="grow">
      <div className="flex grow flex-col gap-8 p-8">
        <h1 className="text-3xl">Equipo</h1>
        <FunctionsTable functions={data} />
      </div>
    </ScrollArea>
  );
};

export default ProjectPanelFunctions;
