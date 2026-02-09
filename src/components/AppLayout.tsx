import { useState } from "react";
import AppHeader from "./AppHeader";
import AppMenu from "./AppMenu";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative">
      <AppHeader onMenuToggle={() => setMenuOpen(true)} />
      <AppMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="pb-8">{children}</main>
    </div>
  );
};

export default AppLayout;
