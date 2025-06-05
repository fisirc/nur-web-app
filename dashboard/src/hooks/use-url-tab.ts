import type { URLTab } from "@/types";
import { useLocation } from "wouter";

const useURLTab = (tabs: URLTab[]): URLTab | undefined => {
  const [location] = useLocation();
  return tabs.find((tab) => tab.url === location);
};

export default useURLTab;
