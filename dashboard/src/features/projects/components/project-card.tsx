import { Avatar } from "@/components/ui/avatar";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Link } from "wouter";
import { ChevronRight, GitPullRequestArrow } from "lucide-react";
import { type ProjectInfo } from "../types";

const ProjectCard = (props: ProjectInfo) => {
  return (
    <Link href={`~/dashboard/project/${props.id}`}>
      <Card className="hover:bg-accent/75 transition-all duration-200">
        <CardHeader className="flex items-center gap-3">
          <Avatar className="size-10 rounded-sm">
            <AvatarImage src="https://picsum.photos/200" />
          </Avatar>
          <div className="overflow-hidden pt-1">
            <CardTitle className="truncate overflow-ellipsis">
              {props.projectName}
            </CardTitle>
            <CardDescription className="truncate overflow-ellipsis">
              {props.deploymentUrl}
            </CardDescription>
          </div>
        </CardHeader>
        <CardFooter>
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col gap-0 text-sm">
              <div className="flex items-center gap-2">
                <GitPullRequestArrow size={16} />
                <div>feat: add new feature</div>
              </div>
              <div className="text-muted-foreground">hace 5 minutos</div>
            </div>
            <ChevronRight size={16} />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProjectCard;
