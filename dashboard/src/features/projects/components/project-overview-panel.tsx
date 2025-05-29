import { ScrollArea } from "@/components/ui/scroll-area";
import { IconBrandGithub } from "@tabler/icons-react";
import { ExternalLink } from "lucide-react";

const ProjectOverviewPanel = () => {
  return (
    <ScrollArea className="grow">
      <div className="flex flex-col gap-4 p-8">
        <div className="flex flex-col gap-2">
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
      </div>
    </ScrollArea>
  );
};

export default ProjectOverviewPanel;
