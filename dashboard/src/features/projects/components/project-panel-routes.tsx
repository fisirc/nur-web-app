import { ScrollArea } from "@/components/ui/scroll-area";
import type { ApiRoute } from "@/features/routes/types";
import useCurrentProjectRoutes from "../hooks/use-current-project-routes";
import QueryHandler from "@/components/query-handler";
import routesToTree from "@/features/routes/utils/routes-to-tree";
import { RoutesTree } from "@/features/routes/components/routes-tree";
import { useMemo } from "react";
import { Route, Switch, useLocation } from "wouter";
import useCurrentRoute from "@/features/routes/hooks/use-current-route";
import useCurrentRouteFunctions from "@/features/routes/hooks/use-current-route-functions";
import RouteDetailsCard from "@/features/routes/components/route-details-card";
import MountedFunctions from "@/features/routes/components/route-functions";

const RoutesTreePanel = ({ routes }: { routes: ApiRoute[] }) => {
  const tree = useMemo(() => routesToTree(routes), [routes]);
  const [, navigate] = useLocation();

  return (
    <div className="border-border rounded-md border">
      {tree ? (
        <RoutesTree
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

const RouteDetail = () => {
  const routeQr = useCurrentRoute();
  const functionsQr = useCurrentRouteFunctions();

  const route = routeQr.data;
  if (!route) return <QueryHandler qr={routeQr} />;

  const functions = functionsQr.data;
  if (!functions) return <QueryHandler qr={functionsQr} />;

  return (
    <div className="flex flex-col gap-8">
      <RouteDetailsCard route={route} />
      <MountedFunctions functions={functions} />
    </div>
  );
};

const NoRouteSelected = () => (
  <div className="size-xs text-muted-foreground flex flex-row justify-center">
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
          <RoutesTreePanel routes={routes} />
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
