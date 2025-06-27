import type { TreeDataItem } from "@/components/tree-view";
import type { ApiRoute } from "../types";

// TODO: make recursive function that forms an actual tree based on paths

const routesToTree = (routes: ApiRoute[]): TreeDataItem | null => {
  const root = routes.find((route) => route.path_absolute === "/");
  if (!root) return null;

  const children = routes
    .filter(
      (route) =>
        route.path_absolute !== "/" && route.path_absolute.startsWith("/"),
    )
    .map((route) => ({ id: route.id, name: route.path_absolute }));

  return {
    id: root.id,
    name: root.path_absolute,
    children,
  };
};

export default routesToTree;
