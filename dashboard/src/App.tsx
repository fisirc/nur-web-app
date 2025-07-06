import { Redirect, Route, Switch } from "wouter";
import OrgDashboard from "@/features/orgs/components/org-dashboard";
import ProjectDashboard from "@feat/projects/components/project-dashboard";

import Hotjar from '@hotjar/browser';
import { useEffect } from "react";

const siteId = 6456060;
const hotjarVersion = 6;

const App = () => {
  useEffect(() => {
    Hotjar.init(siteId, hotjarVersion);
  }, []);

  return (
    <Switch>
      <Route path="/">
        <Redirect to="/dashboard" />
      </Route>
      <Route path="/dashboard" nest>
        {/* <Route path="/org/new">new org</Route> */}
        <Route path="/">
          <Redirect to="/org/5abca721-0023-4de7-950b-289ee25f17b9" />
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
      <Route>404: No such page!</Route>
    </Switch>
  );
};

export default App;
