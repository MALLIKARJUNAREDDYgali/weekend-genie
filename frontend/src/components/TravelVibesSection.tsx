import { motion } from "framer-motion";
import { Waves, Mountain, Building2, Landmark, UtensilsCrossed, Sparkles, TreePine } from "lucide-react";

const vibes = [
  {
    emoji: "🌊", icon: Waves, title: "Beach Escape",
    desc: "Sun, sand, and serenity",
    gradient: "from-cyan-400 to-blue-500",
    bgHover: "group-hover:bg-cyan-50 dark:group-hover:bg-cyan-950/20",
  },
  {
    emoji: "🏔️", icon: Mountain, title: "Mountain Adventure",
    desc: "Peaks, trails, and fresh air",
    gradient: "from-emerald-400 to-teal-600",
    bgHover: "group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/20",
  },
  {
    emoji: "🏙️", icon: Building2, title: "City Explorer",
    desc: "Culture, nightlife, and food",
    gradient: "from-violet-400 to-purple-600",
    bgHover: "group-hover:bg-violet-50 dark:group-hover:bg-violet-950/20",
  },
  {
    emoji: "🏛️", icon: Landmark, title: "Cultural Journey",
    desc: "Heritage, art, and history",
    gradient: "from-amber-400 to-orange-500",
    bgHover: "group-hover:bg-amber-50 dark:group-hover:bg-amber-950/20",
  },
  {
    emoji: "🍜", icon: UtensilsCrossed, title: "Food Trail",
    desc: "Flavors, street food, and local cuisine",
    gradient: "from-rose-400 to-pink-600",
    bgHover: "group-hover:bg-rose-50 dark:group-hover:bg-rose-950/20",
  },
  {
    emoji: "🌲", icon: TreePine, title: "Nature Retreat",
    desc: "Forests, lakes, and wildlife",
    gradient: "from-green-400 to-emerald-600",
    bgHover: "group-hover:bg-green-50 dark:group-hover:bg-green-950/20",
  },
];

export function TravelVibesSection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(210_85%_45%_/_0.04)_0%,_transparent_60%)]" />

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
            Choose Your Vibe
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            What's Your Travel{" "}
            <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">Style?</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Pick your mood and our AI will tailor the perfect trip for you
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 gap-5 max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
        >
          {vibes.map((vibe, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
              }}
            >
              <motion.div
                className={`group relative p-6 rounded-3xl border border-border/50 bg-card cursor-pointer transition-all duration-300 hover:border-primary/20 hover:shadow-lg ${vibe.bgHover} text-center h-full`}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                whileTap={{ scale: 0.97 }}
              >
                {/* Gradient glow on hover */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${vibe.gradient} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-500`} />

                <motion.div
                  className={`relative w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${vibe.gradient} flex items-center justify-center shadow-md`}
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <vibe.icon className="h-8 w-8 text-white" />
                </motion.div>

                <h3 className="text-lg font-bold mb-1 relative">{vibe.title}</h3>
                <p className="text-sm text-muted-foreground relative">{vibe.desc}</p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
