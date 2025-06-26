import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import ProjectService from "../services/project-service";

const useCurrentProjectFunctions = () => {
  const { project_id } = useParams();

  if (!project_id)
    throw new Error(
      "useCurrentProjectFunctions called outside of a project context",
    );

  return useQuery({
    queryKey: ["project", project_id, "functions"],
    queryFn: () => ProjectService.getFunctions(project_id),
  });
};

export default useCurrentProjectFunctions;
