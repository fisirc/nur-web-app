import { dummyProjectInfo } from "../data/dummy";
import type { ProjectInfo } from "../types";

export default class ProjectService {
  static getProjectInfo = async (project_id: string): Promise<ProjectInfo> => {
    return dummyProjectInfo;
  };
}
