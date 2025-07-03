import RouteService from "@/features/routes/services/route-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "wouter";

const useCreateRoute = (path_absolute: string) => {
  const { project_id } = useParams();
  if (!project_id) throw Error("Project ID is required to create a route");

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      return await RouteService.createRoute(path_absolute, project_id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project", project_id, "routes"],
      });
    },
  });

  return mutation;
};

export default useCreateRoute;
