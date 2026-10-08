import { matchPath } from "react-router-dom";
import type { NavItem } from "@/config/navigation";

export function getActiveNavPath(
  items: NavItem[],
  pathname: string,
): string | undefined {
  let best: NavItem | undefined;
  for (const item of items) {
    if (!matchPath({ path: item.path, end: !!item.end }, pathname)) continue;
    if (!best || item.path.length > best.path.length) best = item;
  }
  return best?.path;
}