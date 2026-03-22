import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { useUser } from "@/hooks/useUserContext";
import { useCompleteLesson } from "@/hooks/useCompleteLesson";
import { Check, X } from "lucide-react";

// 80% of 5 questions = 4 correct needed to pass
const PASSING_PERCENT = 80;

// Shape returned by GET /api/lessons/:id/quiz
interface ApiAnswer {
  answer_id: number;
  answer_text: string;
  is_correct: boolean;
}

interface ApiQuestion {
  question_id: number;
  quiz_id: number;
  question_order: number;
  question_text: string;
  answers: ApiAnswer[];
}

// Normalised shape used internally
interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  quiz_id: number;
}

function normaliseQuestions(apiQuestions: ApiQuestion[]): QuizQuestion[] {
  return apiQuestions.map((q) => ({
    question: q.question_text,
    options: q.answers.map((a) => a.answer_text),
    correctIndex: q.answers.findIndex((a) => a.is_correct),
    quiz_id: q.quiz_id,
  }));
}

const Quiz = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { markLessonComplete } = useCompleteLesson();
  const [searchParams] = useSearchParams();
  const lessonId = parseInt(searchParams.get("lessonId") || "1");

  const [activeQuiz, setActiveQuiz] = useState<QuizQuestion[]>([]);
  const [loadingQuiz, setLoadingQuiz] = useState(true);
  const [quizId, setQuizId] = useState<number | null>(null);

  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setCurrentQ(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setFinished(false);
    setActiveQuiz([]);
    setLoadingQuiz(true);

    const apiUrl = import.meta.env.VITE_API_URL || "";
    fetch(`${apiUrl}/api/lessons/${lessonId}/quiz`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data.length > 0) {
          const normalised = normaliseQuestions(data.data);
          setActiveQuiz(normalised);
          setQuizId(data.data[0].quiz_id ?? null);
        }
      })
      .catch(console.error)
      .finally(() => setLoadingQuiz(false));
  }, [lessonId]);

  if (loadingQuiz) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-sm text-muted-foreground">Loading quiz…</p>
        </div>
      </AppLayout>
    );
  }

  if (activeQuiz.length === 0) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4 px-5">
          <p className="text-sm text-muted-foreground text-center">
            No quiz found for this lesson.
          </p>
          <button
            onClick={() => navigate("/")}
            className="py-3 px-6 rounded-xl bg-primary text-primary-foreground font-bold text-sm"
          >
            Back to Home
          </button>
        </div>
      </AppLayout>
    );
  }

  const question = activeQuiz[currentQ];
  const isCorrect = selectedAnswer === question.correctIndex;

  const handleSelect = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
    setShowFeedback(true);
    if (index === question.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQ < activeQuiz.length - 1) {
      setCurrentQ((q) => q + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setFinished(true);
    }
  };

  const handleQuizComplete = async () => {
    if (!user) return;
    const pct = Math.round((score / activeQuiz.length) * 100);
    const passed = pct >= PASSING_PERCENT;

    // Save quiz result to DB
    if (quizId) {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "";
        await fetch(
          `${apiUrl}/api/users/${user.user_id}/quiz/${quizId}/result`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ score, passed }),
          }
        );
      } catch (err) {
        console.error("Failed to save quiz result:", err);
      }
    }

    // Mark lesson complete if passed
    if (passed) {
      await markLessonComplete(user.user_id, lessonId);
    }
  };

  if (finished) {
    const pct = Math.round((score / activeQuiz.length) * 100);
    const passed = pct >= PASSING_PERCENT;

    return (
      <AppLayout>
        <div className="px-5 py-10 flex flex-col items-center gap-6 text-center animate-bounce-in">
          <span className="text-6xl">
            {pct >= 80 ? "🏆" : pct >= 60 ? "👏" : "💪"}
          </span>
          <h2 className="text-2xl font-extrabold text-foreground">
            Quiz Complete!
          </h2>

          <div className="bg-card rounded-2xl p-6 card-elevated w-full">
            <p className="text-4xl font-extrabold text-primary">{pct}%</p>
            <p className="text-sm text-muted-foreground mt-1">
              {score} out of {activeQuiz.length} correct
            </p>
            {passed ? (
              <p className="text-xs text-success font-semibold mt-2">
                ✓ Passed! Next lesson unlocked.
              </p>
            ) : (
              <p className="text-xs text-destructive font-semibold mt-2">
                Need {PASSING_PERCENT}% to pass. Try again!
              </p>
            )}
          </div>

          <p className="text-sm text-muted-foreground max-w-xs">
            {pct >= 80
              ? "Amazing work! You really know your stuff!"
              : pct >= 60
              ? "Good effort! Review the lesson and try again to unlock the next one. 💚"
              : "Keep at it — every attempt makes you stronger! 💚"}
          </p>

          <div className="flex gap-3 w-full">
            <button
              onClick={async () => {
                await handleQuizComplete();
                setTimeout(() => navigate("/"), 300);
              }}
              className="flex-1 py-3 rounded-xl bg-card border border-border text-foreground font-semibold text-sm"
            >
              Home
            </button>
            <button
              onClick={() => {
                setCurrentQ(0);
                setSelectedAnswer(null);
                setShowFeedback(false);
                setScore(0);
                setFinished(false);
              }}
              className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="px-5 py-4 space-y-5">
        {/* Progress dots */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-1.5 text-center">
            Quiz Progress
          </p>
          <div className="flex gap-1">
            {activeQuiz.map((_, i) => (
              <div
                key={i}
                className={`h-2.5 flex-1 rounded-full transition-colors ${
                  i < currentQ
                    ? "bg-success"
                    : i === currentQ
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-1">
            Need {PASSING_PERCENT}% to unlock next lesson
          </p>
        </div>

        {/* Question card */}
        <div
          className="bg-card rounded-2xl p-6 card-elevated text-center animate-slide-up"
          key={currentQ}
        >
          <p className="text-base font-bold text-card-foreground">
            {question.question}
          </p>
        </div>

        {/* Answer options */}
        <div className="space-y-2.5">
          {question.options.map((opt, i) => {
            let optionStyle =
              "bg-card border-border text-card-foreground hover:border-primary/50";
            if (showFeedback) {
              if (i === question.correctIndex) {
                optionStyle = "bg-success/10 border-success text-foreground";
              } else if (i === selectedAnswer && !isCorrect) {
                optionStyle =
                  "bg-destructive/10 border-destructive text-foreground";
              } else {
                optionStyle =
                  "bg-card border-border text-muted-foreground opacity-50";
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={showFeedback}
                className={`w-full py-3.5 px-4 rounded-xl border-2 font-semibold text-sm transition-all flex items-center justify-between ${optionStyle}`}
              >
                <span>{opt}</span>
                {showFeedback && i === question.correctIndex && (
                  <Check className="w-5 h-5 text-success" />
                )}
                {showFeedback &&
                  i === selectedAnswer &&
                  !isCorrect &&
                  i !== question.correctIndex && (
                    <X className="w-5 h-5 text-destructive" />
                  )}
              </button>
            );
          })}
        </div>

        {/* Feedback panel */}
        {showFeedback && (
          <div
            className={`rounded-xl p-4 animate-slide-up ${
              isCorrect
                ? "bg-success/10 border border-success/30"
                : "bg-accent/10 border border-accent/30"
            }`}
          >
            <p className="text-sm font-bold mb-1">
              {isCorrect ? "✅ Correct!" : "❌ Not quite!"}
            </p>
          </div>
        )}

        {/* Next button */}
        {showFeedback && (
          <button
            onClick={handleNext}
            className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm animate-slide-up hover:opacity-90 transition-opacity"
          >
            {currentQ < activeQuiz.length - 1 ? "Next Question" : "See Results"}
          </button>
        )}
      </div>
    </AppLayout>
  );
};

export default Quiz;

