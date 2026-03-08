import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MoveHorizontal, Clock, Zap, FileText, Brain } from "lucide-react";

export function ComparisonSlider() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(percentage, 0), 100));
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) handleMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-background via-accent/5 to-background">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Before & After Weekend Genie
            </h2>
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-4">
            See how we transform chaotic trip planning into a seamless experience
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <MoveHorizontal className="h-4 w-4" />
            <span>Drag the slider to compare</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="overflow-hidden border-0 shadow-2xl">
            <div
              ref={containerRef}
              className="relative w-full h-[600px] select-none cursor-ew-resize"
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
            >
              {/* Before State (Right Side) */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20">
                <div className="absolute top-6 right-6">
                  <Badge className="bg-red-500 text-white text-sm px-4 py-2">
                    <Clock className="h-4 w-4 mr-2" />
                    Before: Hours of Research
                  </Badge>
                </div>
                
                <div className="flex items-center justify-center h-full p-8">
                  <div className="space-y-4 max-w-lg">
                    <h3 className="text-2xl font-bold text-foreground mb-6">
                      Traditional Trip Planning 😓
                    </h3>
                    
                    <Card className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
                      <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm mb-1">Multiple Spreadsheets</p>
                          <p className="text-xs text-muted-foreground">
                            Manually tracking hotels, restaurants, costs, and activities across different files
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm mb-1">Hours of Research</p>
                          <p className="text-xs text-muted-foreground">
                            Browsing 20+ websites, reading reviews, comparing prices, checking availability
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
                      <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm mb-1">Overwhelming Choices</p>
                          <p className="text-xs text-muted-foreground">
                            Too many options, conflicting reviews, budget calculations, endless planning
                          </p>
                        </div>
                      </div>
                    </Card>

                    <div className="pt-4 text-center">
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                        ⏱️ 4-6 Hours
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Average planning time
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* After State (Left Side) */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
              >
                <div className="absolute top-6 left-6">
                  <Badge className="bg-green-500 text-white text-sm px-4 py-2">
                    <Zap className="h-4 w-4 mr-2" />
                    After: Instant Results
                  </Badge>
                </div>

                <div className="flex items-center justify-center h-full p-8">
                  <div className="space-y-4 max-w-lg">
                    <h3 className="text-2xl font-bold text-foreground mb-6">
                      AI-Powered Planning ✨
                    </h3>
                    
                    <Card className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-green-200 dark:border-green-800">
                      <div className="flex items-start gap-3">
                        <Brain className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm mb-1">Smart AI Analysis</p>
                          <p className="text-xs text-muted-foreground">
                            Enter budget & preferences - AI instantly generates personalized itinerary
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-green-200 dark:border-green-800">
                      <div className="flex items-start gap-3">
                        <Sparkles className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm mb-1">Complete Itinerary</p>
                          <p className="text-xs text-muted-foreground">
                            Hotels, restaurants, activities, costs - everything organized in one place
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-green-200 dark:border-green-800">
                      <div className="flex items-start gap-3">
                        <Zap className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm mb-1">Budget Optimized</p>
                          <p className="text-xs text-muted-foreground">
                            Curated recommendations within your budget, no hidden costs or surprises
                          </p>
                        </div>
                      </div>
                    </Card>

                    <div className="pt-4 text-center">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        ⚡ 2 Minutes
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Get your complete plan
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Slider Handle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-primary cursor-ew-resize"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-primary rounded-full shadow-2xl flex items-center justify-center">
                  <MoveHorizontal className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </Card>

          {/* Stats Below */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid md:grid-cols-3 gap-6 mt-8"
          >
            <Card className="p-6 text-center border-0 shadow-card hover:shadow-magical transition-all">
              <div className="text-3xl font-bold text-primary mb-2">97%</div>
              <p className="text-sm text-muted-foreground">Time Saved</p>
            </Card>
            <Card className="p-6 text-center border-0 shadow-card hover:shadow-magical transition-all">
              <div className="text-3xl font-bold text-primary mb-2">10K+</div>
              <p className="text-sm text-muted-foreground">Trips Planned</p>
            </Card>
            <Card className="p-6 text-center border-0 shadow-card hover:shadow-magical transition-all">
              <div className="text-3xl font-bold text-primary mb-2">4.9★</div>
              <p className="text-sm text-muted-foreground">User Rating</p>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
