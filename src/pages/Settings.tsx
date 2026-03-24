import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Bell, Moon, Clock, RotateCcw, ChevronRight, Volume2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });
  const [soundEffects, setSoundEffects] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

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
                  <p className="text-xs text-muted-foreground">9:00 AM every day</p>
                </div>
              </div>
              <Switch checked={dailyReminder} onCheckedChange={setDailyReminder} />
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
            <div className="flex items-center justify-between p-4">
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
    </AppLayout>
  );
};

export default Settings;
