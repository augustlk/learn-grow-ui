import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import eagleMascot from "@/assets/eagle-mascot.png";
import { useUser } from "@/hooks/useUserContext";

const Auth = () => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const apiUrl = import.meta.env.VITE_API_URL || "";
    const endpoint =
      mode === "signin" ? `${apiUrl}/api/auth/login` : `${apiUrl}/api/auth/register`;

    const body =
      mode === "signin"
        ? { email, password }
        : { email, password, first_name: firstName, last_name: lastName };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.token) {
        await login(data.token, data.userId);
        const redirect = localStorage.getItem("redirectAfterLogin") || "/";
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirect);
      } else if (data.success) {
        alert("Account created! Please sign in.");
        setMode("signin");
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch {
      alert("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4">
        <button onClick={() => navigate("/")} className="p-2 rounded-lg hover:bg-secondary transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-10">
        {/* Mascot + Branding */}
        <img src={eagleMascot} alt="NutriLearn mascot" className="w-24 h-24 rounded-full object-cover bg-secondary mb-4" />
        <h1 className="text-2xl font-extrabold text-foreground">NutriLearn</h1>
        <p className="text-sm text-muted-foreground mt-1 text-center">
          Learn nutrition at your own pace 🌿
        </p>

        {/* Toggle */}
        <div className="flex bg-secondary rounded-xl p-1 mt-6 w-full max-w-xs">
          <button
            onClick={() => setMode("signin")}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
              mode === "signin" ? "bg-card text-foreground card-elevated" : "text-muted-foreground"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
              mode === "signup" ? "bg-card text-foreground card-elevated" : "text-muted-foreground"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-xs mt-6 space-y-4">
          {mode === "signup" && (
            <div className="flex gap-3">
              <div className="space-y-1.5 flex-1">
                <Label htmlFor="firstName" className="text-xs font-bold text-foreground">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="First"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="bg-card border-border"
                />
              </div>
              <div className="space-y-1.5 flex-1">
                <Label htmlFor="lastName" className="text-xs font-bold text-foreground">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Last"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="bg-card border-border"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-bold text-foreground">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-card border-border"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-bold text-foreground">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-card border-border pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === "signin" && (
            <button type="button" className="text-xs text-primary font-semibold hover:underline">
              Forgot password?
            </button>
          )}

          <Button type="submit" disabled={submitting} className="w-full font-bold text-sm h-12 rounded-xl">
            {submitting ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground mt-6 text-center">
          {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="text-primary font-bold hover:underline"
          >
            {mode === "signin" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
