import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import RouteService from "../services/route-service";
import type { ApiRoute } from "../types";

const useCurrentRoute = () => {
  const { project_id } = useParams();

  if (!project_id)
    throw new Error("useCurrentRoute called outside of a project context");

  return useQuery<ApiRoute>({
    queryKey: ["project", project_id],
    queryFn: () => RouteService.getDetails(project_id),
  });
};

export default useCurrentRoute;

// TODO: FINISH HOOK
