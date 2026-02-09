import AppLayout from "@/components/AppLayout";
import eagleMascot from "@/assets/eagle-mascot.png";
import { Heart, BookOpen, Brain, Apple } from "lucide-react";

const About = () => {
  const values = [
    { icon: BookOpen, title: "Education, Not Diet Culture", description: "We focus on understanding nutrition, not restricting food. No calorie counting, no guilt." },
    { icon: Brain, title: "Science-Backed Knowledge", description: "Every lesson is grounded in real nutrition science, explained in plain language anyone can understand." },
    { icon: Apple, title: "Practical & Real-World", description: "Learn with real food examples you'll actually encounter in your daily life — not abstract theory." },
    { icon: Heart, title: "Built for Busy Lives", description: "Bite-sized lessons designed for people between classes, commutes, and everything else." },
  ];

  return (
    <AppLayout>
      <div className="px-5 py-6 space-y-6">
        {/* Hero */}
        <div className="text-center">
          <img src={eagleMascot} alt="NutriLearn mascot" className="w-20 h-20 rounded-full object-cover bg-secondary mx-auto mb-3" />
          <h2 className="text-xl font-extrabold text-foreground">About NutriLearn</h2>
          <p className="text-xs text-muted-foreground mt-1">Learn nutrition. Understand food. Feel empowered.</p>
        </div>

        {/* Mission */}
        <section className="bg-card rounded-2xl p-5 card-elevated">
          <h3 className="text-base font-bold text-foreground mb-2">Our Mission</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            NutriLearn provides busy young adults with a simple, engaging, and science-backed way to learn foundational nutrition knowledge. Through short, interactive lessons, real-world food examples, and light gamification, we empower users to understand how different nutrients affect the body, read food labels confidently, and make informed food choices.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mt-3">
            Rather than prescribing diets or tracking calories, we focus on education and understanding — helping you apply nutrition principles to your own preferences, goals, and daily routines.
          </p>
        </section>

        {/* Values */}
        <section>
          <h3 className="text-base font-bold text-foreground mb-3">What We Stand For</h3>
          <div className="space-y-3">
            {values.map((v) => (
              <div key={v.title} className="bg-card rounded-2xl p-4 card-elevated flex gap-3">
                <div className="p-2 rounded-lg bg-primary/10 h-fit">
                  <v.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{v.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{v.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Closing */}
        <div className="bg-primary/10 rounded-2xl p-5 text-center">
          <p className="text-2xl mb-2">🌿</p>
          <p className="text-sm font-bold text-foreground">Knowledge is power.</p>
          <p className="text-xs text-muted-foreground mt-1">
            You don't need to be perfect — just curious.
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default About;
