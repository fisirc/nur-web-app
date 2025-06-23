import useCurrentFunction from "../hooks/use-current-function";
import useLastFunctionDeployment from "../hooks/use-last-deployment";
import { GitBranch, GitCommit, Calendar, Search, Copy } from "lucide-react";
import { dateToTimeFormattedString, toESString } from "@/utils/date-formatter";
import { useEffect, useRef, useState, useMemo } from "react";
import useLogsStreaming from "../hooks/use-logs-streaming";
import { Input } from "@/components/ui/input";

type FunctionDetailProps = {
  functionId: string,
}

const FunctionDetail = ({ functionId }: FunctionDetailProps) => {
  const fn = useCurrentFunction({ function_id: functionId });
  const fnDeployment = useLastFunctionDeployment({ function_id: functionId });
  const logs = useLogsStreaming({ function_id: functionId });
  const logsContainerRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const headerRef = useRef<HTMLDivElement>(null);
  const [maxLogsHeight, setMaxLogsHeight] = useState('calc(100vh - 400px)');

  // Copy log to clipboard
  const copyLogToClipboard = async (log: any) => {
    const logText = `[${dateToTimeFormattedString(log.timestamp)}] ${log.message}`;
    try {
      await navigator.clipboard.writeText(logText);
    } catch (err) {
      console.error('Failed to copy log:', err);
    }
  };

  // Filter logs based on search term
  const filteredLogs = useMemo(() => {
    if (!searchTerm.trim()) return logs;
    return logs.filter(log =>
      log.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [logs, searchTerm]);

  // Function to highlight search term in text
  const highlightSearchTerm = (text: string, term: string) => {
    if (!term.trim()) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ?
        <mark key={index} className="bg-primary text-primary-foreground">{part}</mark> :
        part
    );
  };

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [filteredLogs]);

  // Calculate available height for logs container (sadly i had to do this)
  useEffect(() => {
    const calculateMaxHeight = () => {
      if (headerRef.current) {
        const headerRect = headerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const reservedSpace = 20; // Some padding/margin space
        const availableHeight = viewportHeight - headerRect.bottom - reservedSpace;
        setMaxLogsHeight(`${Math.max(200, availableHeight)}px`);
      }
    };

    calculateMaxHeight();
    window.addEventListener('resize', calculateMaxHeight);
    return () => window.removeEventListener('resize', calculateMaxHeight);
  }, [fnDeployment.data]);

  if (fn.isLoading) {
    return null;
  }

  if (fn.isError || !fn.data) {
    return 'Upsii! Error cargando la función';
  }

  return (
    <div className="flex flex-col px-6 pt-6 w-full h-full">
      <div ref={headerRef}>
        <header>
          <h2 className="text-xl mb-5">
            <span className="text-muted-foreground">Funciones /</span>&nbsp;<span className="text-foreground">{fn.data.name}</span>
          </h2>
        </header>
        <div className="flex text-sm flex-col w-full bg-card overflow-hidden">
          <div className="flex p-4 gap-12">
            <div className="flex-col">
              <div className="mb-2">Descripción</div>
              <div className="py-2">
                Función {fn.data.name} usada como handler HTTP
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
              <div className="flex px-4 mb-4">
                <div className="flex gap-8 bg-input w-full rounded-md p-4 space-y-4">
                  <div className="m-0">
                    <div className="mb-2 font-medium">Commit</div>
                    <div className="flex items-center gap-2">
                      <GitCommit className="size-4 text-muted-foreground" />
                      <span className="font-mono">
                        {fnDeployment.data.project_build_id.commit_sha?.substring(0, 7)}
                      </span>
                      <span className="text-muted-foreground">
                        {fnDeployment.data.project_build_id.commit_short_description || "Sin descripción"}
                      </span>
                    </div>
                  </div>

                  <div className="m-0">
                    <div className="mb-2 font-medium">Branch</div>
                    <div className="flex items-center gap-2">
                      <GitBranch className="size-4 text-muted-foregrhighlightSearchTermound" />
                      <span className="">
                        {fnDeployment.data.project_build_id.branch_name}
                      </span>
                    </div>
                  </div>

                  <div className="m-0">
                    <div className="mb-2 font-medium">Fecha</div>
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {fnDeployment.data.project_build_id.created_at && toESString(fnDeployment.data.project_build_id.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          }
        </div>
        <div className="mt-1 mb-3 pl-2">
          {/* <h3 className="text-lg">Logs stream</h3> */}
        </div>
        <div className="mb-3 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
            <Input
              type="text"
              placeholder="Buscar logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {searchTerm && (
            <span className="text-sm text-muted-foreground">
              {filteredLogs.length} de {logs.length} logs
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col mb-3 bg-sidebar min-h-0" style={{ maxHeight: maxLogsHeight }}>
        <div
          ref={logsContainerRef}
          className="overflow-y-auto h-full p-4 font-mono text-[0.85rem]"
          style={{
            scrollbarWidth: 'thin',
          }}
        >
          {filteredLogs.length === 0 ? (
            <div className="text-gray-500 text-center py-8 h-full flex items-center justify-center">
              {searchTerm ? "No se encontraron logs que coincidan con la búsqueda" : "No hay logs disponibles"}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="group flex gap-6 hover:bg-muted/50 rounded px-2 py-1 m-0"
                >
                  <span className="text-muted-foreground shrink-0">
                    {dateToTimeFormattedString(log.timestamp)}
                  </span>
                  <span className="text-foreground flex-1">
                    {highlightSearchTerm(log.message, searchTerm)}
                  </span>
                  <button
                    onClick={() => copyLogToClipboard(log)}
                    className="opacity-0 group-hover:opacity-100 shrink-0 hover:bg-muted rounded p-1"
                    title="Copiar log"
                  >
                    <Copy className="size-3 text-muted-foreground" />
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
