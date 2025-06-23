import useCurrentFunction from "../hooks/use-current-function";
import useLastFunctionDeployment from "../hooks/use-last-deployment";
import { GitBranch, GitCommit, Calendar } from "lucide-react";
import { toESString } from "@/utils/date-formatter";

type FunctionDetailProps = {
  functionId: string,
}

const FunctionDetail = ({ functionId }: FunctionDetailProps) => {
  const fn = useCurrentFunction({ function_id: functionId });
  const fnDeployment = useLastFunctionDeployment({ function_id: functionId });

  if (fn.isLoading) {
    return null;
  }

  if (fn.isError || !fn.data) {
    return 'Upsii! Error cargando la función';
  }

  return (
    <div className="flex h-screen flex-col px-6 pt-6 w-full">
      <header>
        <h2 className="text-xl mb-5">
          <span className="text-muted-foreground">Funciones /</span>&nbsp;<span className="text-foreground">{fn.data.name}</span>
        </h2>
      </header>
      <div className="flex-col w-full bg-card overflow-hidden">
        <div className="flex p-4 gap-12">
          <div className="flex-col">
            <div className="mb-2">Descripción</div>
            <div className="py-2">
              La función llamada {fn.data.name}
            </div>
          </div>
          <div className="flex-col">
            <div className="mb-2">Estado</div>
            <div className="py-2">
              🟢 Activo y listo
            </div>
          </div>
        </div>
        {
          fnDeployment.data && fnDeployment.data.project_build_id && (
            <div className="flex p-4">
              <div className="flex-col grow">
                <div className="mb-3 font-medium">Último deploy</div>
                <div className="bg-input rounded-md p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <GitCommit className="size-4 text-muted-foreground" />
                    <span className="font-mono text-sm">
                      {fnDeployment.data.project_build_id.commit_sha?.substring(0, 7)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {fnDeployment.data.project_build_id.commit_short_description || "Sin descripción"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <GitBranch className="size-4 text-muted-foreground" />
                    <span className="text-sm">
                      {fnDeployment.data.project_build_id.branch_name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {fnDeployment.data.project_build_id.created_at && toESString(fnDeployment.data.project_build_id.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default FunctionDetail;
