import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUserContext";
import { useIsMobile } from "@/hooks/use-mobile";
import UserAvatar from "@/components/UserAvatar";

interface AppHeaderProps {
  onMenuToggle: () => void;
}

const AppHeader = ({ onMenuToggle }: AppHeaderProps) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const isMobile = useIsMobile();
  const profileUser = user as
    | (typeof user & {
        first_name?: string;
        last_name?: string;
        profile_picture?: string | null;
      })
    | null;

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-6 lg:px-8 py-3 bg-card/80 backdrop-blur-md border-b border-border">
      {/* Menu button only on mobile */}
      {isMobile && (
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
          aria-label="Menu"
        >
          <Menu className="w-5 h-5 text-foreground" />
        </button>
      )}

      <h1 className="text-lg font-extrabold tracking-tight text-foreground flex-1 text-center lg:text-left">
        NutriLearn
      </h1>

      <button
        onClick={() => navigate("/profile")}
        className="p-1 rounded-full hover:opacity-80 transition-opacity"
        aria-label="Profile"
      >
        <UserAvatar
          firstName={profileUser?.first_name}
          lastName={profileUser?.last_name}
          profilePicture={profileUser?.profile_picture}
          size="sm"
        />
      </button>
    </header>
  );
};

export default AppHeader;