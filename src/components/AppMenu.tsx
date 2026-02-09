import { X, User, BookOpen, Flame, Settings, Info, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AppMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: User, label: "Profile", description: "View streaks, badges, progress", path: "/profile" },
  { icon: BookOpen, label: "Lessons", description: "What would you like to learn next?", path: "/" },
  { icon: Flame, label: "Streaks", description: "Don't miss your daily goals!", path: "/profile" },
  { icon: Settings, label: "Settings", description: "Adjust your preferences", path: "/" },
  { icon: Info, label: "About", description: "Learn about our mission", path: "/" },
  { icon: MessageCircle, label: "Helper Bot", description: "Ask our bot questions as you go!", path: "/" },
];

const AppMenu = ({ isOpen, onClose }: AppMenuProps) => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-card shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <nav className="p-3">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavigate(item.path)}
              className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-secondary transition-colors text-left group"
            >
              <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <item.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

export default AppMenu;
