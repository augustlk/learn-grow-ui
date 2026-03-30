import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Bell, Moon, Clock, RotateCcw, ChevronRight, Volume2, VolumeX, Pencil } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ReminderTimeDialog, formatDisplayTime } from "@/components/ReminderTimeDialog";
import { useUser } from "@/hooks/useUserContext";
import { getAuthHeaders } from "@/lib/api";

const Settings = () => {
  const { user } = useUser();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });
  const [soundEffects, setSoundEffects] = useState(() => {
    const saved = localStorage.getItem("soundEffects");
    return saved ? JSON.parse(saved) : true;
  });
  const [soundVolume, setSoundVolume] = useState(() => {
    const saved = localStorage.getItem("soundVolume");
    return saved ? parseInt(saved, 10) : 70;
  });
  const [dailyReminder, setDailyReminder] = useState(true);
  const [reminderTime, setReminderTime] = useState("09:00");
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("soundEffects", JSON.stringify(soundEffects));
  }, [soundEffects]);

  useEffect(() => {
    localStorage.setItem("soundVolume", soundVolume.toString());
  }, [soundVolume]);

  // Load preferences from backend on mount
  useEffect(() => {
    if (!user?.user_id) return;
    const apiUrl = import.meta.env.VITE_API_URL || "";
    fetch(`${apiUrl}/api/users/${user.user_id}/preferences`, { headers: getAuthHeaders() })
      .then((r) => r.json())
      .then(({ data }) => {
        if (!data) return;
        setDailyReminder(data.reminder_enabled);
        setReminderTime(data.reminder_time.slice(0, 5)); // "09:00:00" -> "09:00"
      })
      .catch(() => {});
  }, [user?.user_id]);

  const handleReminderToggle = async (enabled: boolean) => {
    setDailyReminder(enabled); // optimistic
    if (!user?.user_id) return;
    const apiUrl = import.meta.env.VITE_API_URL || "";
    await fetch(`${apiUrl}/api/users/${user.user_id}/preferences`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ reminder_enabled: enabled, reminder_time: reminderTime }),
    }).catch(() => {});
  };

  const handleSaveReminderTime = async (time: string) => {
    if (!user?.user_id) return;
    const apiUrl = import.meta.env.VITE_API_URL || "";
    await fetch(`${apiUrl}/api/users/${user.user_id}/preferences`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ reminder_enabled: dailyReminder, reminder_time: time }),
    }).catch(() => {});
    setReminderTime(time);
  };

  return (
    <AppLayout>
      <div className="px-5 py-6 space-y-6">
        <h2 className="text-xl font-extrabold text-foreground">Settings</h2>

        {/* Notifications section */}
        <section className="space-y-1">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Notifications</h3>
          <div className="bg-card rounded-2xl card-elevated divide-y divide-border">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Bell className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Push Notifications</p>
                  <p className="text-xs text-muted-foreground">Get reminders to learn</p>
                </div>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-streak/10">
                  <Clock className="w-4 h-4 text-streak" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Daily Reminder</p>
                  <button
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setReminderDialogOpen(true)}
                  >
                    {formatDisplayTime(reminderTime)}
                    <Pencil className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <Switch checked={dailyReminder} onCheckedChange={handleReminderToggle} />
            </div>
          </div>
        </section>

        {/* Appearance section */}
        <section className="space-y-1">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Appearance</h3>
          <div className="bg-card rounded-2xl card-elevated divide-y divide-border">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary">
                  <Moon className="w-4 h-4 text-foreground" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Dark Mode</p>
                  <p className="text-xs text-muted-foreground">Easier on the eyes</p>
                </div>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Volume2 className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Sound Effects</p>
                    <p className="text-xs text-muted-foreground">Quiz & lesson sounds</p>
                  </div>
                </div>
                <Switch checked={soundEffects} onCheckedChange={setSoundEffects} />
              </div>
              {soundEffects && (
                <div className="flex items-center gap-3 pl-1 pr-1">
                  <VolumeX className="w-4 h-4 text-muted-foreground shrink-0" />
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[soundVolume]}
                    onValueChange={([val]) => setSoundVolume(val)}
                    className="flex-1"
                  />
                  <Volume2 className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-xs text-muted-foreground w-7 text-right">{soundVolume}%</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Learning section */}
        <section className="space-y-1">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Learning</h3>
          <div className="bg-card rounded-2xl card-elevated divide-y divide-border">
            <button className="w-full flex items-center justify-between p-4 text-left">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <RotateCcw className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Reset Progress</p>
                  <p className="text-xs text-muted-foreground">Start all lessons over</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </section>

        {/* Footer info */}
        <div className="text-center pt-4 space-y-1">
          <p className="text-xs text-muted-foreground">NutriLearn v1.0.0</p>
          <p className="text-xs text-muted-foreground">Made with 💚 for your health</p>
        </div>
      </div>

      <ReminderTimeDialog
        open={reminderDialogOpen}
        currentTime={reminderTime}
        onOpenChange={setReminderDialogOpen}
        onSave={handleSaveReminderTime}
      />
    </AppLayout>
  );
};

export default Settings;
