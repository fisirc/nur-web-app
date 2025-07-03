import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useCurrentProjectFunctions from "@/features/projects/hooks/use-current-project-functions";
import QueryHandler from "@/components/query-handler";
import type {
  FunctionList,
  FunctionListElem,
} from "@/features/functions/types";
import statusAttribs from "@/features/functions/utils/status-attribs";
import SortHeader from "@/components/sort-header";
import { GitPullRequestArrow } from "lucide-react";
import { dateToESString } from "@/utils/date-formatter";
import methods from "@/constants/methods";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type RowSelectionState,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import fuzzyFilter from "@/utils/fuzzy-filter";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { useState } from "react";
import useMountFunction from "../hooks/use-mount-function";
import useCurrentRoute from "../hooks/use-current-route";
import type { ApiRoute } from "../types";

const ModalContent = ({
  functions,
  route,
  onClose,
}: {
  functions: FunctionList;
  route: ApiRoute;
  onClose: () => void;
}) => {
  const [functionSelection, setFunctionSelection] = useState<RowSelectionState>(
    {},
  );
  const [selectedMethod, setSelectedMethod] = useState<string>(methods[0]);

  const functionsCols: ColumnDef<FunctionListElem>[] = [
    {
      id: "name",
      accessorKey: "name",
      sortingFn: "text",
      enableGlobalFilter: true,
      header: ({ column }) => <SortHeader col={column}>Nombre</SortHeader>,
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
      header: ({ column }) => (
        <SortHeader col={column}>Último commit</SortHeader>
      ),
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

  const table = useReactTable<FunctionListElem>({
    data: functions,
    columns: functionsCols,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
    enableMultiRowSelection: false,
    getRowId: (row) => row.id,
    onRowSelectionChange: setFunctionSelection,
    state: { rowSelection: functionSelection },
  });

  const selectedFunctionId = Object.keys(functionSelection)[0];

  const mountFunctionMutation = useMountFunction(
    route.id,
    selectedFunctionId,
    selectedMethod,
  );

  return (
    <>
      <div className="my-2 flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between">
            <Input
              className="w-72"
              placeholder="Busca por nombre de función"
              value={table.getState().globalFilter}
              onChange={(e) => table.setGlobalFilter(String(e.target.value))}
            />
          </div>
          <DataTable className="h-[256px]" table={table} />
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-muted-foreground text-sm">
            Elige un método HTTP
          </div>
          <Tabs value={selectedMethod} onValueChange={setSelectedMethod}>
            <TabsList className="w-full">
              {methods.map((method) => (
                <TabsTrigger key={method} value={method} className="capitalize">
                  {method}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>
      <DialogFooter>
        <Button
          disabled={
            !(selectedFunctionId && selectedMethod) ||
            mountFunctionMutation.isPending
          }
          type="submit"
          onClick={() => {
            mountFunctionMutation.mutate(undefined, {
              onSuccess: () => onClose(),
            });
          }}
        >
          Montar
        </Button>
      </DialogFooter>
    </>
  );
};

const Modal = ({ onClose }: { onClose: () => void }) => {
  const functionsQr = useCurrentProjectFunctions();
  const functions = functionsQr.data;

  const routeQr = useCurrentRoute();
  const route = routeQr.data;

  if (!functions) return <QueryHandler qr={functionsQr} />;
  if (!route) return <QueryHandler qr={routeQr} />;

  return (
    <>
      <DialogHeader>
        <DialogTitle>Montar función</DialogTitle>
        <DialogDescription>
          Selecciona la función a montar y método asociado
        </DialogDescription>
      </DialogHeader>
      <ModalContent functions={functions} route={route} onClose={onClose} />
    </>
  );
};

const RouteNewFunctionButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Montar nueva función</Button>
      </DialogTrigger>
      <DialogContent>
        <Modal onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default RouteNewFunctionButton;
