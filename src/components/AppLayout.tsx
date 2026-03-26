import { useState } from "react";
import AppHeader from "./AppHeader";
import AppMenu, { menuGroups, authMenuItem } from "./AppMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation, useNavigate } from "react-router-dom";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside
          className={`border-r border-border bg-card flex flex-col transition-all duration-300 ${
            isSidebarCollapsed ? "w-20" : "w-72"
          }`}
        >
          <div className="p-4 border-b border-border flex items-center justify-between gap-2">
            {!isSidebarCollapsed && (
              <h2 className="text-lg font-bold text-foreground whitespace-nowrap">Learn & Grow</h2>
            )}
            <button
              onClick={() => setIsSidebarCollapsed((prev) => !prev)}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="w-4 h-4 text-foreground" />
              ) : (
                <PanelLeftClose className="w-4 h-4 text-foreground" />
              )}
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto p-3 flex flex-col">
            <div className="flex-1">
              {menuGroups.map((group, groupIndex) => (
                <div key={group.heading} className={groupIndex > 0 ? "mt-6" : ""}>
                  {!isSidebarCollapsed && (
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                      {group.heading}
                    </h3>
                  )}
                  {group.items.map((item) => {
                    const isActive =
                      location.pathname === item.path ||
                      (item.path !== "/" && location.pathname.startsWith(item.path));

                    return (
                      <button
                        key={item.label}
                        onClick={() => navigate(item.path)}
                        className={`w-full flex items-start gap-3 p-3 rounded-lg transition-colors text-left group ${
                          isActive ? "bg-secondary" : "hover:bg-secondary"
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg transition-colors ${
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                          }`}
                        >
                          <item.icon className="w-4 h-4" />
                        </div>
                        {!isSidebarCollapsed && (
                          <div>
                            <p className="font-semibold text-foreground text-sm">{item.label}</p>
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Auth Button at Bottom */}
            <div className="mt-4 pt-4 border-t border-border">
              {(() => {
                const isActive = location.pathname === authMenuItem.path;
                return (
                  <button
                    onClick={() => navigate(authMenuItem.path)}
                    className={`w-full flex items-start gap-3 p-3 rounded-lg transition-colors text-left group ${
                      isActive ? "bg-secondary" : "hover:bg-secondary"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                      }`}
                    >
                      <authMenuItem.icon className="w-4 h-4" />
                    </div>
                    {!isSidebarCollapsed && (
                      <div>
                        <p className="font-semibold text-foreground text-sm">{authMenuItem.label}</p>
                        <p className="text-xs text-muted-foreground">{authMenuItem.description}</p>
                      </div>
                    )}
                  </button>
                );
              })()}
            </div>
          </nav>
        </aside>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <AppHeader onMenuToggle={() => setMenuOpen(true)} />
        {isMobile && <AppMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />}
        <main className="flex-1 pb-8 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
