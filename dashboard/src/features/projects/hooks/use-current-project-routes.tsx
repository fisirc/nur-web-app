import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import ProjectService from "../services/project-service";

const useCurrentProjectRoutes = () => {
  const { project_id } = useParams();

  if (!project_id)
    throw new Error(
      "useCurrentProjectRoutes called outside of a project context",
    );

  return useQuery({
    queryKey: ["project", project_id, "routes"],
    queryFn: () => ProjectService.getRoutes(project_id),
  });
};

export default useCurrentProjectRoutes;
