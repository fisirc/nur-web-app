import useCurrentFunction from "../hooks/use-current-function";
import useLastFunctionDeployment from "../hooks/use-last-deployment";
import { GitBranch, GitCommit, Calendar, Search, Copy } from "lucide-react";
import { dateToTimeFormattedString, toESString } from "@/utils/date-formatter";
import { useEffect, useRef, useState, useMemo } from "react";
import useLogsStreaming from "../hooks/use-logs-streaming";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import QueryHandler from "@/components/query-handler";
import useCurrentProject from "@/features/projects/hooks/use-current-project";

type FunctionDetailProps = {
  functionId: string;
};

const FunctionDetail = ({ functionId }: FunctionDetailProps) => {
  const functionQr = useCurrentFunction({ function_id: functionId });
  const projectQr = useCurrentProject();
  const fnDeployment = useLastFunctionDeployment({ function_id: functionId });
  const logs = useLogsStreaming({ function_id: functionId });
  const logsContainerRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const headerRef = useRef<HTMLDivElement>(null);
  const [maxLogsHeight, setMaxLogsHeight] = useState("calc(100vh - 400px)");

  // Copy log to clipboard
  const copyLogToClipboard = async (log: any) => {
    const logText = `[${dateToTimeFormattedString(log.timestamp)}] ${log.message}`;
    try {
      await navigator.clipboard.writeText(logText);
    } catch (err) {
      console.error("Failed to copy log:", err);
    }
  };

  // Filter logs based on search term
  const filteredLogs = useMemo(() => {
    if (!searchTerm.trim()) return logs;
    return logs.filter((log) =>
      log.message.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [logs, searchTerm]);

  // Function to highlight search term in text
  const highlightSearchTerm = (text: string, term: string) => {
    if (!term.trim()) return text;
    const regex = new RegExp(`(${term})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-primary text-primary-foreground">
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop =
        logsContainerRef.current.scrollHeight;
    }
  }, [filteredLogs.length]);

  // Calculate available height for logs container (sadly i had to do this)
  useEffect(() => {
    const calculateMaxHeight = () => {
      if (headerRef.current) {
        const headerRect = headerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const reservedSpace = 20; // Some padding/margin space
        const availableHeight =
          viewportHeight - headerRect.bottom - reservedSpace;
        setMaxLogsHeight(`${Math.max(200, availableHeight)}px`);
      }
    };

    calculateMaxHeight();
    window.addEventListener("resize", calculateMaxHeight);
    return () => window.removeEventListener("resize", calculateMaxHeight);
  }, [fnDeployment.data]);

  const fn = functionQr.data;
  if (!fn) return <QueryHandler qr={functionQr} />;

  const project = projectQr.data;
  if (!project) return <QueryHandler qr={projectQr} />;

  return (
    <div className="flex h-full w-full flex-col px-6 pt-6">
      <div ref={headerRef}>
        <header>
          <h2 className="mb-5 text-xl">
            <Link href={`~/dashboard/project/${project.id}/functions`}>
              <span className="text-muted-foreground">Funciones /</span>
            </Link>
            &nbsp;
            <span className="text-foreground">{fn.name}</span>
          </h2>
        </header>
        <div className="bg-card flex w-full flex-col overflow-hidden text-sm">
          <div className="flex gap-12 p-4">
            <div className="flex-col">
              <div className="mb-2">Descripción</div>
              <div className="py-2">
                Función {fn.name} usada como handler HTTP
              </div>
            </div>
            <div className="flex-col">
              <div className="mb-2">Estado</div>
              <div className="py-2">🟢 Activo y listo</div>
            </div>
          </div>
          {fnDeployment.data && fnDeployment.data.project_build_id && (
            <div className="mb-4 flex px-4">
              <div className="bg-input flex w-full gap-8 space-y-4 rounded-md p-4">
                <div className="m-0">
                  <div className="mb-2 font-medium">Commit</div>
                  <div className="flex items-center gap-2">
                    <GitCommit className="text-muted-foreground size-4" />
                    <span className="font-mono">
                      {fnDeployment.data.project_build_id.commit_sha?.substring(
                        0,
                        7,
                      )}
                    </span>
                    <span className="text-muted-foreground">
                      {fnDeployment.data.project_build_id
                        .commit_short_description || "Sin descripción"}
                    </span>
                  </div>
                </div>

                <div className="m-0">
                  <div className="mb-2 font-medium">Branch</div>
                  <div className="flex items-center gap-2">
                    <GitBranch className="text-muted-foregrhighlightSearchTermound size-4" />
                    <span className="">
                      {fnDeployment.data.project_build_id.branch_name}
                    </span>
                  </div>
                </div>

                <div className="m-0">
                  <div className="mb-2 font-medium">Fecha</div>
                  <div className="flex items-center gap-2">
                    <Calendar className="text-muted-foreground size-4" />
                    <span className="text-muted-foreground">
                      {fnDeployment.data.project_build_id.created_at &&
                        toESString(
                          fnDeployment.data.project_build_id.created_at,
                        )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="mt-1 mb-3 pl-2">
          {/* <h3 className="text-lg">Logs stream</h3> */}
        </div>
        <div className="mb-3 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2 transform" />
            <Input
              type="text"
              placeholder="Buscar logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {searchTerm && (
            <span className="text-muted-foreground text-sm">
              {filteredLogs.length} de {logs.length} logs
            </span>
          )}
        </div>
      </div>
      <div
        className="bg-sidebar mb-3 flex min-h-0 flex-col"
        style={{ maxHeight: maxLogsHeight }}
      >
        <div
          ref={logsContainerRef}
          className="h-full overflow-y-auto p-4 font-mono text-[0.85rem]"
          style={{
            scrollbarWidth: "thin",
          }}
        >
          {filteredLogs.length === 0 ? (
            <div className="flex h-full items-center justify-center py-8 text-center text-gray-500">
              {searchTerm
                ? "No se encontraron logs que coincidan con la búsqueda"
                : "No hay logs disponibles"}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="group hover:bg-muted/50 m-0 flex gap-6 rounded px-2 py-1"
                >
                  <span className="text-muted-foreground shrink-0">
                    {dateToTimeFormattedString(log.timestamp)}
                  </span>
                  <span className="text-foreground flex-1">
                    {highlightSearchTerm(log.message, searchTerm)}
                  </span>
                  <button
                    onClick={() => copyLogToClipboard(log)}
                    className="hover:bg-muted shrink-0 rounded p-1 opacity-0 group-hover:opacity-100"
                    title="Copiar log"
                  >
                    <Copy className="text-muted-foreground size-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FunctionDetail;
