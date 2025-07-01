import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import RouteService from "../services/route-service";

const useCurrentRouteFunctions = () => {
  const { route_id } = useParams();

  if (!route_id)
    throw new Error(
      "useCurrentRouteFunctions called outside of a route context",
    );

  return useQuery({
    queryKey: ["route", route_id, "functions"],
    queryFn: () => RouteService.getFunctions(route_id),
  });
};

export default useCurrentRouteFunctions;
