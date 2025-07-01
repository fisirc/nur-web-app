import type { TreeDataItem } from "@/components/tree-view";
import type { ApiRoute } from "../types";

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
      // create leaf
      subtree.push({
        id: route.id,
        name,
      });
      return;
    }
  } else {
    if (!antecessor) {
      // create antecessor
      antecessor = {
        id: route.id,
        name,
        children: [],
      };
      subtree.push(antecessor);
    } else if (!antecessor.children) {
      console.error(antecessor);
      throw Error(
        `antecessor node of route ${route.path_absolute} created as leaf`,
      );
    }
    createNode(route, segments, antecessor.children as TreeDataItem[]);
  }
};

export default (routes: ApiRoute[]): TreeDataItem | null => {
  if (!routes.length) return null;

  const root = routes.shift() as ApiRoute;

  const tree: TreeDataItem = {
    id: root.id,
    name: root.path_absolute,
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
