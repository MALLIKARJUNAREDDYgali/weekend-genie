import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Sparkles, Search, Wand2, Map, Plane } from "lucide-react";

const steps = [
  {
    number: "01",
    emoji: "🎯",
    icon: Search,
    title: "Enter Your Preferences",
    desc: "Tell us your budget, destination type, and travel style.",
    color: "from-blue-500 to-cyan-400",
  },
  {
    number: "02",
    emoji: "🤖",
    icon: Wand2,
    title: "AI Builds Your Itinerary",
    desc: "Our AI crafts a detailed plan with stays, food & activities.",
    color: "from-orange-500 to-amber-400",
  },
  {
    number: "03",
    emoji: "💎",
    icon: Map,
    title: "Discover Hidden Gems",
    desc: "Uncover local secrets and authentic experiences.",
    color: "from-purple-500 to-pink-400",
  },
  {
    number: "04",
    emoji: "✈️",
    icon: Plane,
    title: "Enjoy Your Trip",
    desc: "Follow the plan and create unforgettable memories!",
    color: "from-emerald-500 to-teal-400",
  },
];

export function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 px-4 relative overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.02] to-background" />

      <div className="container mx-auto relative">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4 tracking-wide uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            How It Works
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Plan Your Trip in{" "}
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              4 Simple Steps
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From idea to itinerary in under a minute — powered by AI
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-[2px] -translate-y-1/2 z-0">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-400 via-orange-400 via-purple-400 to-emerald-400 rounded-full"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
              style={{ transformOrigin: "left" }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                className="text-center group"
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.2 }}
              >
                {/* Step circle */}
                <motion.div
                  className="relative mx-auto mb-5"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                    <step.icon className="h-9 w-9 text-white" />
                  </div>
                  {/* Step number badge */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-background border-2 border-border flex items-center justify-center text-xs font-bold shadow-sm">
                    {step.number}
                  </div>
                </motion.div>

                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
