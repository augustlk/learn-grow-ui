import { User } from "lucide-react";

interface UserAvatarProps {
  firstName?: string;
  lastName?: string;
  profilePicture?: string | null;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

const sizeMap = {
  sm: { container: "w-8 h-8", text: "text-xs", icon: "w-4 h-4" },
  md: { container: "w-10 h-10", text: "text-sm", icon: "w-5 h-5" },
  lg: { container: "w-20 h-20", text: "text-2xl", icon: "w-10 h-10" },
};

const UserAvatar = ({
  firstName,
  lastName,
  profilePicture,
  size = "md",
  onClick,
}: UserAvatarProps) => {
  const { container, text, icon } = sizeMap[size];
  const initials =
    firstName && lastName
      ? `${firstName[0]}${lastName[0]}`.toUpperCase()
      : null;

  return (
    <div
      onClick={onClick}
      className={`${container} rounded-full overflow-hidden flex items-center justify-center bg-primary/20 border-2 border-border ${onClick ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}`}
    >
      {profilePicture ? (
        <img
          src={profilePicture}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      ) : initials ? (
        <span className={`${text} font-bold text-primary`}>{initials}</span>
      ) : (
        <User className={`${icon} text-muted-foreground`} />
      )}
    </div>
  );
};

export default UserAvatar;