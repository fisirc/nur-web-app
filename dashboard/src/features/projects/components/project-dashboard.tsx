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
import { Link, Route } from "wouter";
import { MenuItem } from "@/components/menuitem";
import useCurrentProjectQR from "../hooks/use-current-project";
import useURLTab from "@/hooks/use-url-tab";
import type { URLTab } from "@/types";
import ProjectOverviewPanel from "./project-overview-panel";

const tabs: URLTab[] = [
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

const Header = () => {
  const currentProjectQR = useCurrentProjectQR();

  return (
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
          <BreadcrumbItem>
            {currentProjectQR.data?.projectName || "..."}
          </BreadcrumbItem>
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
      <div className="flex grow overflow-hidden">
        <Sidebar activeTab={activeTab} />
        <Route path="/">
          <ProjectOverviewPanel />
        </Route>
      </div>
    </div>
  );
};

export default ProjectDashboard;
