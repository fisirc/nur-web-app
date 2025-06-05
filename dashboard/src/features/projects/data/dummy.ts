import type { ProjectInfo } from "@feat/projects/types";

export const dummyProjectInfo: ProjectInfo = {
  id: "1",
  projectName: "Example Project",
  githubRepoName: "voltom/example-project",
  active: true,
  deploymentUrl: "https://example.com",
  createdAt: new Date("2025-05-10"),
  latestCommitName: "feat: add new feature",
  latestCommitDate: new Date("2025-05-12"),
};
