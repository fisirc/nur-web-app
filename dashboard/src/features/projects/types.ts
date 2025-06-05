export type ProjectInfo = {
  id: string;
  projectName: string;
  githubRepoName: string;
  active: boolean;
  deploymentUrl: string;
  createdAt: string;
  latestCommitName: string;
  latestCommitDate: Date;
};
