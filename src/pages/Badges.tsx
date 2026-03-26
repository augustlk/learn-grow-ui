import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { useUser } from "@/hooks/useUserContext";
import { getAuthHeaders } from "@/lib/api";

type Badge = {
  badge_id: number;
  badge_name: string;
  badge_description: string | null;
  badge_level: number;
  icon: string | null;
  earned: boolean;
};

export default function Badges() {
  const { user } = useUser();
  const location = useLocation();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.user_id) return;
    setLoading(true);

    async function fetchBadges() {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "";

        const [allRes, earnedRes] = await Promise.all([
          fetch(`${apiUrl}/api/badges`),
          fetch(`${apiUrl}/api/users/${user!.user_id}/badges`, { headers: getAuthHeaders() }),
        ]);

        const [allJson, earnedJson] = await Promise.all([
          allRes.json(),
          earnedRes.json(),
        ]);

        const allBadges = Array.isArray(allJson.data) ? allJson.data : [];
        const earnedIds = new Set<number>(
          Array.isArray(earnedJson.data)
            ? earnedJson.data.map((b: { badge_id: number }) => b.badge_id)
            : []
        );

        setBadges(
          allBadges.map((b: Omit<Badge, "earned">) => ({
            ...b,
            earned: earnedIds.has(b.badge_id),
          }))
        );
      } catch (err) {
        console.error("Failed to fetch badges", err);
      } finally {
        setLoading(false);
      }
    }

    fetchBadges();
  }, [user?.user_id, location.pathname]);

  const earnedCount = badges.filter((b) => b.earned).length;

  return (
    <AppLayout>
      <div className="flex flex-col gap-4 px-4 pt-5 pb-8">

        <div>
          <h1 className="text-xl font-extrabold text-foreground">Badges</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Complete lessons and streaks to unlock achievements.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-sm text-muted-foreground">Loading badges...</p>
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-border card-elevated p-4">
            <h2 className="text-sm font-extrabold text-foreground mb-3 flex items-center gap-1.5">
              🏅 Badges
              <span className="ml-auto text-xs font-semibold text-primary">
                {earnedCount} / {badges.length} earned
              </span>
            </h2>

            {badges.length === 0 ? (
              <p className="text-xs text-muted-foreground">No badges available yet.</p>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {badges.map((badge) => (
                  <div
                    key={badge.badge_id}
                    className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-center ${
                      badge.earned
                        ? "bg-secondary border-border"
                        : "bg-muted/40 border-transparent opacity-40"
                    }`}
                  >
                    <span className="text-2xl">
                      {badge.earned ? (badge.icon ?? "🏅") : "🔒"}
                    </span>
                    <span className="text-[10px] font-bold text-foreground leading-tight">
                      {badge.badge_name}
                    </span>
                    {badge.badge_description && (
                      <span className="text-[9px] text-muted-foreground leading-tight">
                        {badge.badge_description}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
