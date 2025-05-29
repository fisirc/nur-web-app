import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProjectCard from "@/features/projects/components/project-card";
import type { Project } from "@/features/projects/types";

const projects: Project[] = [
  {
    id: "1",
    name: "Proyecto Uno",
    deploymentUrl: "https://proyecto-uno.apis.nur.com",
  },
  {
    id: "2",
    name: "Proyecto Dos",
    deploymentUrl: "https://proyecto-dos.apis.nur.com",
  },
  {
    id: "3",
    name: "Proyecto Tres",
    deploymentUrl: "https://proyecto-tres.apis.nur.com",
  },
  {
    id: "4",
    name: "Proyecto Cuatro",
    deploymentUrl: "https://proyecto-cuatro.apis.nur.com",
  },
  {
    id: "5",
    name: "Proyecto Cinco",
    deploymentUrl: "https://proyecto-cinco.apis.nur.com",
  },
  {
    id: "6",
    name: "Proyecto Seis",
    deploymentUrl: "https://proyecto-seis.apis.nur.com",
  },
  {
    id: "7",
    name: "Proyecto Siete",
    deploymentUrl: "https://proyecto-siete.apis.nur.com",
  },
  {
    id: "8",
    name: "Proyecto Ocho",
    deploymentUrl: "https://proyecto-ocho.apis.nur.com",
  },
];

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
