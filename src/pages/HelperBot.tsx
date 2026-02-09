import { useState, useRef, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import eagleMascot from "@/assets/eagle-mascot.png";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

const botResponses: Record<string, string> = {
  protein: "Great question! Protein helps build and repair muscles. Good sources include chicken, fish, eggs, beans, and tofu. Aim for a palm-sized portion with each meal. 💪",
  carbs: "Carbs are your body's main energy source! Choose complex carbs like whole grains, fruits, and veggies for sustained energy. They're not the enemy — they're fuel! 🍞",
  fat: "Healthy fats are essential! They support brain function and hormone balance. Reach for avocados, nuts, olive oil, and fatty fish. Just watch portion sizes. 🥑",
  water: "Hydration is key! Aim for 6-8 glasses a day. Your body needs water for digestion, circulation, and temperature regulation. Carry a water bottle with you! 💧",
  vitamin: "Vitamins are micronutrients your body needs in small amounts. Eating a variety of colorful fruits and veggies is the best way to cover your bases! 🌈",
  label: "When reading nutrition labels, check the serving size first! Then look at calories, protein, fiber, and added sugars. Ingredients are listed by amount — fewer is usually better. 🔍",
  default: "That's a great question! I'm here to help you learn about nutrition. Try asking me about proteins, carbs, fats, vitamins, water, or reading food labels! 🌿",
};

const suggestedQuestions = [
  "What does protein do?",
  "Are carbs bad for me?",
  "How much water should I drink?",
  "How do I read food labels?",
];

const HelperBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hey there! 🌿 I'm your NutriLearn helper. Ask me anything about nutrition and I'll do my best to help!", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getBotReply = (userMsg: string): string => {
    const lower = userMsg.toLowerCase();
    for (const [keyword, reply] of Object.entries(botResponses)) {
      if (keyword !== "default" && lower.includes(keyword)) return reply;
    }
    return botResponses.default;
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), text: text.trim(), sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulate bot reply
    setTimeout(() => {
      const botMsg: Message = { id: Date.now() + 1, text: getBotReply(text), sender: "bot" };
      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-57px)]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} gap-2`}>
              {msg.sender === "bot" && (
                <img src={eagleMascot} alt="Bot" className="w-8 h-8 rounded-full object-cover bg-secondary flex-shrink-0 mt-1" />
              )}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-card text-foreground card-elevated rounded-bl-md"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Suggested questions */}
        {messages.length <= 2 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-muted-foreground font-semibold mb-2">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-xs bg-card border border-border rounded-full px-3 py-1.5 text-foreground font-medium hover:bg-secondary transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-border bg-card/50 backdrop-blur-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about nutrition..."
              className="flex-1 bg-card border-border rounded-xl"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2.5 rounded-xl bg-primary text-primary-foreground disabled:opacity-40 transition-opacity"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};

export default HelperBot;
