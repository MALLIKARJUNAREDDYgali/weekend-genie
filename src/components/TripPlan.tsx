import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Utensils, Hotel, Compass, Sparkles, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

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
  const [isLoading, setIsLoading] = useState(true);
  const [tripData, setTripData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateTripPlan = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
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
        setTripData(data);
        
        toast({
          title: "✨ Trip Plan Generated!",
          description: `Your personalized itinerary for ${data.destination} is ready!`,
        });
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

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Card className="backdrop-blur-sm bg-gradient-card shadow-card border-0">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Generating Your Perfect Trip...</h3>
            <p className="text-muted-foreground text-center">
              Our AI is crafting a personalized itinerary just for you
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !tripData) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Card className="backdrop-blur-sm bg-gradient-card shadow-card border-0">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-destructive text-center mb-4">{error || 'No trip data available'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const samplePlan = tripData;
  const totalEstimate = parseInt(budget);
  const perPersonCost = Math.round(totalEstimate / parseInt(numberOfPeople));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Trip Header */}
      <Card className="backdrop-blur-sm bg-gradient-card shadow-card border-0 overflow-hidden">
        <div className="bg-gradient-hero p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-6 w-6" />
                <h2 className="text-3xl font-bold">{samplePlan.destination}</h2>
              </div>
              <p className="text-lg opacity-90">{samplePlan.summary}</p>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2 bg-white/20 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 mr-1" />
              AI Generated
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-gradient-accent/10 border border-accent/20">
              <p className="text-sm text-muted-foreground mb-1">Total Budget</p>
              <p className="text-2xl font-bold text-accent">₹{totalEstimate.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-accent/10 border border-accent/20">
              <p className="text-sm text-muted-foreground mb-1">Per Person</p>
              <p className="text-2xl font-bold text-accent">₹{perPersonCost.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-accent/10 border border-accent/20">
              <p className="text-sm text-muted-foreground mb-1">Group Size</p>
              <p className="text-2xl font-bold text-accent">{numberOfPeople} {numberOfPeople === "1" ? "Person" : "People"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Where to Stay */}
      <Card className="backdrop-blur-sm bg-gradient-card shadow-card border-0 transition-bounce hover:shadow-magical hover:scale-[1.01]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Hotel className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Where to Stay</CardTitle>
          </div>
          <CardDescription>Comfortable accommodations for your trip</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {samplePlan.accommodations?.map((acc: Accommodation, idx: number) => (
            <div key={idx} className="p-4 rounded-lg border border-border/50 bg-gradient-subtle hover:border-primary/50 transition-all">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{acc.name}</h3>
                  <Badge variant="outline" className="mt-1">{acc.type}</Badge>
                </div>
                <p className="font-bold text-primary">{acc.cost}</p>
              </div>
              {acc.address && (
                <p className="text-sm text-muted-foreground mt-2 flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  {acc.address}
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* What to Eat */}
      <Card className="backdrop-blur-sm bg-gradient-card shadow-card border-0 transition-bounce hover:shadow-magical hover:scale-[1.01]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Utensils className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">What to Eat</CardTitle>
          </div>
          <CardDescription>Delicious local cuisine experiences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {['day1', 'day2'].map((day, dayIdx) => (
            <div key={day} className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Badge variant="default">Day {dayIdx + 1}</Badge>
              </h3>
              <div className="space-y-3 pl-4">
                {['breakfast', 'lunch', 'dinner'].map((meal) => {
                  const mealData = samplePlan.meals?.[day]?.[meal];
                  if (!mealData) return null;
                  
                  return (
                    <div key={meal} className="p-3 rounded-lg bg-gradient-subtle border border-border/50">
                      <div className="flex items-start justify-between mb-1">
                        <span className="text-sm font-medium text-primary capitalize">{meal}</span>
                      </div>
                      <p className="font-medium">{typeof mealData === 'string' ? mealData : mealData.name}</p>
                      {typeof mealData === 'object' && mealData.food && (
                        <p className="text-sm text-muted-foreground mt-1">{mealData.food}</p>
                      )}
                      {typeof mealData === 'object' && mealData.address && (
                        <p className="text-sm text-muted-foreground mt-2 flex items-start gap-2">
                          <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                          {mealData.address}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Activities & Things to Do */}
      <Card className="backdrop-blur-sm bg-gradient-card shadow-card border-0 transition-bounce hover:shadow-magical hover:scale-[1.01]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Compass className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Activities & Things to Do</CardTitle>
          </div>
          <CardDescription>Make the most of your weekend</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {samplePlan.activities?.map((activity: Activity, idx: number) => (
            <div key={idx} className="p-4 rounded-lg border border-border/50 bg-gradient-subtle hover:border-primary/50 transition-all">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{activity.name}</h3>
                <Badge variant="outline">{activity.duration}</Badge>
              </div>
              {activity.time && (
                <p className="text-sm text-muted-foreground mb-2">{activity.time}</p>
              )}
              <p className="text-sm mb-2">{activity.description}</p>
              {activity.address && (
                <p className="text-sm text-muted-foreground flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  {activity.address}
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Local Secret */}
      {samplePlan.localSecret && (
        <Card className="backdrop-blur-sm bg-gradient-hero/10 shadow-card border-primary/30 transition-bounce hover:shadow-magical hover:scale-[1.01]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
              <CardTitle className="text-2xl">Local Secret</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed">{samplePlan.localSecret}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TripPlan;
