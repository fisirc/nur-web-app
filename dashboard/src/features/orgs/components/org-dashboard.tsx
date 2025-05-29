import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import logo from "@/assets/img/logo.png";
import HelpButton from "@/components/help-button";
import UserAvatar from "@/components/user-avatar";

import { Library, Settings, Users, WalletMinimal } from "lucide-react";
import { Route, useLocation } from "wouter";
import { MenuItem } from "@/components/menuitem";
import OrgProjectsPanel from "./org-projects-panel";

const tabs = [
  {
    title: "Proyectos",
    url: "/projects",
    icon: Library,
  },
  {
    title: "Equipo",
    url: "/team",
    icon: Users,
  },
  {
    title: "Facturación",
    url: "/billing",
    icon: WalletMinimal,
  },
  {
    title: "Ajustes",
    url: "/settings",
    icon: Settings,
  },
];

const OrgDashboard = () => {
  const [location] = useLocation();

  const activeTab = tabs.find((tab) => tab.url === location);
  if (!activeTab) return null;

  return (
    <div className="flex h-screen flex-col">
      <div className="border-border flex h-14 shrink-0 items-center justify-between border-b px-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <img src={logo} alt="Voltom Logo" className="h-7 w-auto" />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>Voltom</BreadcrumbItem>
            <BreadcrumbSeparator />
            {/* <BreadcrumbItem>
              <span>{activeTab.title}</span>
            </BreadcrumbItem> */}
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
              <tab.icon className="mr-2 h-4 w-4" />
              {tab.title}
            </MenuItem>
          ))}
        </div>
        <Route path="/projects">
          <OrgProjectsPanel />
        </Route>
      </div>
    </div>
  );
};

export default OrgDashboard;
