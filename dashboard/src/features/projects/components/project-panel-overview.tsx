import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IconBrandGithub } from "@tabler/icons-react";
import { ExternalLink, GitPullRequestArrow } from "lucide-react";
import useCurrentProject from "../hooks/use-current-project";
import QueryHandler from "@/components/query-handler";
import { toESString } from "@/utils/date-formatter";
import type { Project } from "../types";

const Header = ({ currentProject }: { currentProject: Project }) => (
  <div className="flex flex-col gap-1">
    <h1 className="text-3xl">{currentProject.name}</h1>
    <a
      href="https://github.com/voltom/project"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="text-muted-foreground flex items-center gap-1 text-sm">
        <IconBrandGithub size={16} />
        <span className="hover:underline">
          {currentProject.github_repo_name}
        </span>
        <ExternalLink size={12} />
      </div>
    </a>
  </div>
);

const OverviewCard = ({ currentProject }: { currentProject: Project }) => (
  <Card>
    <CardContent className="flex gap-6 text-sm">
      <div className="flex w-[150px] shrink-0 flex-col gap-6">
        <div className="flex flex-col">
          <span className="text-muted-foreground">Estado</span>
          {
            // currentProject.active ? (
            true ? (
              <div className="flex items-center gap-2">
                <span className="inline-block size-2 rounded-full bg-lime-300" />
                <span>Activo y listo</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="inline-block size-2 rounded-full bg-red-300" />
                <span>Inactivo</span>
              </div>
            )
          }
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground">Creado el</span>
          <span>{toESString(currentProject.created_at)}</span>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col">
          <span className="text-muted-foreground">URL de despliegue</span>
          <a
            className="hover:underline"
            href="https://nur.gateway.sanmarcux.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://nur.gateway.sanmarcux.org/
          </a>
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground">Último commit</span>
          <div className="flex items-center gap-2">
            <GitPullRequestArrow size={16} />
            <div>feat: add new feature</div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ProjectPanelOverview = () => {
  const projectQr = useCurrentProject();
  const { data } = projectQr;

  if (!data) return <QueryHandler qr={projectQr} />;

  return (
    <ScrollArea className="grow">
      <div className="flex flex-col gap-6 p-8">
        <Header currentProject={data} />
        <OverviewCard currentProject={data} />
      </div>
    </ScrollArea>
  );
};

export default ProjectPanelOverview;
