import { Check, Lock, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Lesson } from "@/data/lessons";

interface LessonNodeProps {
  lesson: Lesson;
  index: number;
}

const LessonNode = ({ lesson, index }: LessonNodeProps) => {
  const navigate = useNavigate();

  const positions = [0, 1, 2, 1, 0, -1, -2, -1];
  const offset = positions[index % positions.length];

  const handleClick = () => {
    if (lesson.status === "completed") {
      navigate("/lesson");
    } else if (lesson.status === "active") {
      navigate("/lesson");
    }
  };

  const nodeSize = lesson.status === "locked" ? "w-12 h-12" : "w-16 h-16";

  return (
    <div
      className="flex flex-col items-center gap-2 animate-slide-up"
      style={{
        marginLeft: `${offset * 40}px`,
        animationDelay: `${index * 80}ms`,
        animationFillMode: "backwards",
      }}
    >
      <button
        onClick={handleClick}
        disabled={lesson.status === "locked"}
        className={`${nodeSize} rounded-full flex items-center justify-center transition-all duration-200 ${
          lesson.status === "completed"
            ? "bg-primary text-primary-foreground lesson-node-shadow-active hover:scale-105"
            : lesson.status === "active"
            ? "bg-card text-primary border-[3px] border-primary lesson-node-shadow-active hover:scale-105 animate-pulse-soft"
            : "bg-muted text-locked lesson-node-shadow cursor-not-allowed opacity-70"
        }`}
      >
        {lesson.status === "completed" ? (
          <Check className="w-6 h-6" strokeWidth={3} />
        ) : lesson.status === "active" ? (
          <BookOpen className="w-6 h-6" />
        ) : (
          <Lock className="w-5 h-5" />
        )}
      </button>

      <div className="text-center max-w-[140px]">
        <p
          className={`text-xs font-bold ${
            lesson.status === "locked" ? "text-locked" : "text-foreground"
          }`}
        >
          {lesson.title}
        </p>
        <p className="text-[10px] text-muted-foreground">{lesson.duration}</p>
        {lesson.status === "active" && lesson.modulesTotal && (
          <div className="mt-1 flex items-center gap-1 justify-center">
            <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${(lesson.modulesCompleted! / lesson.modulesTotal) * 100}%` }}
              />
            </div>
            <span className="text-[9px] text-muted-foreground">
              {lesson.modulesCompleted}/{lesson.modulesTotal}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonNode;
