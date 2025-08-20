import WeekendPlannerForm from "@/components/WeekendPlannerForm";
import SupabaseConnectPrompt from "@/components/SupabaseConnectPrompt";
import heroGenieImage from "@/assets/hero-genie.jpg";
import { Sparkles, Map, Calendar, Heart } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-white/5 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.1)_1px,_transparent_1px)] bg-[length:60px_60px]"></div>
        </div>
        <div className="relative container mx-auto px-4 py-16 text-center">
          <div className="flex items-center justify-center mb-6">
            <img 
              src={heroGenieImage} 
              alt="Weekend Genie - AI Travel Planner" 
              className="w-24 h-24 object-cover rounded-full shadow-glow border-4 border-white/20"
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            Weekend <span className="text-accent">Genie</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-2 max-w-2xl mx-auto leading-relaxed">
            Your AI-powered travel companion for magical weekend adventures
          </p>
          <p className="text-lg text-white/70 max-w-xl mx-auto">
            Just tell us your budget and preferences - we'll create the perfect itinerary ✨
          </p>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-hero rounded-full flex items-center justify-center shadow-magical group-hover:scale-110 transition-bounce">
                <Map className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Destinations</h3>
              <p className="text-muted-foreground">AI picks perfect spots within your budget and preferences</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-accent rounded-full flex items-center justify-center shadow-magical group-hover:scale-110 transition-bounce">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Complete Itineraries</h3>
              <p className="text-muted-foreground">From stay to food to activities - we plan everything</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-hero rounded-full flex items-center justify-center shadow-magical group-hover:scale-110 transition-bounce">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Local Secrets</h3>
              <p className="text-muted-foreground">Discover hidden gems and authentic local experiences</p>
            </div>
          </div>

          {/* Form Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl"></div>
            <div className="relative p-8">
              <WeekendPlannerForm />
              <SupabaseConnectPrompt />
            </div>
          </div>
        </div>
      </section>

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
  );
};

export default Index;