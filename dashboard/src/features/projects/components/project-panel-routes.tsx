import { ScrollArea } from "@/components/ui/scroll-area";
import type { ApiRoute, MountedFunction } from "@/features/routes/types";
import useCurrentProjectRoutes from "../hooks/use-current-project-routes";
import QueryHandler from "@/components/query-handler";
import routesToTree from "@/features/routes/utils/routes-to-tree";
import { RoutesTree } from "@/features/routes/components/routes-tree";
import { useMemo } from "react";
import { Route, Switch, useLocation } from "wouter";
import useCurrentRoute from "@/features/routes/hooks/useCurrentRoute";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toESString } from "@/utils/date-formatter";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import useCurrentRouteFunctions from "@/features/routes/hooks/use-current-route-functions";
import { Button } from "@/components/ui/button";

const NewMountedFunctionButton = () => {
  return <Button>Montar función</Button>;
};

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

const DetailsCard = ({ route }: { route: ApiRoute }) => {
  const segments = route.path_absolute.split("/");
  segments[0] = "/";

  return (
    <Card className="grow">
      <CardHeader>
        <Breadcrumb>
          <BreadcrumbList className="text-2xl">
            {segments[1] !== "" ? (
              segments.map((segment, i) =>
                i !== segments.length - 1 ? (
                  <>
                    <BreadcrumbItem>
                      <BreadcrumbPage className="text-muted-foreground">
                        {segment}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </>
                ) : (
                  <BreadcrumbPage>{segment}</BreadcrumbPage>
                ),
              )
            ) : (
              <BreadcrumbPage>{segments[0]}</BreadcrumbPage>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </CardHeader>
      <CardContent className="flex flex-row gap-16 text-sm">
        <div className="flex flex-col">
          <div className="text-muted-foreground">Creada el</div>
          <div>{toESString(route.created_at)}</div>
        </div>
        <div className="flex flex-col">
          <div className="text-muted-foreground">ID</div>
          <div>{route.id}</div>
        </div>
      </CardContent>
    </Card>
  );
};

const MountedFunctions = ({ functions }: { functions: MountedFunction[] }) => {
  if (!functions.length)
    return (
      <div className="size-xs text-muted-foreground flex flex-row items-center justify-center gap-4">
        No hay funciones montadas a esta ruta.
        <NewMountedFunctionButton />
      </div>
    );

  return (
    <div className="flex grow flex-col gap-8">
      <h2 className="text-lg">Funciones montadas</h2>
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
      <DetailsCard route={route} />
      <MountedFunctions functions={functions} />
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
