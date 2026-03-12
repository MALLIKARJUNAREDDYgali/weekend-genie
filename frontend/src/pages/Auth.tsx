import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Mail, Lock, User, Plane, MapPin, Compass, ArrowLeft, Check, Globe, Eye, EyeOff } from "lucide-react";
import weekendGenieLogo from "@/assets/weekend-genie-logo.png";

// ── Floating Travel Element ─────────────────────────────
const FloatingElement = ({ emoji, x, y, size, duration, delay }: {
  emoji: string; x: number; y: number; size: number; duration: number; delay: number;
}) => (
  <motion.div
    className="absolute pointer-events-none select-none"
    style={{ left: `${x}%`, top: `${y}%`, fontSize: `${size}px` }}
    animate={{
      y: [0, -20, 0, 15, 0],
      x: [0, 10, -8, 5, 0],
      rotate: [0, 8, -8, 4, 0],
      opacity: [0.2, 0.5, 0.3, 0.5, 0.2],
    }}
    transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
  >
    {emoji}
  </motion.div>
);

// ── Typewriter Text ─────────────────────────────────────
const TypewriterLoop = ({ texts }: { texts: string[] }) => {
  const [idx, setIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const text = texts[idx];
    const timeout = setTimeout(() => {
      if (!deleting) {
        if (charIdx < text.length) setCharIdx(c => c + 1);
        else setTimeout(() => setDeleting(true), 2000);
      } else {
        if (charIdx > 0) setCharIdx(c => c - 1);
        else { setDeleting(false); setIdx((i) => (i + 1) % texts.length); }
      }
    }, deleting ? 25 : 55);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, idx, texts]);

  return (
    <span className="text-amber-300">
      {texts[idx].substring(0, charIdx)}
      <motion.span
        className="inline-block w-[2px] h-[1em] bg-amber-300/80 ml-0.5 align-middle"
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity }}
      />
    </span>
  );
};

// ── Image Slideshow ─────────────────────────────────────
const slideshowImages = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&h=1200&fit=crop",
  "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=1200&fit=crop",
];

