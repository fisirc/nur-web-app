import type { TreeDataItem } from "@/components/tree-view";
import type { ApiRoute } from "../types";

function createNode(
  route: ApiRoute,
  segments: string[],
  tree: TreeDataItem[] | undefined,
): void {
  const name = segments.shift();

  const antecessor = tree.find((node) => name === node.name);

  if (!antecessor) {
    tree.push({
      id: route.id,
      name,
      children: [],
    });
    if (segments.length !== 0) {
      createNode(route, segments, tree[tree.length - 1].children);
    }
  } else {
    createNode(route, segments, antecessor.children);
  }
}

export default function parse(routes: ApiRoute[]): TreeDataItem | null {
  if (!routes.length) return null;

  const root = routes[0];

  const tree: TreeDataItem = {
    id: root.id,
    name: "",
    children: [],
  };

  routes
    .slice(-1)
    .forEach((route) =>
      createNode(
        route,
        route.path_absolute.split("/").slice(-1),
        tree.children as TreeDataItem[],
      ),
    );

  return tree;
}
