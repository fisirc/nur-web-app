import { DataTable } from "@/components/ui/data-table";
import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import useCurrentOrgMembers from "../hooks/use-current-org-members";
import QueryHandler from "@/components/query-handler";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import fuzzyFilter from "@/utils/fuzzy-filter";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleUser, MoreHorizontal } from "lucide-react";
import roleLabel from "../utils/roleLabel";
import type { Member } from "../types";

const columns: ColumnDef<Member>[] = [
  {
    id: "github_username",
    header: "Miembro",
    accessorKey: "github_username",
    cell: ({ row }) => {
      const { avatar_url } = row.original;
      return (
        <div className="flex items-center gap-2">
          {avatar_url ? (
            <img className="size-8 rounded-full" src={avatar_url} />
          ) : (
            <CircleUser className="size-8" />
          )}
          <span>{row.getValue("github_username")}</span>
        </div>
      );
    },
    enableGlobalFilter: true,
  },
  {
    id: "role",
    header: "Rol",
    accessorFn: (row) => {
      // console.log(row);
      return roleLabel(row.role);
    },
    enableGlobalFilter: false,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Cambiar rol</DropdownMenuItem>
            <DropdownMenuItem>Eliminar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const MembersTable = ({ members }: { members: Member[] }) => {
  const table = useReactTable({
    data: members,
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
          placeholder="Busca por nombre o correo"
          value={table.getState().globalFilter}
          onChange={(e) => table.setGlobalFilter(String(e.target.value))}
        />
        <Button>Invitar miembros</Button>
      </div>
      <DataTable table={table} />
    </div>
  );
};

const OrgPanelTeam = () => {
  const qr = useCurrentOrgMembers();
  const { data } = qr;

  if (!data) return <QueryHandler qr={qr} />;

  return (
    <ScrollArea className="grow">
      <div className="flex grow flex-col gap-8 p-8">
        <h1 className="text-3xl">Equipo</h1>
        <MembersTable members={data} />
      </div>
    </ScrollArea>
  );
};

export default OrgPanelTeam;
