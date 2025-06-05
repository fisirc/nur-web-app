import type { UseQueryResult } from "@tanstack/react-query";

const QueryHandler = ({ qr }: { qr: UseQueryResult }) => {
  if (qr.isLoading)
    return (
      <div className="flex items-center justify-center p-4">Cargando...</div>
    );

  if (qr.isError)
    return (
      <div className="flex items-center justify-center p-4">
        Error: {qr.error.message}
      </div>
    );
};

export default QueryHandler;
