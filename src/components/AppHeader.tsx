import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUserContext";
import UserAvatar from "@/components/UserAvatar";

interface AppHeaderProps {
  onMenuToggle: () => void;
}

const AppHeader = ({ onMenuToggle }: AppHeaderProps) => {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-card/80 backdrop-blur-md border-b border-border">
      <button
        onClick={onMenuToggle}
        className="p-2 rounded-lg hover:bg-secondary transition-colors"
        aria-label="Menu"
      >
        <Menu className="w-5 h-5 text-foreground" />
      </button>

      <h1 className="text-lg font-extrabold tracking-tight text-foreground">
        NutriLearn
      </h1>

      <button
        onClick={() => navigate("/profile")}
        className="p-1 rounded-full hover:opacity-80 transition-opacity"
        aria-label="Profile"
      >
        <UserAvatar
          firstName={user?.first_name}
          lastName={user?.last_name}
          profilePicture={user?.profile_picture}
          size="sm"
        />
      </button>
    </header>
  );
};

export default AppHeader;