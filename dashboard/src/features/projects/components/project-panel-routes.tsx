import { ScrollArea } from "@/components/ui/scroll-area";
import type { ApiRoute } from "@/features/routes/types";
import useCurrentProjectRoutes from "../hooks/use-current-project-routes";
import QueryHandler from "@/components/query-handler";
import routesToTree from "@/features/routes/utils/routes-to-tree";
import { TreeView } from "@/components/tree-view";
import { useMemo } from "react";
import { useLocation } from "wouter";

const RoutesTree = ({ routes }: { routes: ApiRoute[] }) => {
  const tree = useMemo(() => routesToTree(routes), [routes]);
  const [, navigate] = useLocation();

  return (
    <div className="border-border flex-1 shrink-0 rounded-md border">
      {tree ? (
        <TreeView
          data={tree}
          onSelectChange={(item) => navigate(("/" + item?.id) as string)}
        />
      ) : (
        <div className="size-xs text-muted-foreground flex items-center">
          No hay rutas creadas
        </div>
      )}
    </div>
  );
};

const RoutePanel = () => {
  return <div className="flex-5">todo</div>;
};

export default () => {
  const routesQr = useCurrentProjectRoutes();
  const routes = routesQr.data;

  if (!routes) return <QueryHandler qr={routesQr} />;

  return (
    <ScrollArea className="grow">
      <div className="flex flex-row gap-8 p-8">
        <RoutesTree routes={routes} />
        <RoutePanel />
      </div>
    </ScrollArea>
  );
};
