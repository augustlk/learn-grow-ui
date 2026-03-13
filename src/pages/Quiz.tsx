import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { useUser } from "@/hooks/useUserContext";
import { useCompleteLesson } from "@/hooks/useCompleteLesson";
import { quizMap } from "@/data/lessons";
import { Check, X } from "lucide-react";

const Quiz = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { markLessonComplete } = useCompleteLesson();
  const [searchParams] = useSearchParams();
  const lessonId = parseInt(searchParams.get("lessonId") || "1");

  // Reads from lessons.ts — no hardcoding needed!
  const activeQuiz = quizMap[lessonId] ?? quizMap[1];
  
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

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

    const totalQuestions = activeQuiz.length;
    const pct = Math.round((score / totalQuestions) * 100);
    const passed = pct >= 60;

    // Mark lesson as complete if passed
    if (passed) {
      await markLessonComplete(user.user_id, lessonId);
    }
  };

  if (finished) {
    const pct = Math.round((score / activeQuiz.length) * 100);
    const passed = pct >= 60;
    
    return (
      <AppLayout>
        <div className="px-5 py-10 flex flex-col items-center gap-6 text-center animate-bounce-in">
          <span className="text-6xl">{pct >= 80 ? "🏆" : pct >= 60 ? "👏" : "💪"}</span>
          <h2 className="text-2xl font-extrabold text-foreground">Quiz Complete!</h2>
          <div className="bg-card rounded-2xl p-6 card-elevated w-full">
            <p className="text-4xl font-extrabold text-primary">{pct}%</p>
            <p className="text-sm text-muted-foreground mt-1">
              {score} out of {activeQuiz.length} correct
            </p>
            {passed && (
              <p className="text-xs text-success font-semibold mt-2">✓ PASSED - Lesson Completed!</p>
            )}
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">
            {pct >= 80
              ? "Amazing work! You really know your stuff!"
              : "Great effort! Every wrong answer is a chance to learn. Keep going! 💚"}
          </p>
          <div className="flex gap-3 w-full">
            <button
              onClick={async () => {
                await handleQuizComplete();
                setTimeout(() => navigate("/"), 500);
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
        {/* Progress */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-1.5 text-center">Quiz Progress</p>
          <div className="flex gap-1">
            {activeQuiz.map((_, i) => (
              <div
                key={i}
                className={`h-2.5 flex-1 rounded-full transition-colors ${
                  i < currentQ ? "bg-success" : i === currentQ ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Question card */}
        <div className="bg-card rounded-2xl p-6 card-elevated text-center animate-slide-up" key={currentQ}>
          <span className="text-5xl block mb-4">{question.image}</span>
          <p className="text-base font-bold text-card-foreground">{question.question}</p>
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {question.options.map((opt, i) => {
            let optionStyle = "bg-card border-border text-card-foreground hover:border-primary/50";
            if (showFeedback) {
              if (i === question.correctIndex) {
                optionStyle = "bg-success/10 border-success text-foreground";
              } else if (i === selectedAnswer && !isCorrect) {
                optionStyle = "bg-destructive/10 border-destructive text-foreground";
              } else {
                optionStyle = "bg-card border-border text-muted-foreground opacity-50";
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
                {showFeedback && i === selectedAnswer && !isCorrect && i !== question.correctIndex && (
                  <X className="w-5 h-5 text-destructive" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div
            className={`rounded-xl p-4 animate-slide-up ${
              isCorrect ? "bg-success/10 border border-success/30" : "bg-accent/10 border border-accent/30"
            }`}
          >
            <p className="text-sm font-bold mb-1">
              {isCorrect ? "✅ Correct!" : "❌ Not quite!"}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">{question.explanation}</p>
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

