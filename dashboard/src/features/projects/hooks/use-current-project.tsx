import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import ProjectService from "../services/project-service";
import type { Project } from "../types";

const useCurrentProject = () => {
  const { project_id } = useParams();

  if (!project_id)
    throw new Error("useCurrentProject called outside of a project context");

  return useQuery<Project>({
    queryKey: ["project", project_id],
    queryFn: () => ProjectService.getProject(project_id),
  });
};

export default useCurrentProject;
