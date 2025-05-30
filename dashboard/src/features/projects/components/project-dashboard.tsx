import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import logo from "@/assets/img/logo.png";
import HelpButton from "@/components/help-button";
import UserAvatar from "@/components/user-avatar";

import { Home, Settings } from "lucide-react";
import { IconLambda, IconRouteAltRight } from "@tabler/icons-react";
import { Link, Route, useLocation, useParams } from "wouter";
import { MenuItem } from "@/components/menuitem";
import type { Project } from "@feat/projects/types";
import ProjectOverviewPanel from "./project-overview-panel";

const tabs = [
  {
    title: "Vista general",
    url: "/",
    icon: Home,
  },
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
];

const ProjectDashboard = () => {
  const [location] = useLocation();
  const params = useParams();

  if (!params.project_id) return null;

  const activeTab = tabs.find((tab) => tab.url === location);
  if (!activeTab) return null;

  const project: Project = {
    id: params.project_id,
    name: "Example Project",
    deploymentUrl: "https://example.com",
  };

  return (
    <div className="flex h-screen flex-col">
      <div className="border-border flex h-14 shrink-0 items-center justify-between border-b px-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <img src={logo} alt="Voltom Logo" className="h-7 w-auto" />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link href="~/dashboard/org/1">Voltom</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>{project.name}</BreadcrumbItem>
            {/* <BreadcrumbItem>
              <Link href="/">{project.name}</Link>
            </BreadcrumbItem> */}
            {/* {location !== "/" && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <span>{activeTab.title}</span>
                </BreadcrumbItem>
              </>
            )} */}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-3">
          <HelpButton />
          <UserAvatar />
        </div>
      </div>
      <div className="flex grow overflow-hidden">
        <div className="border-border w-56 border-r p-3">
          {tabs.map((tab) => (
            <MenuItem
              key={tab.title}
              active={location === tab.url}
              href={tab.url}
            >
              <tab.icon className="mr-2 size-4" />
              {tab.title}
            </MenuItem>
          ))}
        </div>
        <Route path="/">
          <ProjectOverviewPanel />
        </Route>
      </div>
    </div>
  );
};

export default ProjectDashboard;
