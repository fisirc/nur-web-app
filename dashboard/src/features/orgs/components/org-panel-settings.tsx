import { DataTable } from "@/components/ui/data-table";
import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import type { OrgMember } from "../types";
import useCurrentOrgMembers from "../hooks/use-current-org-members";
import QueryHandler from "@/components/query-handler";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import fuzzyFilter from "@/utils/fuzzy-filter";
import { ScrollArea } from "@/components/ui/scroll-area";
import { orgMemberRoleAttribs } from "../data/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

const columns: ColumnDef<OrgMember>[] = [
  {
    id: "fullName",
    header: "Miembro",
    accessorKey: "fullName",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <img className="size-8 rounded-full" src={row.original.avatarUrl} />
        <span>{row.getValue("fullName")}</span>
      </div>
    ),
    enableGlobalFilter: true,
  },
  {
    id: "email",
    header: "Correo",
    accessorKey: "email",
    enableGlobalFilter: true,
  },
  {
    id: "role",
    header: "Rol",
    accessorFn: (row) => orgMemberRoleAttribs[row.role].label,
    enableGlobalFilter: false,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
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

const MembersTable = ({ members }: { members: OrgMember[] }) => {
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