// ── Main Auth Component ─────────────────────────────────
const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { signUp, signIn, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  // Slideshow timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideshowImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!email || !password || !fullName) {
      toast({ title: "Missing information", description: "Please fill in all fields", variant: "destructive" });
      setIsLoading(false);
      return;
    }
    const { error } = await signUp(email, password, fullName);
    if (error) {
      toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Welcome to Weekend Genie! ✨", description: "Your account has been created successfully" });
      navigate('/');
    }
    setIsLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!email || !password) {
      toast({ title: "Missing information", description: "Please enter email and password", variant: "destructive" });
      setIsLoading(false);
      return;
    }
    const { error } = await signIn(email, password);
    if (error) {
      toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Welcome back! ✨", description: "You've successfully signed in" });
      navigate('/');
    }
    setIsLoading(false);
  };

  const features = [
    { icon: MapPin, text: "Personalized travel recommendations" },
    { icon: Compass, text: "AI-powered itinerary planning" },
    { icon: Sparkles, text: "Discover local hidden gems" },
  ];

  return (
    <div className="min-h-screen flex relative bg-background">

      {/* ═══════ LEFT SIDE — Visual Experience ═══════ */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">

        {/* Image slideshow */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            <img
              src={slideshowImages[currentSlide]}
              alt="Travel destination"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

        {/* Animated mesh gradient overlay */}
        <motion.div
          className="absolute inset-0 opacity-40"
          animate={{
            background: [
              "linear-gradient(135deg, hsl(210 80% 30% / 0.5) 0%, transparent 50%, hsl(260 70% 30% / 0.3) 100%)",
              "linear-gradient(135deg, hsl(260 70% 30% / 0.5) 0%, transparent 50%, hsl(25 90% 40% / 0.3) 100%)",
              "linear-gradient(135deg, hsl(210 80% 30% / 0.5) 0%, transparent 50%, hsl(260 70% 30% / 0.3) 100%)",
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating travel elements */}
        <FloatingElement emoji="✈️" x={15} y={12} size={28} duration={9} delay={0} />
        <FloatingElement emoji="🧭" x={78} y={18} size={24} duration={8} delay={1} />
        <FloatingElement emoji="📍" x={82} y={70} size={22} duration={10} delay={2} />
        <FloatingElement emoji="🌍" x={20} y={75} size={26} duration={7} delay={0.5} />
        <FloatingElement emoji="🗺️" x={60} y={85} size={20} duration={8.5} delay={3} />
        <FloatingElement emoji="☁️" x={40} y={8} size={30} duration={12} delay={1.5} />
        <FloatingElement emoji="☁️" x={70} y={5} size={24} duration={14} delay={4} />

        {/* Slideshow dots */}
        <div className="absolute bottom-8 left-12 flex gap-2 z-20">
          {slideshowImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === currentSlide ? "w-8 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>

        {/* Left content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 text-white w-full">

          {/* Back button */}
          <motion.button
            onClick={() => navigate('/')}
            className="absolute top-8 left-12 flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
            whileHover={{ x: -3 }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </motion.button>

          {/* Brand */}
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <img src={weekendGenieLogo} alt="Weekend Genie" className="w-12 h-12 rounded-2xl shadow-lg" />
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  animate={{ boxShadow: ["0 0 0px rgba(251,191,36,0)", "0 0 25px rgba(251,191,36,0.4)", "0 0 0px rgba(251,191,36,0)"] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
              </div>
              <span className="text-2xl font-bold tracking-tight">Weekend Genie</span>
            </div>

            <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-4">
              Your magical AI companion for{" "}
              <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-pink-400 bg-clip-text text-transparent">
                unforgettable
              </span>{" "}
              weekends
            </h1>

            {/* Typewriter */}
            <div className="text-lg text-white/70 h-[1.5em]">
              <TypewriterLoop texts={[
                "Discover hidden gems ✨",
                "Plan perfect trips in seconds 🚀",
                "Explore amazing destinations 🌍",
                "AI-powered itineraries just for you 🤖",
              ]} />
            </div>
          </motion.div>

          {/* Feature list */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3.5"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.15, duration: 0.5 }}
              >
                <div className="shrink-0 h-9 w-9 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                  <feature.icon className="h-4.5 w-4.5 text-amber-300" />
                </div>
                <span className="text-white/80 text-[15px]">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Social proof */}
          <motion.div
            className="mt-10 flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.6 }}
          >
            <div className="flex -space-x-2">
              {["🧑", "👩", "🧑‍🦱", "👨"].map((emoji, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-sm">
                  {emoji}
                </div>
              ))}
            </div>
            <div className="text-sm">
              <span className="text-white/90 font-medium">10,000+</span>{" "}
              <span className="text-white/50">travelers trust us</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ═══════ RIGHT SIDE — Auth Form ═══════ */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 sm:p-10 relative">

        {/* Subtle background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(210_85%_45%_/_0.04)_0%,_transparent_60%)]" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-60 h-60 bg-purple-500/5 rounded-full blur-3xl" />

        <motion.div
          className="w-full max-w-[420px] relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <motion.div
              className="inline-flex items-center gap-2.5 mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img src={weekendGenieLogo} alt="Weekend Genie" className="w-10 h-10 rounded-xl mx-auto mb-4" />
              <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">Weekend Genie</span>
            </motion.div>
            <p className="text-sm text-muted-foreground">Your magical AI travel companion</p>
          </div>

          {/* Floating glass card */}
          <motion.div
            className="rounded-3xl bg-card/80 backdrop-blur-xl border border-border/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] p-8"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-7">
              <h2 className="text-2xl font-bold mb-1.5">Welcome</h2>
              <p className="text-sm text-muted-foreground">
                Sign in to continue your journey
              </p>
            </div>

            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-7 bg-muted/40 rounded-xl h-11 p-1">
                <TabsTrigger
                  value="signin"
                  className="rounded-lg text-sm font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground transition-all"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="rounded-lg text-sm font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground transition-all"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              {/* ── Sign In Tab ── */}
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="signin-email" className="text-sm font-medium">Email</Label>
                    <div className="relative group">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-11 h-12 rounded-xl bg-muted/30 border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="signin-password" className="text-sm font-medium">Password</Label>
                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-11 pr-11 h-12 rounded-xl bg-muted/30 border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      className="w-full h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-primary via-blue-600 to-purple-600 hover:shadow-[0_8px_30px_-5px_rgba(59,130,246,0.5)] transition-all duration-300"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Signing in...</>
                      ) : (
                        <><Sparkles className="mr-2 h-5 w-5" /> Sign In</>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </TabsContent>

              {/* ── Sign Up Tab ── */}
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-name" className="text-sm font-medium">Username</Label>
                    <div className="relative group">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="johndoe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-11 h-12 rounded-xl bg-muted/30 border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="signup-email" className="text-sm font-medium">Email</Label>
                    <div className="relative group">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-11 h-12 rounded-xl bg-muted/30 border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="signup-password" className="text-sm font-medium">Password</Label>
                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-11 pr-11 h-12 rounded-xl bg-muted/30 border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                        disabled={isLoading}
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-muted-foreground pl-1">Must be at least 6 characters</p>
                  </div>

                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      className="w-full h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-primary via-blue-600 to-purple-600 hover:shadow-[0_8px_30px_-5px_rgba(59,130,246,0.5)] transition-all duration-300"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Creating account...</>
                      ) : (
                        <><Sparkles className="mr-2 h-5 w-5" /> Create Account</>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </TabsContent>
            </Tabs>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/60" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-card/80 backdrop-blur-sm px-3 text-xs text-muted-foreground uppercase tracking-wider">
                  or continue with
                </span>
              </div>
            </div>

            {/* Social login */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: "Google", icon: "G", gradient: "hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-200 dark:hover:border-red-800" },
                { name: "Apple", icon: "🍎", gradient: "hover:bg-gray-50 dark:hover:bg-gray-800/40 hover:border-gray-300 dark:hover:border-gray-600" },
                { name: "GitHub", icon: "⌨️", gradient: "hover:bg-purple-50 dark:hover:bg-purple-950/20 hover:border-purple-200 dark:hover:border-purple-800" },
              ].map((provider) => (
                <motion.button
                  key={provider.name}
                  type="button"
                  className={`h-11 rounded-xl border border-border/60 bg-muted/20 flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200 ${provider.gradient}`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="text-base">{provider.icon}</span>
                  <span className="hidden sm:inline text-xs text-muted-foreground">{provider.name}</span>
                </motion.button>
              ))}
            </div>

            {/* Terms */}
            <p className="mt-6 text-center text-[11px] text-muted-foreground leading-relaxed">
              By continuing, you agree to our{" "}
              <span className="text-primary hover:underline cursor-pointer">Terms of Service</span>{" "}
              and{" "}
              <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
