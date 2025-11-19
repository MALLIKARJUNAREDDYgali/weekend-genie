import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Utensils, Hotel, Compass, Sparkles, Loader2, Heart, Calendar, Users, Wallet } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ShareTripPlan } from "./ShareTripPlan";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

interface TripPlanProps {
  budget: string;
  numberOfPeople: string;
  destinationPreference: string;
  surpriseMe: boolean;
}

interface Accommodation {
  name: string;
  type: string;
  cost: string;
  address?: string;
}

interface Meal {
  name: string;
  food: string;
  address: string;
}

interface Activity {
  name: string;
  time?: string;
  duration: string;
  description: string;
  address?: string;
}

const TripPlan = ({ budget, numberOfPeople, destinationPreference, surpriseMe }: TripPlanProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [tripData, setTripData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const generateTripPlan = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Simulate loading progress animation
        const progressInterval = setInterval(() => {
          setLoadingProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return prev;
            }
            return prev + 10;
          });
        }, 200);
        
        console.log('Calling edge function with:', { budget, numberOfPeople, destinationPreference, surpriseMe });
        
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-trip-plan`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              budget,
              numberOfPeople,
              destinationPreference,
              surpriseMe,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to generate trip plan: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received trip data:', data);
        
        clearInterval(progressInterval);
        setLoadingProgress(100);
        
        // Small delay to show 100% before displaying content
        setTimeout(() => {
          setTripData(data);
          toast({
            title: "✨ Trip Plan Generated!",
            description: `Your personalized itinerary for ${data.destination} is ready!`,
          });
        }, 500);
        
      } catch (err) {
        console.error('Error generating trip plan:', err);
        setError(err instanceof Error ? err.message : 'Failed to generate trip plan');
        toast({
          title: "Error",
          description: "Failed to generate trip plan. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    generateTripPlan();
  }, [budget, numberOfPeople, destinationPreference, surpriseMe]);

  const handleSaveTrip = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save your trips",
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.from('saved_trips').insert({
        user_id: user.id,
        destination: tripData.destination,
        budget,
        number_of_people: numberOfPeople,
        trip_data: tripData,
        is_favorite: false,
      });

      if (error) throw error;

      setIsSaved(true);
      toast({
        title: "Trip saved! 💾",
        description: "You can view it in My Trips section",
      });
    } catch (error) {
      console.error('Error saving trip:', error);
      toast({
        title: "Error",
        description: "Failed to save trip. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="space-y-6"
      >
        <Card className="backdrop-blur-sm bg-gradient-card shadow-2xl border-0 overflow-hidden">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 animate-pulse" />
            <CardContent className="relative flex flex-col items-center justify-center py-20 px-6">
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                  scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
                }}
                className="mb-8"
              >
                <Sparkles className="h-20 w-20 text-primary" />
              </motion.div>
              
              <motion.h3 
                className="text-2xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Crafting Your Perfect Weekend...
              </motion.h3>
              
              <div className="w-full max-w-md space-y-4">
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-hero rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${loadingProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                
                <div className="flex justify-between text-sm text-muted-foreground">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={Math.floor(loadingProgress / 33)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {loadingProgress < 33 && "🔍 Analyzing your preferences..."}
                      {loadingProgress >= 33 && loadingProgress < 66 && "🏨 Finding perfect accommodations..."}
                      {loadingProgress >= 66 && loadingProgress < 90 && "🍽️ Selecting local cuisine..."}
                      {loadingProgress >= 90 && "✨ Finalizing your itinerary..."}
                    </motion.span>
                  </AnimatePresence>
                  <span className="font-semibold">{loadingProgress}%</span>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </motion.div>
    );
  }

  if (error || !tripData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Card className="backdrop-blur-sm bg-gradient-card shadow-card border-0">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-destructive text-center mb-4">{error || 'No trip data available'}</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const samplePlan = tripData;
  const totalEstimate = parseInt(budget);
  const perPersonCost = Math.round(totalEstimate / parseInt(numberOfPeople));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Hero Header with Animated Background */}
      <motion.div variants={cardVariants}>
        <Card className="backdrop-blur-sm bg-gradient-card shadow-2xl border-0 overflow-hidden">
          <div className="relative bg-gradient-hero p-8 overflow-hidden">
            {/* Animated particles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/30 rounded-full"
                  initial={{ 
                    x: `${Math.random() * 100}%`,
                    y: `${Math.random() * 100}%`
                  }}
                  animate={{ 
                    y: [null, "-100%"],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                />
              ))}
            </div>

            <div className="relative flex items-start justify-between flex-wrap gap-4">
              <motion.div 
                className="space-y-3 flex-1"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.div 
                  className="flex items-center gap-3"
                  whileHover={{ scale: 1.02 }}
                >
                  <MapPin className="h-8 w-8 text-white" />
                  <h2 className="text-4xl md:text-5xl font-bold text-white">{samplePlan.destination}</h2>
                </motion.div>
                <p className="text-lg text-white/90">{samplePlan.summary}</p>
              </motion.div>
              
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
              >
                <Badge className="text-base px-5 py-2 bg-white/20 backdrop-blur-md border-white/40 text-white">
                  <Sparkles className="h-5 w-5 mr-2" />
                  AI Generated
                </Badge>
              </motion.div>
            </div>
          </div>
          
          <CardContent className="p-8">
            <motion.div 
              className="grid md:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {[
                { icon: Wallet, label: "Total Budget", value: `₹${totalEstimate.toLocaleString()}`, color: "from-emerald-500 to-teal-500" },
                { icon: Users, label: "Per Person", value: `₹${perPersonCost.toLocaleString()}`, color: "from-blue-500 to-cyan-500" },
                { icon: Calendar, label: "Group Size", value: `${numberOfPeople} ${numberOfPeople === "1" ? "Person" : "People"}`, color: "from-purple-500 to-pink-500" }
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br opacity-10 rounded-xl blur-xl group-hover:opacity-20 transition-opacity" />
                  <div className={`relative text-center p-6 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10 border-2 border-transparent group-hover:border-current transition-all`}>
                    <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                    <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                    <p className="text-3xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                      {stat.value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Where to Stay */}
      <motion.div variants={cardVariants}>
        <Card className="backdrop-blur-sm bg-gradient-card shadow-xl border-0 overflow-hidden group hover:shadow-2xl transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="relative">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ x: 5 }}
            >
              <div className="p-3 rounded-full bg-primary/10">
                <Hotel className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Where to Stay</CardTitle>
                <CardDescription>Comfortable accommodations for your trip</CardDescription>
              </div>
            </motion.div>
          </CardHeader>
          <CardContent className="relative space-y-4">
            {samplePlan.accommodations?.map((acc: Accommodation, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className="p-5 rounded-xl border-2 border-border/50 bg-gradient-subtle hover:border-primary/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg mb-2">{acc.name}</h3>
                    <Badge variant="outline" className="text-xs">{acc.type}</Badge>
                  </div>
                  <motion.p 
                    className="font-bold text-xl text-primary"
                    whileHover={{ scale: 1.1 }}
                  >
                    {acc.cost}
                  </motion.p>
                </div>
                {acc.address && (
                  <p className="text-sm text-muted-foreground mt-3 flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                    {acc.address}
                  </p>
                )}
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* What to Eat */}
      <motion.div variants={cardVariants}>
        <Card className="backdrop-blur-sm bg-gradient-card shadow-xl border-0 overflow-hidden group hover:shadow-2xl transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="relative">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ x: 5 }}
            >
              <div className="p-3 rounded-full bg-accent/10">
                <Utensils className="h-6 w-6 text-accent" />
              </div>
              <div>
                <CardTitle className="text-2xl">What to Eat</CardTitle>
                <CardDescription>Delicious local cuisine experiences</CardDescription>
              </div>
            </motion.div>
          </CardHeader>
          <CardContent className="relative space-y-6">
            {['day1', 'day2'].map((day, dayIdx) => (
              <motion.div 
                key={day} 
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: dayIdx * 0.2 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05, x: 5 }}
                  className="inline-flex"
                >
                  <Badge className="text-base px-4 py-2 bg-gradient-accent">
                    Day {dayIdx + 1}
                  </Badge>
                </motion.div>
                <div className="grid gap-3 pl-2">
                  {['breakfast', 'lunch', 'dinner'].map((meal, mealIdx) => {
                    const mealData = samplePlan.meals?.[day]?.[meal];
                    if (!mealData) return null;
                    
                    return (
                      <motion.div
                        key={meal}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: mealIdx * 0.1 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        className="p-4 rounded-lg bg-gradient-subtle border-2 border-border/50 hover:border-accent/50 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-accent capitalize flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-accent" />
                            {meal}
                          </span>
                        </div>
                        <p className="font-semibold text-lg">{typeof mealData === 'string' ? mealData : mealData.name}</p>
                        {typeof mealData === 'object' && mealData.food && (
                          <p className="text-sm text-muted-foreground mt-1">{mealData.food}</p>
                        )}
                        {typeof mealData === 'object' && mealData.address && (
                          <p className="text-xs text-muted-foreground mt-2 flex items-start gap-2">
                            <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0 text-accent" />
                            {mealData.address}
                          </p>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Activities & Things to Do */}
      <motion.div variants={cardVariants}>
        <Card className="backdrop-blur-sm bg-gradient-card shadow-xl border-0 overflow-hidden group hover:shadow-2xl transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="relative">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ x: 5 }}
            >
              <div className="p-3 rounded-full bg-blue-500/10">
                <Compass className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <CardTitle className="text-2xl">Activities & Things to Do</CardTitle>
                <CardDescription>Make the most of your weekend</CardDescription>
              </div>
            </motion.div>
          </CardHeader>
          <CardContent className="relative space-y-4">
            {samplePlan.activities?.map((activity: Activity, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.02, y: -3 }}
                className="p-5 rounded-xl border-2 border-border/50 bg-gradient-subtle hover:border-blue-500/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg flex-1">{activity.name}</h3>
                  <Badge variant="secondary" className="ml-2">{activity.duration}</Badge>
                </div>
                <p className="text-muted-foreground mb-3">{activity.description}</p>
                {activity.address && (
                  <p className="text-sm text-muted-foreground flex items-start gap-2 mt-2">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-500" />
                    {activity.address}
                  </p>
                )}
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Special Tip */}
      {samplePlan.specialTip && (
        <motion.div variants={cardVariants}>
          <Card className="backdrop-blur-sm bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 shadow-xl border-2 border-amber-200/50 dark:border-amber-800/50 overflow-hidden">
            <CardContent className="p-6">
              <motion.div 
                className="flex items-start gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Sparkles className="h-6 w-6 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                </motion.div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-amber-900 dark:text-amber-100">Pro Tip</h3>
                  <p className="text-amber-800 dark:text-amber-200">{samplePlan.specialTip}</p>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div 
        variants={cardVariants}
        className="flex flex-wrap gap-4 justify-center"
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleSaveTrip}
            disabled={isSaving || isSaved}
            size="lg"
            className="bg-gradient-hero hover:shadow-magical transition-all duration-300"
          >
            {isSaving ? (
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            ) : isSaved ? (
              <Heart className="h-5 w-5 mr-2 fill-current" />
            ) : (
              <Heart className="h-5 w-5 mr-2" />
            )}
            {isSaved ? 'Saved!' : 'Save Trip'}
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <ShareTripPlan tripData={tripData} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default TripPlan;
