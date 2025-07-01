import { ScrollArea } from "@/components/ui/scroll-area";
import type { ApiRoute } from "@/features/routes/types";
import useCurrentProjectRoutes from "../hooks/use-current-project-routes";
import QueryHandler from "@/components/query-handler";
import routesToTree from "@/features/routes/utils/routes-to-tree";
import { TreeView } from "@/components/tree-view";
import { useMemo } from "react";
import { Route, Switch, useLocation } from "wouter";
import useCurrentRoute from "@/features/routes/hooks/useCurrentRoute";

const RoutesTree = ({ routes }: { routes: ApiRoute[] }) => {
  const tree = useMemo(() => routesToTree(routes), [routes]);
  const [, navigate] = useLocation();

  return (
    <div className="border-border rounded-md border">
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

const DetailsCard = ({ route }: { route: ApiRoute }) => (
  <div>{route.path_absolute}</div>
);

const RouteDetail = () => {
  const routeQr = useCurrentRoute();
  const route = routeQr.data;
  if (!route) return <QueryHandler qr={routeQr} />;

  return (
    <div className="flex gap-8">
      <DetailsCard route={route} />
    </div>
  );
};

const NoRouteSelected = () => (
  <div className="flex items-center justify-center">
    Selecciona una ruta para ver sus detalles
  </div>
);

export default () => {
  const routesQr = useCurrentProjectRoutes();
  const routes = routesQr.data;

  if (!routes) return <QueryHandler qr={routesQr} />;

  return (
    <ScrollArea className="grow">
      <div className="flex flex-row gap-8 p-8">
        <div className="flex-1 shrink-0">
          <RoutesTree routes={routes} />
        </div>
        <div className="flex-5">
          <Switch>
            <Route path="/:route_id">
              <RouteDetail />
            </Route>
            <Route>
              <NoRouteSelected />
            </Route>
          </Switch>
        </div>
      </div>
    </ScrollArea>
  );
};
