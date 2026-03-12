import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import WeekendPlannerForm from "@/components/WeekendPlannerForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ProfileMenu } from "@/components/ProfileMenu";
import { RecommendationsSection } from "@/components/RecommendationsSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { ComparisonSlider } from "@/components/ComparisonSlider";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { TravelVibesSection } from "@/components/TravelVibesSection";
import { AIMagicSection } from "@/components/AIMagicSection";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";
import { useAuth } from "@/contexts/AuthContext";
import weekendGenieLogo from "@/assets/weekend-genie-logo.png";
import { Sparkles, Map, Calendar, Heart, LogIn, Compass, Plane, MapPin, Star, Clock, Users, ChevronDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// ── Floating Particle ───────────────────────────────────
const FloatingParticle = ({ delay, x, y, size, duration, emoji }: {
  delay: number; x: number; y: number; size: number; duration: number; emoji: string;
}) => (
  <motion.div
    className="absolute pointer-events-none select-none"
    style={{ left: `${x}%`, top: `${y}%`, fontSize: `${size}px` }}
    animate={{
      y: [0, -30, 0, 20, 0],
      x: [0, 15, -10, 5, 0],
      rotate: [0, 10, -10, 5, 0],
      opacity: [0.3, 0.7, 0.5, 0.7, 0.3],
    }}
    transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
  >
    {emoji}
  </motion.div>
);

// ── Typewriter Text ─────────────────────────────────────
const TypewriterText = ({ texts }: { texts: string[] }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const text = texts[currentTextIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentCharIndex < text.length) {
          setCurrentCharIndex(prev => prev + 1);
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (currentCharIndex > 0) {
          setCurrentCharIndex(prev => prev - 1);
        } else {
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? 30 : 60);
    return () => clearTimeout(timeout);
  }, [currentCharIndex, isDeleting, currentTextIndex, texts]);

  return (
    <span>
      {texts[currentTextIndex].substring(0, currentCharIndex)}
      <motion.span
        className="inline-block w-[3px] h-[1em] bg-white/80 ml-0.5 align-middle"
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity }}
      />
    </span>
  );
};

