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
import { type Project } from "../types";

const ProjectCard = (props: Project) => {
  return (
    <Link href={`~/dashboard/project/${props.id}`}>
      <Card className="hover:bg-secondary/50 transition-all duration-200">
        <CardHeader className="flex items-center gap-3">
          <Avatar className="size-10 rounded-sm">
            <AvatarImage src="https://picsum.photos/200" />
          </Avatar>
          <div className="overflow-hidden pt-1">
            <CardTitle className="truncate overflow-ellipsis">
              {props.name}
            </CardTitle>
            <CardDescription className="truncate overflow-ellipsis">
              {props.deploymentUrl}
            </CardDescription>
          </div>
        </CardHeader>
        <CardFooter>
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col gap-1 text-sm">
              <div className="text-muted-foreground flex items-center gap-2">
                <GitPullRequestArrow size={16} />
                <span>Último commit</span>
              </div>
              <div>feat: add new feature</div>
            </div>
            <ChevronRight size={16} />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProjectCard;
