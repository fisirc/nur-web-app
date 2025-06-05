import { dummyProjectInfo } from "../data/dummy";

class ProjectService {
  static getProjectInfo = (project_id: string) => {
    return dummyProjectInfo;
  };
}

export default ProjectService;
