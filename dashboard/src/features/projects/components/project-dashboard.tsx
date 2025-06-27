import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import HelpButton from "@/components/help-button";
import UserAvatar from "@/components/user-avatar";

import { Home, Settings } from "lucide-react";
import { IconLambda, IconRouteAltRight } from "@tabler/icons-react";
import { Link, Redirect, Route, Switch } from "wouter";
import { MenuItem } from "@/components/menu-item";
import useCurrentProject from "../hooks/use-current-project";
import useURLTab from "@/hooks/use-url-tab";
import type { URLTab } from "@/types";
import ProjectPanelOverview from "./project-panel-overview";
import HeaderLogo from "@/components/header-logo";
import useCurrentOrg from "@/features/orgs/hooks/use-current-org";
import FunctionDetail from "@/features/functions/components/function-detail";
import ProjectPanelFunctions from "./project-panel-functions";
import ProjectPanelRoutes from "./project-panel-routes";

const tabs: URLTab[] = [
  {
    title: "Funciones",
    url: "/functions",
    icon: IconLambda,
  },
  {
    title: "Rutas de la API",
    url: "/routes",
    icon: IconRouteAltRight,
  },
  {
    title: "Ajustes de proyecto",
    url: "/settings",
    icon: Settings,
  },
  // The root "/" is placed at the end so it's the last to match
  {
    title: "Vista general",
    url: "/",
    icon: Home,
  },
];

const Header = () => {
  const projectQr = useCurrentProject();
  const orgQr = useCurrentOrg();

  return (
    <div className="border-border flex h-14 shrink-0 items-center justify-between border-b px-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <HeaderLogo />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            {orgQr.data ? (
              <Link href={`~/dashboard/org/${orgQr.data.id}`}>
                {orgQr.data.name}
              </Link>
            ) : (
              "..."
            )}
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>{projectQr.data?.name || "..."}</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center gap-3">
        <HelpButton />
        <UserAvatar />
      </div>
    </div>
  );
};

const Sidebar = ({ activeTab }: { activeTab: URLTab }) => (
  <div className="border-border w-56 border-r p-3">
    {tabs.map((tab) => (
      <MenuItem
        key={tab.title}
        active={activeTab.url === tab.url}
        href={tab.url}
      >
        <tab.icon className="mr-2 size-4" />
        {tab.title}
      </MenuItem>
    ))}
  </div>
);

const ProjectDashboard = () => {
  const activeTab = useURLTab(tabs);
  if (!activeTab) return null;

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex grow">
        <Sidebar activeTab={activeTab} />
        <Switch>
          <Route path="/">
            <ProjectPanelOverview />
          </Route>
          <Route path="/functions">
            <ProjectPanelFunctions />
          </Route>
          <Route path="/routes">
            <ProjectPanelRoutes />
          </Route>
          <Route path="/settings">TODO: settings del proyecto</Route>
          <Route path="/functions/:function_id">
            {(params) => <FunctionDetail functionId={params.function_id} />}
          </Route>
          <Route>
            <Redirect to="/" />
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default ProjectDashboard;
