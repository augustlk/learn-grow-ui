import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/hooks/useUserContext";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Lesson from "./pages/Lesson";
import Quiz from "./pages/Quiz";
import Auth from "./pages/Auth";
import Streaks from "./pages/Streaks";
import Settings from "./pages/Settings";
import About from "./pages/About";
import HelperBot from "./pages/HelperBot";
import NotFound from "./pages/NotFound";
import Unit from "./pages/Unit";
import InProgressLessons from "./pages/InProgressLessons";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/unit/:unitId" element={<Unit />} />
            <Route path="/lessons/in-progress" element={<InProgressLessons />} />
            <Route path="/lesson" element={<Lesson />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/streaks" element={<Streaks />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/about" element={<About />} />
            <Route path="/bot" element={<HelperBot />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
