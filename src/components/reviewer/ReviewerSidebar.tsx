
import { NavLink, useLocation } from "react-router-dom";
import { 
  Home, 
  FileText, 
  Users, 
  Settings,
  GraduationCap,
  User,
  HelpCircle
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const reviewerNavItems = [
  { title: "Dashboard", url: "/reviewer", icon: Home },
  { title: "Reviews", url: "/reviewer/reviews", icon: FileText },
  { title: "Students", url: "/reviewer/students", icon: Users },
  { title: "Profile", url: "/reviewer/profile", icon: User },
  { title: "Support", url: "/reviewer/support", icon: HelpCircle },
  { title: "Settings", url: "/reviewer/settings", icon: Settings },
];

export function ReviewerSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/reviewer") {
      return currentPath === "/reviewer";
    }
    return currentPath.startsWith(path);
  };

  const getNavCls = (path: string) =>
    isActive(path) 
      ? "bg-cherry-500/20 text-cherry-300 border-r-2 border-cherry-500" 
      : "hover:bg-muted/50";

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-64"} transition-all duration-300 border-r border-border/50`}
      collapsible="icon"
    >
      <SidebarContent>
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-cherry rounded-lg flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="text-lg font-bold text-gradient">Zane Ωmega</h2>
                <p className="text-xs text-muted-foreground">Reviewer Portal</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {reviewerNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={`${getNavCls(item.url)} transition-all duration-200`}
                    >
                      <item.icon className="h-4 w-4 mr-3" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
