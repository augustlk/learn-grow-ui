import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import eagleMascot from "@/assets/eagle-mascot.png";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { lessonContentMap } from "@/data/lessons";
import { useUser } from "@/hooks/useUserContext";

interface ApiCard {
  card_id: number;
  card_order: number;
  card_text: string;
  lesson_title: string;
  unit_title: string;
}

const ProgressBar = ({
  current,
  total,
}: {
  current: number;
  total: number;
}) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <span className="text-xs font-semibold text-muted-foreground">
        {current} / {total}
      </span>
      <span className="text-xs font-semibold text-primary">5 min lesson</span>
    </div>
    <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
      <div
        className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
        style={{ width: `${(current / total) * 100}%` }}
      />
    </div>
  </div>
);

const NavButtons = ({
  onBack,
  onNext,
  onQuiz,
  backLabel,
  isLast,
}: {
  onBack: () => void;
  onNext?: () => void;
  onQuiz: () => void;
  backLabel: string;
  isLast: boolean;
}) => (
  <div className="flex gap-3">
    <button
      onClick={onBack}
      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-card border border-border text-foreground font-semibold text-sm hover:bg-secondary transition-colors"
    >
      <ChevronLeft className="w-4 h-4" />
      {backLabel}
    </button>

    {!isLast ? (
      <button
        onClick={onNext}
        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
      >
        Continue
        <ChevronRight className="w-4 h-4" />
      </button>
    ) : (
      <button
        onClick={onQuiz}
        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-accent text-accent-foreground font-bold text-sm hover:opacity-90 transition-opacity"
      >
        Quiz Me 🎯
      </button>
    )}
  </div>
);

const Lesson = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useUser();

  const lessonIdParam = searchParams.get("lessonId");
  const lessonId = Number(lessonIdParam);

  const [currentSection, setCurrentSection] = useState(0);
  const [cards, setCards] = useState<ApiCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const hasLoadedResumePosition = useRef(false);

  useEffect(() => {
    setCurrentSection(0);
    setCards([]);
    setError(false);
    setLoading(true);

    if (!Number.isInteger(lessonId) || lessonId <= 0) {
      setError(true);
      setLoading(false);
      return;
    }

    const apiUrl = import.meta.env.VITE_API_URL || "";

    fetch(`${apiUrl}/api/lessons/${lessonId}/cards`)
      .then((r) => {
        if (!r.ok) {
          throw new Error(`HTTP ${r.status}`);
        }
        return r.json();
      })
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setCards(data.data);
        } else {
          setError(true);
        }
      })
      .catch((err) => {
        console.error("Failed to load lesson cards:", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [lessonId]);

  useEffect(() => {
    if (!user?.user_id || !Number.isInteger(lessonId) || lessonId <= 0 || cards.length === 0) {
      return;
    }

    const apiUrl = import.meta.env.VITE_API_URL || "";
    const loadResumePosition = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/users/${user.user_id}/lessons/${lessonId}`);
        if (!response.ok) return;

        const payload = await response.json();
        const savedCard = payload?.data?.last_card_viewed;
        if (typeof savedCard === "number") {
          const safeCard = Math.min(Math.max(savedCard, 0), cards.length - 1);
          setCurrentSection(safeCard);
        }
      } catch (err) {
        console.error("Failed to load resume position:", err);
      } finally {
        hasLoadedResumePosition.current = true;
      }
    };

    loadResumePosition();
  }, [user?.user_id, lessonId, cards.length]);

  useEffect(() => {
    if (!user?.user_id || !Number.isInteger(lessonId) || lessonId <= 0) {
      return;
    }

    if (!hasLoadedResumePosition.current || loading || error || cards.length === 0) {
      return;
    }

    const apiUrl = import.meta.env.VITE_API_URL || "";
    const controller = new AbortController();

    fetch(`${apiUrl}/api/users/${user.user_id}/lessons/${lessonId}/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ last_card_viewed: currentSection }),
      signal: controller.signal,
    }).catch((err) => {
      if (err.name !== "AbortError") {
        console.error("Failed to save lesson progress:", err);
      }
    });

    return () => controller.abort();
  }, [user?.user_id, lessonId, currentSection, loading, error, cards.length]);

  const goToQuiz = () => {
    if (!Number.isInteger(lessonId) || lessonId <= 0) return;
    navigate(`/quiz?lessonId=${lessonId}`);
  };

  const goHome = () => navigate("/");

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-sm text-muted-foreground">Loading lesson…</p>
        </div>
      </AppLayout>
    );
  }

  if (error || cards.length === 0) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4 px-5">
          <p className="text-sm text-muted-foreground text-center">
            Could not load this lesson. Please try again.
          </p>
          <button
            onClick={goHome}
            className="py-3 px-6 rounded-xl bg-primary text-primary-foreground font-bold text-sm"
          >
            Back to Home
          </button>
        </div>
      </AppLayout>
    );
  }

  const totalCards = cards.length;
  const currentCard = cards[currentSection];
  const lessonTitle = cards[0]?.lesson_title ?? `Lesson ${lessonId}`;
  const isLastCard = currentSection === totalCards - 1;

  return (
    <AppLayout>
      <div className="px-5 py-4 space-y-4">
        <ProgressBar current={currentSection + 1} total={totalCards} />

        <div className="text-center">
          <p className="text-xs text-muted-foreground font-medium">
            Lesson {lessonId}
          </p>
          <h2 className="text-xl font-extrabold text-foreground">
            {lessonTitle}
          </h2>
        </div>

        <div
          className="bg-card rounded-2xl p-5 card-elevated min-h-[300px] flex flex-col"
          key={currentSection}
        >
          <div className="animate-slide-up flex-1">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={eagleMascot}
                alt="Eagle mascot"
                className="w-12 h-12 rounded-full bg-secondary"
              />
              <h3 className="text-base font-bold text-foreground">
                {isLastCard
                  ? "Key Point"
                  : `Card ${currentSection + 1} of ${totalCards}`}
              </h3>
            </div>
            <p className="text-sm text-card-foreground leading-relaxed">
              {currentCard.card_text}
            </p>
          </div>
        </div>

        <NavButtons
          onBack={() =>
            currentSection > 0
              ? setCurrentSection(currentSection - 1)
              : goHome()
          }
          onNext={() => setCurrentSection(currentSection + 1)}
          onQuiz={goToQuiz}
          backLabel={currentSection > 0 ? "Back" : "Exit"}
          isLast={isLastCard}
        />
      </div>
    </AppLayout>
  );
};

export default Lesson;