// ── Animated Counter ────────────────────────────────────
const AnimatedCounter = ({ target, suffix = "", duration = 2 }: {
  target: number; suffix?: string; duration?: number;
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = target / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

// ── Main Index Component ────────────────────────────────
const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);

  // Parallax transforms
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToForm = () => {
    document.getElementById("plan-section")?.scrollIntoView({ behavior: "smooth" });
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } }
  };
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };
  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">

      {/* ═══════════ SCROLL PROGRESS BAR ═══════════ */}
      <ScrollProgressBar />

      {/* ═══════════ STICKY NAVBAR ═══════════ */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/90 backdrop-blur-xl border-b border-border/50 shadow-sm py-2"
            : "bg-transparent py-4"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2.5"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="relative">
              <img src={weekendGenieLogo} alt="Weekend Genie" className="h-8 w-8 rounded-lg object-cover" />
              <motion.div
                className="absolute inset-0 rounded-lg"
                animate={{ boxShadow: ["0 0 0px hsl(210 85% 45% / 0)", "0 0 15px hsl(210 85% 45% / 0.3)", "0 0 0px hsl(210 85% 45% / 0)"] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
            </div>
            <span className={`font-bold text-xl tracking-tight transition-colors duration-300 ${
              scrolled ? "bg-gradient-hero bg-clip-text text-transparent" : "text-white"
            }`}>
              Weekend Genie
            </span>
          </motion.div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {loading ? null : user ? (
              <ProfileMenu />
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => navigate('/auth')}
                  variant="default"
                  size="sm"
                  className="bg-gradient-hero hover:shadow-magical rounded-full px-5"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.nav>

      {/* ═══════════ HERO SECTION ═══════════ */}
      <motion.header
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ y: heroY }}
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(210_85%_35%)_0%,_hsl(220_80%_20%)_40%,_hsl(260_70%_15%)_100%)]" />
          {/* Animated mesh gradient overlays */}
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{
              background: [
                "radial-gradient(circle at 20% 50%, hsl(200 80% 50% / 0.4) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 30%, hsl(280 70% 50% / 0.4) 0%, transparent 50%)",
                "radial-gradient(circle at 40% 70%, hsl(25 90% 55% / 0.4) 0%, transparent 50%)",
                "radial-gradient(circle at 20% 50%, hsl(200 80% 50% / 0.4) 0%, transparent 50%)",
              ]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:60px_60px]" />
          {/* Stars / dots */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,_rgba(255,255,255,0.8)_1px,_transparent_1px)] bg-[size:80px_80px]" />
        </div>

        {/* Floating travel elements */}
        <FloatingParticle emoji="✈️" x={8} y={20} size={32} duration={8} delay={0} />
        <FloatingParticle emoji="🧭" x={85} y={15} size={28} duration={9} delay={1} />
        <FloatingParticle emoji="🗺️" x={12} y={70} size={26} duration={7} delay={2} />
        <FloatingParticle emoji="📍" x={90} y={65} size={24} duration={10} delay={0.5} />
        <FloatingParticle emoji="🌍" x={50} y={85} size={30} duration={11} delay={1.5} />
        <FloatingParticle emoji="🏖️" x={75} y={80} size={22} duration={8} delay={3} />
        <FloatingParticle emoji="⛰️" x={20} y={45} size={24} duration={9} delay={2.5} />
        <FloatingParticle emoji="🌅" x={65} y={25} size={26} duration={7.5} delay={4} />

        {/* Hero content */}
        <motion.div
          className="relative z-10 text-center px-4 max-w-5xl mx-auto"
          style={{ opacity: heroOpacity }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Sparkles className="h-4 w-4 text-amber-300" />
            AI-Powered Travel Planning
            <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-[10px] font-bold text-black uppercase tracking-wider">New</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight leading-[1.1]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            Weekend{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-pink-400 bg-clip-text text-transparent">
                Genie
              </span>
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-amber-300 via-orange-400 to-pink-400 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
              />
            </span>
          </motion.h1>

          {/* Typewriter subtitle */}
          <motion.p
            className="text-xl md:text-2xl text-white/80 mb-4 h-[2em] font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <TypewriterText texts={[
              "Your AI companion for magical weekend getaways ✨",
              "Plan the perfect trip in seconds, not hours 🚀",
              "Discover hidden gems within your budget 💎",
              "From mountains to beaches — we plan it all 🏔️",
            ]} />
          </motion.p>

          <motion.p
            className="text-lg text-white/60 max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            Tell us your budget and preferences — our AI creates personalized itineraries with stays, food, activities & local secrets
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={scrollToForm}
                size="lg"
                className="relative h-14 px-8 text-lg font-semibold rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-white border-0 shadow-[0_0_30px_rgba(251,146,60,0.4)] hover:shadow-[0_0_50px_rgba(251,146,60,0.6)] transition-all duration-300"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Plan My Weekend
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => navigate('/auth')}
                variant="outline"
                size="lg"
                className="h-14 px-8 text-lg font-medium rounded-full bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:text-white transition-all duration-300"
              >
                <Compass className="h-5 w-5 mr-2" />
                Explore Trips
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-8 w-8 text-white/40" />
        </motion.div>
      </motion.header>

      {/* ═══════════ STATS SECTION ═══════════ */}
      <section className="relative -mt-20 z-20 px-4">
        <motion.div
          className="container mx-auto max-w-4xl"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <div className="grid grid-cols-3 gap-4 md:gap-8 p-6 md:p-8 rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)]">
            {[
              { value: 97, suffix: "%", label: "Time Saved", icon: Clock, color: "text-blue-500" },
              { value: 10000, suffix: "+", label: "Trips Planned", icon: Map, color: "text-orange-500" },
              { value: 4.9, suffix: "★", label: "User Rating", icon: Star, color: "text-amber-500" },
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeInUp} className="text-center">
                <div className={`inline-flex p-2.5 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 mb-3 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-1">
                  {stat.value === 4.9 ? (
                    <span>{stat.value}{stat.suffix}</span>
                  ) : (
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  )}
                </div>
                <p className="text-xs md:text-sm text-muted-foreground font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══════════ FEATURES SECTION ═══════════ */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4 tracking-wide uppercase">
              Why Weekend Genie?
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
              Travel Planning, Reimagined
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI understands your preferences, budget, and style to create breathtaking weekend getaways
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                icon: Map, title: "Smart Destinations", color: "from-blue-500 to-cyan-400",
                desc: "AI picks perfect spots matching your budget, interests, and travel style",
                shadow: "shadow-blue-500/20"
              },
              {
                icon: Calendar, title: "Complete Itineraries", color: "from-orange-500 to-amber-400",
                desc: "Hotels, restaurants, activities & time slots — every detail planned for you",
                shadow: "shadow-orange-500/20"
              },
              {
                icon: Heart, title: "Local Secrets", color: "from-purple-500 to-pink-400",
                desc: "Discover hidden gems and authentic experiences that only locals know about",
                shadow: "shadow-purple-500/20"
              },
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <motion.div
                  className={`group relative p-8 rounded-3xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-500 h-full hover:shadow-xl hover:${feature.shadow}`}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                >
                  {/* Glow effect on hover */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                  <motion.div
                    className={`relative w-16 h-16 mb-6 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-lg`}
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3 relative">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed relative">{feature.desc}</p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <HowItWorksSection />

      {/* ═══════════ AI PLANNING FORM ═══════════ */}
      <section id="plan-section" className="py-20 px-4 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] via-primary/[0.05] to-primary/[0.02]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(210_85%_45%_/_0.06)_0%,_transparent_70%)]" />

        <div className="container mx-auto relative">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4 tracking-wide uppercase">
              Start Planning
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Plan Your Dream Weekend
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Fill in a few details and let our AI genie create magic ✨
            </p>
          </motion.div>

          <motion.div
            className="relative w-full max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Glassmorphism glow behind form */}
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-primary/20 via-purple-500/10 to-orange-500/20 blur-xl opacity-60" />
            <div className="relative">
              <WeekendPlannerForm />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ TRAVEL VIBES ═══════════ */}
      <TravelVibesSection />

      {/* ═══════════ POPULAR DESTINATIONS ═══════════ */}
      <RecommendationsSection />

      {/* ═══════════ AI MAGIC ═══════════ */}
      <AIMagicSection />

      {/* ═══════════ BEFORE VS AFTER ═══════════ */}
      <ComparisonSlider />

      {/* ═══════════ TESTIMONIALS ═══════════ */}
      <TestimonialsSection />

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(210_85%_35%)_0%,_hsl(220_80%_20%)_50%,_hsl(260_70%_15%)_100%)]" />
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              "radial-gradient(circle at 30% 50%, hsl(280 70% 50% / 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 70% 50%, hsl(200 80% 50% / 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 30% 50%, hsl(280 70% 50% / 0.3) 0%, transparent 50%)",
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <FloatingParticle emoji="✈️" x={10} y={30} size={24} duration={8} delay={0} />
        <FloatingParticle emoji="🌴" x={88} y={60} size={22} duration={9} delay={1} />
        <FloatingParticle emoji="🗺️" x={25} y={75} size={20} duration={7} delay={2} />

        <div className="container mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready for Your Next <span className="bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">Adventure?</span>
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-10">
              Join thousands of happy travelers who've discovered their perfect weekend with Weekend Genie
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={scrollToForm}
                size="lg"
                className="h-14 px-10 text-lg font-semibold rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-white border-0 shadow-[0_0_40px_rgba(251,146,60,0.5)] hover:shadow-[0_0_60px_rgba(251,146,60,0.7)] transition-all duration-300"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Start Planning — It's Free
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="bg-muted/40 border-t border-border/40 py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <img src={weekendGenieLogo} alt="Weekend Genie" className="h-6 w-6 rounded-md" />
              <span className="font-bold text-lg bg-gradient-hero bg-clip-text text-transparent">Weekend Genie</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>AI-Powered Travel Planning</span>
              <span className="hidden md:inline">•</span>
              <span>Made with ✨ for weekend adventurers</span>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;