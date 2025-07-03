import { useMutation, useQueryClient } from "@tanstack/react-query";
import RouteService from "../services/route-service";
import type { MethodName } from "../types";

const useMountFunction = (
  route_id: string,
  function_id: string,
  method_name: MethodName,
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      return await RouteService.mountFunction(
        route_id,
        function_id,
        method_name,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["route", route_id, "functions"],
      });
    },
  });

  return mutation;
};

export default useMountFunction;
