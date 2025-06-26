import useCurrentFunction from "../hooks/use-current-function";
import useLastFunctionDeployment from "../hooks/use-last-deployment";
import { GitBranch, GitCommit, Calendar, Search, Copy, BarChart3, ExternalLink, Play } from "lucide-react";
import { dateToTimeFormattedString, toESString } from "@/utils/date-formatter";
import { useEffect, useRef, useState, useMemo } from "react";
import useLogsStreaming from "../hooks/use-logs-streaming";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  // REST client state
  const [httpMethod, setHttpMethod] = useState("GET");
  const [requestUrl, setRequestUrl] = useState("");
  const [requestHeaders, setRequestHeaders] = useState("");
  const [requestBody, setRequestBody] = useState("");
  const [response, setResponse] = useState<{
    status?: number;
    statusText?: string;
    headers?: Record<string, string>;
    body?: any;
    error?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Copy log to clipboard
  const copyLogToClipboard = async (log: any) => {
    const logText = `[${dateToTimeFormattedString(log.timestamp)}] ${log.message}`;
    try {
      await navigator.clipboard.writeText(logText);
    } catch (err) {
      console.error("Failed to copy log:", err);
    }
  };

  // Send HTTP request
  const sendRequest = async () => {
    if (!requestUrl.trim()) return;

    setIsLoading(true);
    setResponse(null);

    try {
      // Parse headers
      const headers: Record<string, string> = {};
      if (requestHeaders.trim()) {
        requestHeaders.split('\n').forEach(line => {
          const [key, ...valueParts] = line.split(':');
          if (key && valueParts.length > 0) {
            headers[key.trim()] = valueParts.join(':').trim();
          }
        });
      }

      // Prepare request options
      const requestOptions: RequestInit = {
        method: httpMethod,
        headers,
      };

      // Add body for non-GET requests
      if (httpMethod !== 'GET' && requestBody.trim()) {
        requestOptions.body = requestBody;
      }

      // Use CORS proxy for the request
      const proxyUrl = 'https://cors.paoloose.site/';
      const proxiedUrl = proxyUrl + requestUrl;

      const res = await fetch(proxiedUrl, requestOptions);

      // Parse response headers
      const responseHeaders: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });      // Try to parse response body
      let responseBody: any;
      const contentType = res.headers.get('content-type') || '';

      // Read the response body as text first
      const responseText = await res.text();

      // Then try to parse as JSON if content type suggests it
      if (contentType.includes('application/json') && responseText.trim()) {
        try {
          responseBody = JSON.parse(responseText);
        } catch {
          responseBody = responseText;
        }
      } else {
        responseBody = responseText;
      }

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: responseHeaders,
        body: responseBody,
      });

    } catch (error) {
      setResponse({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Clear request form
  const clearRequest = () => {
    setHttpMethod("GET");
    setRequestUrl(fn?.id ? `https://nur.gateway.sanmarcux.org/${fn.id}/` : "");
    setRequestHeaders("");
    setRequestBody("");
    setResponse(null);
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
  const project = projectQr.data;

  // Initialize request URL when function data is available
  useEffect(() => {
    if (fn?.id && !requestUrl) {
      setRequestUrl(`https://nur.gateway.sanmarcux.org/${fn.id}/`);
    }
  }, [fn?.id, requestUrl, setRequestUrl]);

  if (!fn) return <QueryHandler qr={functionQr} />;
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

          <div className="px-4 pb-4">
            <div className="bg-input rounded-md p-4">
              <div className="mb-2 font-medium">Endpoint</div>
              <div className="flex items-center gap-2">
                <a
                  href={`https://nur.gateway.sanmarcux.org/${fn.id}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-background px-3 py-2 rounded text-sm font-mono flex-1 hover:bg-muted transition-all cursor-pointer border border-border hover:border-primary/50 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline decoration-dotted underline-offset-2 flex items-center gap-2 group"
                >
                  <span>https://nur.gateway.sanmarcux.org/{fn.id}/[path]</span>
                  <ExternalLink className="size-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                </a>
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(`https://nur.gateway.sanmarcux.org/${fn.id}/`);
                    } catch (err) {
                      console.error("Failed to copy endpoint:", err);
                    }
                  }}
                  className="hover:bg-muted shrink-0 rounded p-1"
                  title="Copiar endpoint"
                >
                  <Copy className="text-muted-foreground size-4" />
                </button>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <ExternalLink className="size-3" />
                  Haz clic para abrir el endpoint • Reemplaza [path] con cualquier ruta que tu función maneje
                </span>
              </div>
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
      </div>

      <Tabs defaultValue="logs" className="flex flex-col flex-1 mt-6">
        <TabsList className="grid w-full grid-cols-3 bg-black">
          <TabsTrigger
            value="logs"
            className="flex items-center gap-2 cursor-pointer text-gray-600 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-2xl data-[state=active]:font-semibold transition-all hover:text-gray-400"
          >
            <Search className="size-4" />
            Logs
          </TabsTrigger>
          <TabsTrigger
            value="test"
            className="flex items-center gap-2 cursor-pointer text-gray-600 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-2xl data-[state=active]:font-semibold transition-all hover:text-gray-400"
          >
            <Play className="size-4" />
            Test
          </TabsTrigger>
          <TabsTrigger
            value="metrics"
            className="flex items-center gap-2 cursor-pointer text-gray-600 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-2xl data-[state=active]:font-semibold transition-all hover:text-gray-400"
          >
            <BarChart3 className="size-4" />
            Métricas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="flex flex-col flex-1 mt-4">
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
          <div
            className="bg-sidebar mb-3 flex min-h-0 flex-col flex-1"
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
        </TabsContent>

        <TabsContent value="test" className="flex flex-col flex-1 mt-4">
          <div className="bg-sidebar rounded-md p-4 flex-1">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Test your function</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Use this HTTP client to test your serverless function. The endpoint URL is pre-filled for you.
              </p>
            </div>

            <div className="bg-background rounded-lg border border-border p-4 h-full min-h-[500px] flex gap-4">
              {/* Request Panel */}
              <div className="flex flex-col flex-1">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Method</label>
                  <select
                    value={httpMethod}
                    onChange={(e) => setHttpMethod(e.target.value)}
                    className="w-32 px-3 py-2 border border-border rounded-md bg-background"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                    <option value="PATCH">PATCH</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">URL</label>
                  <input
                    type="text"
                    value={requestUrl}
                    onChange={(e) => setRequestUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background font-mono text-sm"
                    placeholder="Enter endpoint path..."
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Headers</label>
                  <textarea
                    value={requestHeaders}
                    onChange={(e) => setRequestHeaders(e.target.value)}
                    className="w-full h-24 px-3 py-2 border border-border rounded-md bg-background font-mono text-sm resize-none"
                    placeholder="Content-Type: application/json&#10;Authorization: Bearer your-token"
                  />
                </div>

                <div className="mb-4 flex-1">
                  <label className="block text-sm font-medium mb-2">Body</label>
                  <textarea
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    className="w-full flex-1 min-h-[200px] px-3 py-2 border border-border rounded-md bg-background font-mono text-sm resize-none"
                    placeholder='{"key": "value"}'
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={sendRequest}
                    disabled={isLoading}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Play className="size-4" />
                    {isLoading ? 'Sending...' : 'Send Request'}
                  </button>
                  <button
                    onClick={clearRequest}
                    className="bg-muted text-muted-foreground px-4 py-2 rounded-md hover:bg-muted/80 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Response Panel */}
              <div className="flex flex-col flex-1">
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Response</h4>
                </div>

                <div className="bg-sidebar rounded-lg border border-border p-4 flex-1 min-h-0 overflow-hidden">
                  {response ? (
                    <div className="h-full flex flex-col">
                      {response.error ? (
                        <div className="text-red-500 font-mono text-sm">
                          <div className="mb-2 font-semibold">Error:</div>
                          <div>{response.error}</div>
                        </div>
                      ) : (
                        <>
                          {/* Status */}
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium">Status:</span>
                              <span className={`px-2 py-1 rounded text-xs font-mono ${
                                response.status && response.status >= 200 && response.status < 300
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              }`}>
                                {response.status} {response.statusText}
                              </span>
                            </div>
                          </div>

                          {/* Headers */}
                          {response.headers && Object.keys(response.headers).length > 0 && (
                            <div className="mb-4">
                              <div className="text-sm font-medium mb-2">Headers:</div>
                              <div className="bg-background rounded p-2 max-h-24 overflow-y-auto">
                                <pre className="text-xs font-mono text-muted-foreground">
                                  {Object.entries(response.headers).map(([key, value]) => (
                                    <div key={key}>{key}: {value}</div>
                                  ))}
                                </pre>
                              </div>
                            </div>
                          )}

                          {/* Body */}
                          <div className="flex-1 min-h-0">
                            <div className="text-sm font-medium mb-2">Body:</div>
                            <div className="bg-background rounded p-4 h-full overflow-auto">
                              <pre className="text-xs font-mono whitespace-pre-wrap">
                                {typeof response.body === 'string'
                                  ? response.body
                                  : JSON.stringify(response.body, null, 2)
                                }
                              </pre>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      Send a request to see the response here
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="flex flex-col flex-1 mt-4">
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <BarChart3 className="mx-auto mb-4 size-16 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">TODO: Métricas en tiempo real</h3>
              <p className="text-muted-foreground">
                Aquí se mostrarán gráficos de métricas en tiempo real como:
              </p>
              <ul className="text-muted-foreground mt-2 space-y-1">
                <li>• Invocaciones por minuto</li>
                <li>• Tiempo de respuesta promedio</li>
                <li>• Errores y códigos de estado</li>
                <li>• Uso de memoria y CPU</li>
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FunctionDetail;
