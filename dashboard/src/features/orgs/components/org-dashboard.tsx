import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import HelpButton from "@/components/help-button";
import UserAvatar from "@/components/user-avatar";

import { Library, Settings, Users, WalletMinimal } from "lucide-react";
import { Route } from "wouter";
import { MenuItem } from "@/components/menu-item";
import OrgPanelProjects from "./org-panel-projects";
import type { URLTab } from "@/types";
import useURLTab from "@/hooks/use-url-tab";
import HeaderLogo from "@/components/header-logo";
import OrgPanelTeam from "./org-panel-team";
import useCurrentOrg from "../hooks/use-current-org";

const tabs: URLTab[] = [
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
  // {
  //   title: "Facturación",
  //   url: "/billing",
  //   icon: WalletMinimal,
  // },
  {
    title: "Ajustes",
    url: "/settings",
    icon: Settings,
  },
];

const OrgDashboard = () => {
  const activeTab = useURLTab(tabs);
  const orgQr = useCurrentOrg();

  if (!activeTab) return null;

  return (
    <div className="flex h-screen flex-col">
      <div className="border-border flex h-14 shrink-0 items-center justify-between border-b px-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <HeaderLogo />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>{orgQr.data?.name || "..."}</BreadcrumbItem>
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
              active={activeTab.url === tab.url}
              href={tab.url}
            >
              <tab.icon className="mr-2 h-4 w-4" />
              {tab.title}
            </MenuItem>
          ))}
        </div>
        <Route path="/projects">
          <OrgPanelProjects />
        </Route>
        <Route path="/team">
          <OrgPanelTeam />
        </Route>
      </div>
    </div>
  );
};

export default OrgDashboard;
