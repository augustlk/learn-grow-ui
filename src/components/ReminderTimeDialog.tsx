import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// "09:00" -> "9:00 AM"
export function formatDisplayTime(time24: string): string {
  const [hourStr, minuteStr] = time24.split(":");
  const hour = parseInt(hourStr, 10);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minuteStr} ${period}`;
}

function parseTime(time24: string): { hour: string; minute: string; period: "AM" | "PM" } {
  const [hourStr, minuteStr] = time24.split(":");
  const hour = parseInt(hourStr, 10);
  const period: "AM" | "PM" = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return { hour: String(displayHour), minute: minuteStr ?? "00", period };
}

function buildTime24(hour: string, minute: string, period: "AM" | "PM"): string {
  let h = parseInt(hour, 10);
  if (period === "AM" && h === 12) h = 0;
  if (period === "PM" && h !== 12) h += 12;
  return `${String(h).padStart(2, "0")}:${minute}`;
}

interface ReminderTimeDialogProps {
  open: boolean;
  currentTime: string; // "HH:MM" 24-hour
  onOpenChange: (open: boolean) => void;
  onSave: (time: string) => Promise<void>;
}

const HOURS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
const MINUTES = ["00", "15", "30", "45"];

export function ReminderTimeDialog({
  open,
  currentTime,
  onOpenChange,
  onSave,
}: ReminderTimeDialogProps) {
  const parsed = parseTime(currentTime);
  const [hour, setHour] = useState(parsed.hour);
  const [minute, setMinute] = useState(parsed.minute);
  const [period, setPeriod] = useState<"AM" | "PM">(parsed.period);
  const [saving, setSaving] = useState(false);

  // Reset draft when dialog opens with a new time
  useEffect(() => {
    if (open) {
      const p = parseTime(currentTime);
      setHour(p.hour);
      setMinute(p.minute);
      setPeriod(p.period);
    }
  }, [open, currentTime]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(buildTime24(hour, minute, period));
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Set Daily Reminder</DialogTitle>
          <DialogDescription>
            Choose the time you'd like your daily reminder.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center gap-3 py-4">
          <Clock className="w-5 h-5 text-streak shrink-0" />

          {/* Hour */}
          <Select value={hour} onValueChange={setHour}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {HOURS.map((h) => (
                <SelectItem key={h} value={h}>
                  {h}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="text-lg font-bold text-foreground">:</span>

          {/* Minute */}
          <Select value={minute} onValueChange={setMinute}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MINUTES.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* AM/PM */}
          <Select value={period} onValueChange={(v) => setPeriod(v as "AM" | "PM")}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AM">AM</SelectItem>
              <SelectItem value="PM">PM</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
