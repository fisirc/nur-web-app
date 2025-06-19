import { useQuery } from "@tanstack/react-query";
import type { Organization } from "../types";
import { useParams } from "wouter";
import OrgService from "../services/org-service";
import ProjectService from "@/features/projects/services/project-service";

const useCurrentOrg = () => {
  const { org_id, project_id } = useParams();

  if (!org_id) {
    if (!project_id)
      throw new Error(
        "useCurrentOrg called outside of an organization or project context",
      );
    return useQuery<Organization>({
      queryKey: ["org", project_id],
      queryFn: () => ProjectService.getOrgFromProject(project_id),
    });
  }

  return useQuery<Organization>({
    queryKey: ["org", org_id],
    queryFn: () => OrgService.getOrganization(org_id),
  });
};

export default useCurrentOrg;
