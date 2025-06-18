const roleLabel = (value: string): string => {
  switch (value) {
    case "owner":
      return "Propetiario";
    case "admin":
      return "Administrador";
    case "developer":
      return "Desarrollador";
    case "read-only":
      return "Solo escritura";
  }
  throw new Error(`Unknown role value: ${value}`);
};

export default roleLabel;
