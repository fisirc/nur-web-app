import { ScrollArea } from "@/components/ui/scroll-area";
import type { ApiRoute } from "@/features/routes/types";
import useCurrentProjectRoutes from "../hooks/use-current-project-routes";
import QueryHandler from "@/components/query-handler";
import routesToTree from "@/features/routes/utils/routes-to-tree";
import { TreeView } from "@/components/tree-view";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";

const NewRouteButton = () => {
  return (
    <div className="flex items-center p-4">
      <Button>Añadir ruta</Button>
    </div>
  );
};

const RoutesPanel = ({ routes }: { routes: ApiRoute[] }) => {
  // const tree = useMemo(() => routesToTree(routes), [routes]);

  console.log(routes);

  return (
    <div className="border-border flex flex-1 flex-col items-center rounded-md border">
      {/* <NewRouteButton />
      <div className="px-8 py-12">
        {tree ? (
          <TreeView data={tree} />
        ) : (
          <div className="size-xs text-muted-foreground flex items-center">
            No hay rutas creadas
          </div>
        )}
      </div> */}
    </div>
  );
};

export default () => {
  const routesQr = useCurrentProjectRoutes();
  const routes = routesQr.data;

  if (!routes) return <QueryHandler qr={routesQr} />;

  return (
    <ScrollArea className="grow">
      <div className="flex grow flex-row gap-8 p-8">
        <RoutesPanel routes={routes} />
      </div>
    </ScrollArea>
  );
};
