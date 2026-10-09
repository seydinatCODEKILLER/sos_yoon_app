import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";
import { getNavItems, navigationByRole } from "@/config/navigation";
import { useNavBadges } from "@/shared/hooks/useNavBadges";
import { getActiveNavPath } from "@/shared/lib/getActiveNavPath";
import type { UserRole } from "@/types/user.types";
import { NavBadgeView } from "./NavBadgeView";
import { SidebarUserCard } from "./SidebarUserCard";

export function AppSidebar({ role }: { role: UserRole }) {
  const { pathname } = useLocation();
  const badges = useNavBadges(role);
  const sections = navigationByRole[role];
  const activePath = getActiveNavPath(getNavItems(role), pathname);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex h-12 items-center px-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          {/* TODO : remplacer par <BrandLogo /> quand le SVG sera prêt */}
          <span className="font-display text-xl font-extrabold tracking-wide text-(--nav-brand) group-data-[collapsible=icon]:hidden">
            SOSYOON
          </span>
          <span className="hidden size-8 shrink-0 items-center justify-center rounded-md bg-signal font-display text-sm font-semibold text-paper group-data-[collapsible=icon]:flex">
            SY
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {sections.map((section, i) => (
          <SidebarGroup key={section.title ?? i}>
            {section.title && (
              <SidebarGroupLabel className="text-[11px] font-medium uppercase tracking-wider text-(--nav-title)">
                {section.title}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map(({ label, path, icon: Icon, badge }) => {
                  const isActive = path === activePath;
                  return (
                    <SidebarMenuItem key={path}>
                      <SidebarMenuButton
                        render={<Link to={path} />}
                        isActive={isActive}
                        tooltip={label}
                        className="text-(--nav-muted) hover:bg-sidebar-accent hover:text-sidebar-foreground data-active:bg-(--nav-active-bg) data-active:font-medium data-active:text-(--nav-active-fg) data-active:hover:bg-(--nav-active-bg) data-active:hover:text-(--nav-active-fg)"
                      >
                        <Icon />
                        <span>{label}</span>
                        {badge && (
                          <span className="ml-auto flex items-center group-data-[collapsible=icon]:hidden">
                            <NavBadgeView
                              badge={badge}
                              value={
                                "key" in badge && badge.key
                                  ? badges[badge.key]
                                  : undefined
                              }
                              active={isActive}
                            />
                          </span>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarUserCard role={role} />
      </SidebarFooter>
    </Sidebar>
  );
}
