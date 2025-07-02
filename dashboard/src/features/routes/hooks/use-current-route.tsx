import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import RouteService from "../services/route-service";

const useCurrentRoute = () => {
  const { route_id } = useParams();

  if (!route_id)
    throw new Error("useCurrentRoute called outside of a route context");

  return useQuery({
    queryKey: ["route", route_id],
    queryFn: () => RouteService.getDetails(route_id),
  });
};

export default useCurrentRoute;
