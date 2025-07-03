import type { MountedFunction } from "../types";
import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import fuzzyFilter from "@/utils/fuzzy-filter";
import { Input } from "@/components/ui/input";
import { Link, useParams } from "wouter";
import RouteNewFunctionButton from "./route-new-function-button";

const MountedFunctions = ({ functions }: { functions: MountedFunction[] }) => {
  const { project_id } = useParams();

  const columns: ColumnDef<MountedFunction>[] = [
    {
      id: "method",
      header: "Método",
      accessorKey: "method_name",
      enableGlobalFilter: false,
    },
    {
      id: "function_name",
      header: "Función",
      accessorKey: "functions.name",
      enableGlobalFilter: true,
      cell: ({ row }) => {
        return (
          <Link
            href={`~/dashboard/project/${project_id as string}/functions/${row.original.function_id}`}
          >
            {row.original.functions.name}
          </Link>
        );
      },
    },
  ];

  const table = useReactTable({
    data: functions,
    columns,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (!functions.length)
    return (
      <div className="size-xs text-muted-foreground flex flex-row items-center justify-center gap-4">
        No hay funciones montadas a esta ruta.
        <RouteNewFunctionButton />
      </div>
    );

  return (
    <div className="flex grow flex-col gap-8">
      <h2 className="text-xl">Funciones montadas</h2>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <Input
            className="w-72"
            placeholder="Busca por nombre de función"
            value={table.getState().globalFilter}
            onChange={(e) => table.setGlobalFilter(String(e.target.value))}
          />
          <RouteNewFunctionButton />
        </div>
        <DataTable table={table} />
      </div>
    </div>
  );
};

export default MountedFunctions;
