import { useTheme } from "./theme-provider";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "./ui/dropdown-menu";
import { Check, Laptop, Moon, Sun, type LucideIcon } from "lucide-react";

type ThemeOption = {
  value: "light" | "dark" | "system";
  label: string;
  icon: LucideIcon;
};

const themeOptions: ThemeOption[] = [
  {
    value: "light",
    label: "Claro",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Oscuro",
    icon: Moon,
  },
  {
    value: "system",
    label: "Sistema",
    icon: Laptop,
  },
];

const UserAvatar = () => {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <img src="https://picsum.photos/50" className="size-8 rounded-full" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="overflow-visible">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Tema</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {themeOptions.map((themeOption) => (
              <DropdownMenuItem
                key={themeOption.value}
                onClick={() => setTheme(themeOption.value)}
              >
                <div className="flex w-full items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <themeOption.icon />
                    <span>{themeOption.label}</span>
                  </div>
                  <div>{themeOption.value === theme && <Check />}</div>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatar;
