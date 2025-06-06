import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProjectCard from "@/features/projects/components/project-card";
import { dummyProjectInfo } from "@/features/projects/data/dummy";
import type { ProjectInfo } from "@/features/projects/types";

const projects: ProjectInfo[] = [dummyProjectInfo];

const OrgProjectsPanel = () => {
  return (
    <ScrollArea className="grow">
      <div className="flex flex-col gap-6 p-8">
        <div className="flex justify-between">
          <Input
            className="w-72"
            placeholder="Busca tus proyectos y repositorios"
          />
          <Button>Nuevo proyecto</Button>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

export default OrgProjectsPanel;
