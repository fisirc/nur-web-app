import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IconBrandGithub } from "@tabler/icons-react";
import { ExternalLink, GitPullRequestArrow } from "lucide-react";

const ProjectOverviewPanel = () => {
  return (
    <ScrollArea className="grow">
      <div className="flex flex-col gap-6 p-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl">Example project</h1>
          <a
            href="https://github.com/voltom/project"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="text-muted-foreground flex items-center gap-1 text-sm">
              <IconBrandGithub size={16} />
              <span className="hover:underline">voltom/proyecto</span>
              <ExternalLink size={12} />
            </div>
          </a>
        </div>
        <Card>
          <CardContent className="flex gap-6 text-sm">
            <div className="flex flex-col gap-6 w-[150px] shrink-0">
              <div className="flex flex-col">
                <span className="text-muted-foreground">Estado</span>
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-lime-300 inline-block" />
                  <span>Activo y listo</span> 
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Creado el</span>
                <span>10 de mayo del 2025</span>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col">
                <span className="text-muted-foreground">URL de despliegue</span>
                <a className="hover:underline" href="https://api-name.apis.nur.com/" target="_blank" rel="noopener noreferrer">
                  https://api-name.apis.nur.com/
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
      </div>
    </ScrollArea>
  );
};

export default ProjectOverviewPanel;
