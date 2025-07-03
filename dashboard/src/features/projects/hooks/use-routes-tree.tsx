import type { ApiRoute } from "@/features/routes/types";
import type { TreeDataItem } from "@/features/routes/components/routes-tree";
import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import useCreateRoute from "./use-create-route";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const createNode = (
  route: ApiRoute,
  segments: string[],
  subtree: TreeDataItem[],
): void => {
  if (!segments.length) throw Error("createNode called with no path segments");

  const name = segments.shift() as string;
  let antecessor = subtree.find((child) => child.name === name);

  if (!segments.length) {
    if (antecessor) {
      if (antecessor.children) {
        console.error(antecessor);
        throw Error(
          `existing antecesor node for route ${route.path_absolute} found`,
        );
      } else {
        console.error(antecessor);
        throw Error(`exact duplicate of route ${route.path_absolute} found`);
      }
    } else {
      subtree.push({
        id: route.id,
        name,
        actions: <AddRouteButton antecessor={route} />,
      });
      return;
    }
  } else {
    if (!antecessor) {
      // create antecessor
      antecessor = {
        id: route.id,
        name,
        actions: <AddRouteButton antecessor={route} />,
        children: [],
      };
      subtree.push(antecessor);
    } else if (!antecessor.children) {
      antecessor.children = [];
    }
    createNode(route, segments, antecessor.children as TreeDataItem[]);
  }
};

const routesToTree = (routes: ApiRoute[]): TreeDataItem | null => {
  if (!routes.length) return null;

  const root = routes.shift() as ApiRoute;

  const tree: TreeDataItem = {
    id: root.id,
    name: root.path_absolute,
    actions: <AddRouteButton antecessor={root} />,
    children: [],
  };

  routes.forEach((route) =>
    createNode(
      route,
      route.path_absolute.split("/").slice(1),
      tree.children as TreeDataItem[],
    ),
  );

  return tree;
};

const AddRouteButton = ({ antecessor }: { antecessor: ApiRoute }) => {
  const [newPath, setNewPath] = useState<string>();
  const newPathAbsolute =
    (antecessor.path_absolute !== "/" ? antecessor.path_absolute + "/" : "/") +
    newPath;
  const createRoute = useCreateRoute(newPathAbsolute);

  console.log(newPathAbsolute);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="bg-accent/30 hover:bg-accent ml-1 flex size-5 items-center justify-center rounded-sm opacity-0 group-hover:opacity-100">
          <Plus className="text-foreground/50 size-3 shrink-0" />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear nueva ruta</DialogTitle>
          <DialogDescription>Introduce el nombre del recurso</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Nombre del recurso"
            value={newPath}
            onChange={(e) => setNewPath(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => createRoute.mutate()}
            disabled={!newPath || createRoute.isPending}
          >
            Crear ruta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const useRoutesTree = (routes: ApiRoute[]) => {
  const tree = useMemo(() => routesToTree(routes), [routes]);
  return tree;
};

export default useRoutesTree;
