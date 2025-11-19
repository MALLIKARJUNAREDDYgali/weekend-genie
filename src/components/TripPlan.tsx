import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Utensils, Hotel, Compass, Sparkles, Heart, Calendar, Users, Wallet } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ShareTripPlan } from "./ShareTripPlan";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

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
        
        setTimeout(() => {
          setTripData(data);
          setIsLoading(false);
          console.log('TripPlan: data set, should render now', data);
          toast({
            title: "✨ Trip Plan Generated!",
            description: `Your personalized itinerary for ${data.destination} is ready!`,
          });
        }, 500);
        
      } catch (err) {
        console.error('Error generating trip plan:', err);
        setError(err instanceof Error ? err.message : 'Failed to generate trip plan');
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Failed to generate trip plan. Please try again.",
          variant: "destructive",
        });
      }
    };

    generateTripPlan();
  }, [budget, numberOfPeople, destinationPreference, surpriseMe]);

  const handleSaveTrip = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save your trip",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      const { error } = await supabase.from('saved_trips').insert({
        user_id: user.id,
        destination: tripData.destination,
        budget,
        number_of_people: numberOfPeople,
        trip_data: tripData,
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
    console.log("TripPlan: loading", { loadingProgress });
    return (
      <div className="space-y-6">
        <Card className="bg-card shadow-lg border">
          <CardContent className="flex flex-col items-center justify-center py-20 px-6">
            <Sparkles className="h-16 w-16 text-primary mb-4 animate-spin" />
            <h3 className="text-2xl font-bold mb-4">Generating Your Trip Plan...</h3>
            <div className="w-full max-w-md space-y-4">
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>
                  {loadingProgress < 33 && "🔍 Analyzing preferences..."}
                  {loadingProgress >= 33 && loadingProgress < 66 && "🏨 Finding accommodations..."}
                  {loadingProgress >= 66 && loadingProgress < 90 && "🍽️ Selecting cuisine..."}
                  {loadingProgress >= 90 && "✨ Finalizing itinerary..."}
                </span>
                <span className="font-semibold">{loadingProgress}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !tripData) {
    console.log("TripPlan: error or no data", { error, tripData });
    return (
      <div className="space-y-6">
        <Card className="bg-card shadow-lg border">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-destructive text-center mb-4">{error || 'No trip data available'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  console.log("TripPlan: rendering with data", tripData);
  const totalEstimate = parseInt(budget);
  const perPersonCost = Math.round(totalEstimate / parseInt(numberOfPeople));

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <Card className="bg-primary text-primary-foreground shadow-lg border-0">
        <CardHeader className="pb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <MapPin className="h-8 w-8" />
                <CardTitle className="text-4xl md:text-5xl font-bold">{tripData.destination}</CardTitle>
              </div>
              <p className="text-lg opacity-90">{tripData.summary}</p>
            </div>
            <Badge className="text-base px-4 py-2 bg-primary-foreground/20 text-primary-foreground border-primary-foreground/40">
              <Sparkles className="h-4 w-4 mr-2" />
              AI Generated
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-primary-foreground/10 rounded-lg p-4">
              <Wallet className="h-6 w-6 mb-2" />
              <div className="text-sm opacity-80">Total Budget</div>
              <div className="text-2xl font-bold">₹{totalEstimate.toLocaleString()}</div>
            </div>
            <div className="bg-primary-foreground/10 rounded-lg p-4">
              <Users className="h-6 w-6 mb-2" />
              <div className="text-sm opacity-80">Per Person</div>
              <div className="text-2xl font-bold">₹{perPersonCost.toLocaleString()}</div>
            </div>
            <div className="bg-primary-foreground/10 rounded-lg p-4">
              <Calendar className="h-6 w-6 mb-2" />
              <div className="text-sm opacity-80">Group Size</div>
              <div className="text-2xl font-bold">{numberOfPeople} {numberOfPeople === "1" ? "Person" : "People"}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accommodations */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Hotel className="h-6 w-6 text-primary" />
            Where You'll Stay
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tripData.accommodations?.map((acc: Accommodation, idx: number) => (
              <div key={idx} className="p-4 bg-muted rounded-lg">
                <h3 className="font-bold text-lg mb-1">{acc.name}</h3>
                <Badge variant="secondary" className="mb-2">{acc.type}</Badge>
                <p className="text-sm text-muted-foreground mb-1">💰 {acc.cost}</p>
                {acc.address && (
                  <p className="text-sm text-muted-foreground">📍 {acc.address}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Meals */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Utensils className="h-6 w-6 text-primary" />
            Where You'll Eat
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(tripData.meals || {}).map(([day, meals]: [string, any], dayIdx) => (
              <div key={day} className="space-y-3">
                <h3 className="font-bold text-lg capitalize border-b pb-2">Day {dayIdx + 1}</h3>
                
                {meals.breakfast && (
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="font-semibold mb-1">🌅 Breakfast - {meals.breakfast.name}</div>
                    <p className="text-sm mb-1">{meals.breakfast.food}</p>
                    <p className="text-sm text-muted-foreground">📍 {meals.breakfast.address}</p>
                  </div>
                )}
                
                {meals.lunch && (
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="font-semibold mb-1">☀️ Lunch - {meals.lunch.name}</div>
                    <p className="text-sm mb-1">{meals.lunch.food}</p>
                    <p className="text-sm text-muted-foreground">📍 {meals.lunch.address}</p>
                  </div>
                )}
                
                {meals.dinner && (
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="font-semibold mb-1">🌙 Dinner - {meals.dinner.name}</div>
                    <p className="text-sm mb-1">{meals.dinner.food}</p>
                    <p className="text-sm text-muted-foreground">📍 {meals.dinner.address}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activities */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Compass className="h-6 w-6 text-primary" />
            Things To Do
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tripData.activities?.map((activity: Activity, idx: number) => (
              <div key={idx} className="p-4 bg-muted rounded-lg">
                <h3 className="font-bold text-lg mb-2">{activity.name}</h3>
                <p className="text-sm mb-2">{activity.description}</p>
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  {activity.time && <span>🕒 {activity.time}</span>}
                  {activity.duration && <span>⏱️ {activity.duration}</span>}
                </div>
                {activity.address && (
                  <p className="text-sm text-muted-foreground mt-2">📍 {activity.address}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Local Secret */}
      {tripData.localSecret && (
        <Card className="shadow-lg border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="h-6 w-6 text-primary" />
              Local Secret
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base">{tripData.localSecret}</p>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card className="shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              onClick={handleSaveTrip}
              disabled={isSaving || isSaved || !user}
              size="lg"
              className="gap-2"
            >
              <Heart className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
              {isSaving ? 'Saving...' : isSaved ? 'Saved!' : 'Save Trip'}
            </Button>
            <ShareTripPlan tripData={tripData} />
          </div>
          {!user && (
            <p className="text-sm text-muted-foreground text-center mt-4">
              Sign in to save your trip plan
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TripPlan;
