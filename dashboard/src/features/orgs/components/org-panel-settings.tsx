import QueryHandler from "@/components/query-handler";
import { ScrollArea } from "@/components/ui/scroll-area";
import useCurrentOrg from "../hooks/use-current-org";

const OrgPanelSettings = () => {
  const orgQr = useCurrentOrg();
  const { data } = orgQr;
  if (!data) return <QueryHandler qr={orgQr} />;

  return (
    <ScrollArea className="grow">
      <div className="flex grow flex-col gap-8 p-8">
        <h1 className="text-3xl">Configuración</h1>
      </div>
    </ScrollArea>
  );
};

export default OrgPanelSettings;
