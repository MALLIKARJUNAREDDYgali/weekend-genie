import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import WeekendPlannerForm from "@/components/WeekendPlannerForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ProfileMenu } from "@/components/ProfileMenu";
import { RecommendationsSection } from "@/components/RecommendationsSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { ComparisonSlider } from "@/components/ComparisonSlider";
import { useAuth } from "@/contexts/AuthContext";
import heroGenieImage from "@/assets/hero-genie.jpg";
import { Sparkles, Map, Calendar, Heart, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl bg-gradient-hero bg-clip-text text-transparent">
              Weekend Genie
            </span>
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ThemeToggle />
            {loading ? null : user ? (
              <ProfileMenu />
            ) : (
              <Button 
                onClick={() => navigate('/auth')}
                variant="default"
                size="sm"
                className="bg-gradient-hero hover:shadow-magical transition-bounce hover:scale-105"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}
          </motion.div>
        </div>
      </nav>

      {/* Add padding to account for fixed nav */}
      <div className="pt-16">
        {/* Header */}
        <header className="relative overflow-hidden bg-gradient-hero">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-white/5 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.1)_1px,_transparent_1px)] bg-[length:60px_60px]"></div>
          </div>
          <div className="relative container mx-auto px-4 py-20 text-center">
            <motion.div 
              className="flex items-center justify-center mb-6"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.1
              }}
            >
              <img 
                src={heroGenieImage} 
                alt="Weekend Genie - AI Travel Planner" 
                className="w-28 h-28 object-cover rounded-full shadow-magical border-4 border-white/20 hover:scale-110 transition-all duration-300"
              />
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Weekend <span className="text-accent">Genie</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-white/90 mb-2 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Your AI-powered travel companion for magical weekend adventures
            </motion.p>
            
            <motion.p 
              className="text-lg text-white/70 max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              Just tell us your budget and preferences - we'll create the perfect itinerary ✨
            </motion.p>
          </div>
        </header>

        {/* Features Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <motion.div 
              className="grid md:grid-cols-3 gap-8 mb-16"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.div 
                className="text-center group"
                variants={fadeInUp}
              >
                <motion.div 
                  className="w-16 h-16 mx-auto mb-4 bg-gradient-hero rounded-full flex items-center justify-center shadow-magical"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Map className="h-8 w-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">Smart Destinations</h3>
                <p className="text-muted-foreground">AI picks perfect spots within your budget and preferences</p>
              </motion.div>
              
              <motion.div 
                className="text-center group"
                variants={fadeInUp}
              >
                <motion.div 
                  className="w-16 h-16 mx-auto mb-4 bg-gradient-accent rounded-full flex items-center justify-center shadow-magical"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Calendar className="h-8 w-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">Complete Itineraries</h3>
                <p className="text-muted-foreground">From stay to food to activities - we plan everything</p>
              </motion.div>
              
              <motion.div 
                className="text-center group"
                variants={fadeInUp}
              >
                <motion.div 
                  className="w-16 h-16 mx-auto mb-4 bg-gradient-ocean rounded-full flex items-center justify-center shadow-magical"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Heart className="h-8 w-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">Local Secrets</h3>
                <p className="text-muted-foreground">Discover hidden gems and authentic local experiences</p>
              </motion.div>
            </motion.div>

            {/* Form Section */}
            <motion.div 
              className="relative w-full"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <WeekendPlannerForm />
            </motion.div>
          </div>
        </section>

        {/* Recommendations Section */}
        <RecommendationsSection />

        {/* Comparison Slider Section */}
        <ComparisonSlider />

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Footer */}
        <footer className="bg-muted/50 py-8 px-4 text-center">
          <div className="container mx-auto">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              <span>Made with magic for weekend adventurers</span>
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;