import { Button } from "@/components/ui/button";
import type { MountedFunction } from "../types";

const NewMountedFunctionButton = () => {
  return <Button>Montar función</Button>;
};

export default ({ functions }: { functions: MountedFunction[] }) => {
  if (!functions.length)
    return (
      <div className="size-xs text-muted-foreground flex flex-row items-center justify-center gap-4">
        No hay funciones montadas a esta ruta.
        <NewMountedFunctionButton />
      </div>
    );

  return (
    <div className="flex grow flex-col gap-8">
      <h2 className="text-lg">Funciones montadas</h2>
    </div>
  );
};
