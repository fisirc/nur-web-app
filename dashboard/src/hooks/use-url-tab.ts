import type { URLTab } from "@/types";
import { useLocation } from "wouter";

const useURLTab = (tabs: URLTab[]): URLTab | undefined => {
  const [location] = useLocation();
  return tabs.find((tab) => location.startsWith(tab.url));
};

export default useURLTab;
