import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { ApiRoute } from "../types";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toESString } from "@/utils/date-formatter";

export default ({ route }: { route: ApiRoute }) => {
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
                    <BreadcrumbItem key={2 * i}>
                      <BreadcrumbPage className="text-muted-foreground">
                        {segment}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator key={2 * i + 1} />
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
