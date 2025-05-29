import { Redirect, Route } from "wouter";
import OrgDashboard from "@/features/orgs/components/org-dashboard";
import ProjectDashboard from "@feat/projects/components/project-dashboard";

const App = () => {
  return (
    <>
      <Route path="/">
        <Redirect to="/dashboard" />
      </Route>
      <Route path="/dashboard" nest>
        {/* <Route path="/org/new">new org</Route> */}
        <Route path="/">
          <Redirect to="/org/1" />
        </Route>
        <Route path="/org/:org_id" nest>
          <Route path="/">
            <Redirect to="/projects" />
          </Route>
          <OrgDashboard />
        </Route>
        <Route path="/project/:project_id" nest>
          <ProjectDashboard />
        </Route>
      </Route>
    </>
  );
};

export default App;
