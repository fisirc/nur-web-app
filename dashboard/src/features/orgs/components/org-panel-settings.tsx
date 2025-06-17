// import QueryHandler from "@/components/query-handler";
import { ScrollArea } from "@/components/ui/scroll-area";

const OrgPanelTeam = () => {
  // const qr = useCurrentOrgMembers();
  // const { data } = qr;
  // if (!data) return <QueryHandler qr={qr} />;

  return (
    <ScrollArea className="grow">
      <div className="flex grow flex-col gap-8 p-8">
        <h1 className="text-3xl">Configuración</h1>
      </div>
    </ScrollArea>
  );
};

export default OrgPanelTeam;
