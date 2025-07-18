import useCurrentFunction from "../hooks/use-current-function";
import useLastFunctionDeployment from "../hooks/use-last-deployment";
import {
  GitBranch,
  GitCommit,
  Calendar,
  Search,
  Copy,
  BarChart3,
  ExternalLink,
  Play,
} from "lucide-react";
import { dateToTimeFormattedString, toESString } from "@/utils/date-formatter";
import { useEffect, useRef, useState, useMemo } from "react";
import useLogsStreaming from "../hooks/use-logs-streaming";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import QueryHandler from "@/components/query-handler";
import useCurrentProject from "@/features/projects/hooks/use-current-project";
import { ScrollArea } from "@/components/ui/scroll-area";

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
        requestHeaders.split("\n").forEach((line) => {
          const [key, ...valueParts] = line.split(":");
          if (key && valueParts.length > 0) {
            headers[key.trim()] = valueParts.join(":").trim();
          }
        });
      }

      // Prepare request options
      const requestOptions: RequestInit = {
        method: httpMethod,
        headers,
      };

      // Add body for non-GET requests
      if (httpMethod !== "GET" && requestBody.trim()) {
        requestOptions.body = requestBody;
      }

      // Use CORS proxy for the request
      const proxyUrl = "https://cors.paoloose.site/";
      const proxiedUrl = proxyUrl + requestUrl;

      const res = await fetch(proxiedUrl, requestOptions);

      // Parse response headers
      const responseHeaders: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      }); // Try to parse response body
      let responseBody: any;
      const contentType = res.headers.get("content-type") || "";

      // Read the response body as text first
      const responseText = await res.text();

      // Then try to parse as JSON if content type suggests it
      if (contentType.includes("application/json") && responseText.trim()) {
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
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Clear request form
  const clearRequest = () => {
    setHttpMethod("GET");
    setRequestUrl(fn?.id ? `https://nur.paoloose.site/${fn.id}/` : "");
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
      setRequestUrl(`https://nur.paoloose.site/${fn.id}/`);
    }
  }, [fn?.id, requestUrl, setRequestUrl]);

  if (!fn) return <QueryHandler qr={functionQr} />;
  if (!project) return <QueryHandler qr={projectQr} />;

  return (
    <ScrollArea className="grow">
      <div className="flex flex-col px-6 pt-6">
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
          <div className="bg-card flex w-full flex-col overflow-hidden text-sm" role="region" aria-label="Información de la función">
            <div className="flex gap-12 p-4">
              <div className="flex-col">
                <div className="mb-2">Descripción</div>
                <div className="py-2">
                  Función {fn.name} usada como handler HTTP
                </div>
              </div>
              <div className="flex-col">
                <div className="mb-2">Estado</div>
                <div className="py-2" aria-live="polite">🟢 Activo y listo</div>
              </div>
            </div>

            <div className="px-4 pb-4">
              <div className="bg-input rounded-md p-4">
                <div className="mb-2 font-medium" id="endpoint-label">Endpoint</div>
                <div className="flex items-center gap-2">                    <a
                    href={`https://nur.paoloose.site/${fn.id}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-background hover:bg-muted border-border hover:border-primary/50 group flex flex-1 cursor-pointer items-center gap-2 rounded border px-3 py-2 font-mono text-sm text-blue-700 underline decoration-dotted underline-offset-2 transition-all hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-100"
                    aria-labelledby="endpoint-label"
                    aria-describedby="endpoint-description"
                  >
                    <span>https://nur.paoloose.site/{fn.id}/[path]</span>
                    <ExternalLink className="size-3 opacity-60 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                  </a>
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(
                          `https://nur.paoloose.site/${fn.id}/`,
                        );
                      } catch (err) {
                        console.error("Failed to copy endpoint:", err);
                      }
                    }}
                    className="hover:bg-muted shrink-0 rounded p-1"
                    aria-label="Copiar endpoint"
                    title="Copiar endpoint"
                  >
                    <Copy className="text-muted-foreground size-4" aria-hidden="true" />
                  </button>
                </div>
                <div className="text-muted-foreground mt-2 text-xs" id="endpoint-description">
                  <span className="inline-flex items-center gap-1">
                    <ExternalLink className="size-3" aria-hidden="true" />
                    Haz clic para abrir el endpoint • Reemplaza [path] con
                    cualquier ruta que tu función maneje
                  </span>
                </div>
              </div>
            </div>
            {fnDeployment.data && fnDeployment.data.project_build_id && (
              <div className="mb-4 flex px-4">
                <div className="bg-input flex w-full gap-8 space-y-4 rounded-md p-4" role="region" aria-label="Información de despliegue">
                  <div className="m-0">
                    <div className="mb-2 font-medium" id="commit-label">Commit</div>
                    <div className="flex items-center gap-2" aria-labelledby="commit-label">
                      <GitCommit className="text-muted-foreground size-4" aria-hidden="true" />
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
                    <div className="mb-2 font-medium" id="branch-label">Branch</div>
                    <div className="flex items-center gap-2" aria-labelledby="branch-label">
                      <GitBranch className="text-muted-foregrhighlightSearchTermound size-4" aria-hidden="true" />
                      <span className="">
                        {fnDeployment.data.project_build_id.branch_name}
                      </span>
                    </div>
                  </div>

                  <div className="m-0">
                    <div className="mb-2 font-medium" id="date-label">Fecha</div>
                    <div className="flex items-center gap-2" aria-labelledby="date-label">
                      <Calendar className="text-muted-foreground size-4" aria-hidden="true" />
                      <span className="text-gray-300">
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

        <Tabs defaultValue="logs" className="mt-6 flex flex-1 flex-col">              <TabsList className="grid w-full grid-cols-3 bg-black" aria-label="Pestañas de información de la función">
            <TabsTrigger
              value="logs"
              className="flex cursor-pointer items-center gap-2 text-gray-400 transition-all hover:text-gray-300 data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-black data-[state=active]:shadow-2xl"
              aria-label="Ver logs de la función"
            >
              <Search className="size-4" aria-hidden="true" />
              Logs
            </TabsTrigger>
            <TabsTrigger
              value="test"
              className="flex cursor-pointer items-center gap-2 text-gray-400 transition-all hover:text-gray-300 data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-black data-[state=active]:shadow-2xl"
              aria-label="Probar la función"
            >
              <Play className="size-4" aria-hidden="true" />
              Test
            </TabsTrigger>
            <TabsTrigger
              value="metrics"
              className="flex cursor-pointer items-center gap-2 text-gray-400 transition-all hover:text-gray-300 data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-black data-[state=active]:shadow-2xl"
              aria-label="Ver métricas de la función"
            >
              <BarChart3 className="size-4" aria-hidden="true" />
              Métricas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="logs" className="mt-4 flex flex-1 flex-col" role="tabpanel" aria-label="Panel de logs">
            <div className="mb-3 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2 transform" aria-hidden="true" />
                <Input
                  type="text"
                  placeholder="Buscar logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  aria-label="Buscar logs"
                />
              </div>
              {searchTerm && (
                <span className="text-muted-foreground text-sm" aria-live="polite">
                  {filteredLogs.length} de {logs.length} logs
                </span>
              )}
            </div>
            <div
              className="bg-sidebar mb-3 flex min-h-0 flex-1 flex-col"
              style={{ maxHeight: maxLogsHeight }}
            >
              <div
                ref={logsContainerRef}
                className="h-full overflow-y-auto p-4 font-mono text-[0.85rem]"
                style={{
                  scrollbarWidth: "thin",
                }}
                role="log"
                aria-label="Registros de la función"
                aria-live="polite"
              >
                {filteredLogs.length === 0 ? (
                  <div className="flex h-full items-center justify-center py-8 text-center text-gray-300" aria-live="polite">
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
                        <span className="shrink-0 text-gray-300">
                          {dateToTimeFormattedString(log.timestamp)}
                        </span>
                        <span className="text-foreground flex-1">
                          {highlightSearchTerm(log.message, searchTerm)}
                        </span>
                        <button
                          onClick={() => copyLogToClipboard(log)}
                          className="hover:bg-muted shrink-0 rounded p-1 opacity-0 group-hover:opacity-100"
                          title="Copiar log"
                          aria-label={`Copiar log: ${log.message}`}
                        >
                          <Copy className="text-muted-foreground size-3" aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="test" className="mt-4 flex flex-1 flex-col" role="tabpanel" aria-label="Panel de prueba de la función">
            <div className="bg-sidebar flex-1 rounded-md p-4">
              <div className="mb-4">
                <h3 className="mb-2 text-lg font-semibold">
                  Test your function
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Use this HTTP client to test your serverless function. The
                  endpoint URL is pre-filled for you.
                </p>
              </div>

              <div className="bg-background border-border flex h-full min-h-[500px] gap-4 rounded-lg border p-4">
                {/* Request Panel */}
                <div className="flex flex-1 flex-col" role="region" aria-label="Panel de solicitud">
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium" id="method-label">
                      Method
                    </label>
                    <select
                      value={httpMethod}
                      onChange={(e) => setHttpMethod(e.target.value)}
                      className="border-border bg-background w-32 rounded-md border px-3 py-2"
                      aria-labelledby="method-label"
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                      <option value="PATCH">PATCH</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium" id="url-label">
                      URL
                    </label>
                    <input
                      type="text"
                      value={requestUrl}
                      onChange={(e) => setRequestUrl(e.target.value)}
                      className="border-border bg-background w-full rounded-md border px-3 py-2 font-mono text-sm"
                      placeholder="Enter endpoint path..."
                      aria-labelledby="url-label"
                      aria-describedby="url-description"
                    />
                    <div id="url-description" className="sr-only">
                      Ingresa la URL completa del endpoint para probar la función
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium" id="headers-label">
                      Headers
                    </label>
                    <textarea
                      value={requestHeaders}
                      onChange={(e) => setRequestHeaders(e.target.value)}
                      className="border-border bg-background h-24 w-full resize-none rounded-md border px-3 py-2 font-mono text-sm"
                      placeholder="Content-Type: application/json&#10;Authorization: Bearer your-token"
                      aria-labelledby="headers-label"
                      aria-describedby="headers-description"
                    />
                    <div id="headers-description" className="sr-only">
                      Ingresa los encabezados de la solicitud HTTP, un encabezado por línea en formato clave: valor
                    </div>
                  </div>

                  <div className="mb-4 flex-1">
                    <label className="mb-2 block text-sm font-medium" id="body-label">
                      Body
                    </label>
                    <textarea
                      value={requestBody}
                      onChange={(e) => setRequestBody(e.target.value)}
                      className="border-border bg-background min-h-[200px] w-full flex-1 resize-none rounded-md border px-3 py-2 font-mono text-sm"
                      placeholder='{"key": "value"}'
                      aria-labelledby="body-label"
                      aria-describedby="body-description"
                    />
                    <div id="body-description" className="sr-only">
                      Ingresa el cuerpo de la solicitud HTTP, generalmente en formato JSON para solicitudes POST, PUT o PATCH
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={sendRequest}
                      disabled={isLoading}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Enviar solicitud"
                      aria-disabled={isLoading}
                    >
                      <Play className="size-4" aria-hidden="true" />
                      {isLoading ? "Sending..." : "Send Request"}
                    </button>
                    <button
                      onClick={clearRequest}
                      className="bg-muted text-muted-foreground hover:bg-muted/80 rounded-md px-4 py-2 transition-colors"
                      aria-label="Limpiar formulario"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Response Panel */}
                <div className="flex flex-1 flex-col" role="region" aria-label="Panel de respuesta">
                  <div className="mb-4">
                    <h4 className="mb-2 text-sm font-medium" id="response-label">Response</h4>
                  </div>

                  <div
                    className="bg-sidebar border-border min-h-0 flex-1 overflow-hidden rounded-lg border p-4"
                    aria-live="polite"
                    aria-labelledby="response-label"
                  >
                    {response ? (
                      <div className="flex h-full flex-col">
                        {response.error ? (
                          <div className="font-mono text-sm text-red-500" role="alert">
                            <div className="mb-2 font-semibold">Error:</div>
                            <div>{response.error}</div>
                          </div>
                        ) : (
                          <>
                            {/* Status */}
                            <div className="mb-4">
                              <div className="mb-2 flex items-center gap-2">
                                <span className="text-sm font-medium">
                                  Status:
                                </span>
                                <span
                                  className={`rounded px-2 py-1 font-mono text-xs ${response.status &&
                                    response.status >= 200 &&
                                    response.status < 300
                                    ? "bg-green-100 text-green-900 dark:bg-green-800 dark:text-green-50"
                                    : "bg-red-100 text-red-900 dark:bg-red-800 dark:text-red-50"
                                    }`}
                                  role="status"
                                >
                                  {response.status} {response.statusText}
                                </span>
                              </div>
                            </div>

                            {/* Headers */}
                            {response.headers &&
                              Object.keys(response.headers).length > 0 && (
                                <div className="mb-4">
                                  <div className="mb-2 text-sm font-medium" id="response-headers-label">
                                    Headers:
                                  </div>
                                  <div
                                    className="bg-background max-h-24 overflow-y-auto rounded p-2"
                                    aria-labelledby="response-headers-label"
                                  >
                                    <pre className="text-muted-foreground font-mono text-xs">
                                      {Object.entries(response.headers).map(
                                        ([key, value]) => (
                                          <div key={key} className="text-foreground">
                                            {key}: {value}
                                          </div>
                                        ),
                                      )}
                                    </pre>
                                  </div>
                                </div>
                              )}

                            {/* Body */}
                            <div className="min-h-0 flex-1">
                              <div className="mb-2 text-sm font-medium" id="response-body-label">
                                Body:
                              </div>
                              <div
                                className="bg-background h-full overflow-auto rounded p-4"
                                aria-labelledby="response-body-label"
                              >
                                <pre className="font-mono text-xs whitespace-pre-wrap">
                                  {typeof response.body === "string"
                                    ? response.body
                                    : JSON.stringify(response.body, null, 2)}
                                </pre>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-300" aria-label="Sin respuesta">
                        Send a request to see the response here
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="mt-4 flex flex-1 flex-col" role="tabpanel" aria-label="Panel de métricas">
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <BarChart3 className="text-muted-foreground mx-auto mb-4 size-16" aria-hidden="true" />
                <h3 className="mb-2 text-lg font-semibold">
                  TODO: Métricas en tiempo real
                </h3>
                <p className="text-gray-300">
                  Aquí se mostrarán gráficos de métricas en tiempo real como:
                </p>
                <ul className="mt-2 space-y-1 text-gray-300" aria-label="Tipos de métricas disponibles en el futuro">
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
    </ScrollArea>
  );
};

export default FunctionDetail;
