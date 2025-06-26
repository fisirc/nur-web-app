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
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { dateToESString } from "@/utils/date-formatter";
import { GitPullRequestArrow } from "lucide-react";
import fuzzyFilter from "@/utils/fuzzy-filter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import statusAttribs from "@/features/functions/utils/status-attribs";
import SortHeader from "@/components/sort-header";
import { Link } from "wouter";

const columns: ColumnDef<FunctionListElem>[] = [
  {
    id: "name",
    sortingFn: "text",
    enableGlobalFilter: true,
    header: ({ column }) => <SortHeader col={column}>Nombre</SortHeader>,
    cell: ({ row }) => (
      <Link href={`/functions/${row.original.id}`}>{row.original.name}</Link>
    ),
  },
  {
    id: "route_path",
    accessorKey: "route_path",
    sortingFn: "text",
    enableColumnFilter: true,
    header: ({ column }) => <SortHeader col={column}>Ruta</SortHeader>,
  },
  {
    id: "status",
    enableSorting: false,
    enableGlobalFilter: false,
    accessorFn: ({ status }) => statusAttribs(status).label,
    header: ({ column }) => <SortHeader col={column}>Despliegue</SortHeader>,
    cell: ({ row }) => {
      const { status } = row.original;
      const { Icon, color, label } = statusAttribs(status);
      return (
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${color}`} />
          <span>{label}</span>
        </div>
      );
    },
  },
  {
    id: "latest_commit",
    accessorKey: "commit_date",
    sortingFn: "datetime",
    enableGlobalFilter: false,
    header: ({ column }) => <SortHeader col={column}>Último commit</SortHeader>,
    cell: ({ row }) => {
      const commit_date = dateToESString(new Date(row.original.commit_date));
      const { commit_desc } = row.original;
      return (
        <div>
          <div className="flex items-center gap-1">
            <GitPullRequestArrow className="text-muted-foreground/50 size-3" />
            <div>{commit_desc}</div>
          </div>
          <div>{commit_date}</div>
        </div>
      );
    },
  },
];

const FunctionsTable = ({ functions }: { functions: FunctionList }) => {
  const table = useReactTable({
    data: functions,
    columns,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
        <Button>¿Cómo crear funciones?</Button>
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
        <h1 className="text-3xl">Funciones</h1>
        <FunctionsTable functions={data} />
      </div>
    </ScrollArea>
  );
};

export default ProjectPanelFunctions;
