import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { Organization } from "../types";
import { useParams } from "wouter";
import OrgService from "../services/org-service";

const useCurrentOrgDetails = () => {
  const { org_id } = useParams();

  if (!org_id)
    throw new Error(
      "useCurrentOrgDetails called outside of an organization context",
    );

  return useQuery<Organization>({
    queryKey: ["org", org_id, "details"],
    queryFn: () => OrgService.getDetails(org_id),
    placeholderData: keepPreviousData,
  });
};

export default useCurrentOrgDetails;
