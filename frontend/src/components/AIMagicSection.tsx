import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Brain, DollarSign, MapPin, Cloud, Sparkles, Zap, Shield, Star } from "lucide-react";

const features = [
  {
    icon: DollarSign,
    title: "Budget Optimization",
    desc: "AI maximizes your experience within budget — finding the best value stays, food, and activities.",
    gradient: "from-emerald-400 to-teal-500",
    stat: "Save up to 40%",
  },
  {
    icon: Brain,
    title: "Smart Recommendations",
    desc: "Machine learning analyzes thousands of reviews and data points to suggest perfect matches.",
    gradient: "from-blue-400 to-indigo-500",
    stat: "10K+ data points",
  },
  {
    icon: MapPin,
    title: "Local Hidden Spots",
    desc: "Discover off-the-beaten-path gems and authentic local experiences tourists usually miss.",
    gradient: "from-orange-400 to-amber-500",
    stat: "500+ local secrets",
  },
  {
    icon: Cloud,
    title: "Weather-Aware Planning",
    desc: "Activities are optimized for current weather conditions so you always have a Plan B.",
    gradient: "from-purple-400 to-pink-500",
    stat: "Real-time data",
  },
];

export function AIMagicSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 px-4 relative overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-purple-500/[0.03]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_hsl(260_70%_50%_/_0.05)_0%,_transparent_50%)]" />

      <div className="container mx-auto relative">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-semibold mb-4 tracking-wide uppercase">
            <Zap className="h-3.5 w-3.5" />
            AI-Powered
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            The Magic Behind{" "}
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Weekend Genie</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Advanced AI that understands travel better than any human planner
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
            >
              <motion.div
                className="group relative p-6 rounded-3xl bg-card border border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-xl h-full"
                whileHover={{ y: -4 }}
              >
                {/* Subtle gradient glow */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500`} />

                <div className="flex items-start gap-5 relative">
                  {/* Icon */}
                  <motion.div
                    className={`shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-md`}
                    whileHover={{ rotate: 5, scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <feature.icon className="h-7 w-7 text-white" />
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold">{feature.title}</h3>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-gradient-to-r ${feature.gradient} text-white whitespace-nowrap`}>
                        {feature.stat}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
