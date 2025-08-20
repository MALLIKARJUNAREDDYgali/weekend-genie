import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Utensils, Calendar, Star, RefreshCw, Sparkles } from "lucide-react";

interface TripPlanProps {
  budget: string;
  numberOfPeople: string;
  destinationPreference: string;
  surpriseMe: boolean;
}

const TripPlan = ({ budget, numberOfPeople, destinationPreference, surpriseMe }: TripPlanProps) => {
  // Demo plan data - in real app this comes from AI
  const samplePlan = {
    destination: surpriseMe ? "Goa" : (destinationPreference || "Rishikesh"),
    summary: surpriseMe 
      ? "A perfect beach getaway with stunning sunsets, water sports, and vibrant nightlife in India's party capital!"
      : `An adventure-packed weekend in ${destinationPreference || "Rishikesh"} with nature, culture, and unforgettable experiences!`,
    accommodation: [
      {
        name: "Cozy Beach Resort",
        type: "Beach Resort",
        cost: "₹1,200/night",
        rating: 4.2
      },
      {
        name: "Backpacker's Paradise",
        type: "Hostel",
        cost: "₹800/night",
        rating: 4.0
      }
    ],
    meals: {
      day1: {
        breakfast: "Local Café - Goan Breakfast (₹200)",
        lunch: "Beachside Shack - Fresh Seafood (₹400)",
        dinner: "Night Market - Street Food Tour (₹300)"
      },
      day2: {
        breakfast: "Resort Buffet - Continental (₹250)",
        lunch: "Portuguese Restaurant - Goan Curry (₹350)",
        dinner: "Sunset Beach Café - BBQ Night (₹450)"
      }
    },
    activities: [
      {
        name: "Beach Hopping & Water Sports",
        time: "Day 1, 10:00 AM - 4:00 PM",
        duration: "6 hours",
        cost: "₹1,500",
        description: "Parasailing, jet skiing, and exploring multiple beaches"
      },
      {
        name: "Old Goa Heritage Tour",
        time: "Day 1, 5:00 PM - 8:00 PM", 
        duration: "3 hours",
        cost: "₹500",
        description: "Visit historic churches and colonial architecture"
      },
      {
        name: "Spice Plantation Visit",
        time: "Day 2, 9:00 AM - 2:00 PM",
        duration: "5 hours", 
        cost: "₹800",
        description: "Guided tour with traditional lunch included"
      },
      {
        name: "Sunset Cruise",
        time: "Day 2, 5:00 PM - 7:00 PM",
        duration: "2 hours",
        cost: "₹600",
        description: "Romantic cruise with live music and snacks"
      }
    ],
    optional_tip: "🌟 Hidden Gem: Visit the secret Cola Beach for a pristine, crowd-free experience. Best reached by scooter through winding forest paths!"
  };

  const totalEstimate = parseInt(budget);
  const perPersonCost = Math.floor(totalEstimate / parseInt(numberOfPeople));

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      {/* Header */}
      <Card className="bg-gradient-hero text-white border-0 shadow-magical">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <MapPin className="h-6 w-6" />
            <CardTitle className="text-3xl font-bold">{samplePlan.destination}</CardTitle>
          </div>
          <CardDescription className="text-white/90 text-lg">
            {samplePlan.summary}
          </CardDescription>
          <div className="flex justify-center gap-4 mt-4">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              ₹{budget} Total Budget
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              ₹{perPersonCost} per person
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              {numberOfPeople} People
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Accommodation */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bed className="h-5 w-5 text-primary" />
            Where to Stay
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {samplePlan.accommodation.map((place, index) => (
              <div key={index} className="p-4 rounded-lg border bg-gradient-card">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{place.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm">{place.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{place.type}</p>
                <p className="font-medium text-primary">{place.cost}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Meals */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5 text-primary" />
            Food & Dining
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Day 1
              </h3>
              <div className="space-y-2">
                <p><strong>Breakfast:</strong> {samplePlan.meals.day1.breakfast}</p>
                <p><strong>Lunch:</strong> {samplePlan.meals.day1.lunch}</p>
                <p><strong>Dinner:</strong> {samplePlan.meals.day1.dinner}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Day 2
              </h3>
              <div className="space-y-2">
                <p><strong>Breakfast:</strong> {samplePlan.meals.day2.breakfast}</p>
                <p><strong>Lunch:</strong> {samplePlan.meals.day2.lunch}</p>
                <p><strong>Dinner:</strong> {samplePlan.meals.day2.dinner}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activities */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Activities & Experiences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {samplePlan.activities.map((activity, index) => (
              <div key={index} className="p-4 rounded-lg border bg-gradient-card">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{activity.name}</h3>
                  <Badge variant="outline">{activity.cost}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{activity.time} • {activity.duration}</p>
                <p className="text-sm">{activity.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hidden Gem */}
      <Card className="shadow-magical bg-gradient-accent/10 border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-accent">
            <Sparkles className="h-5 w-5" />
            Local Secret
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">{samplePlan.optional_tip}</p>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button variant="outline" size="lg" className="transition-smooth hover:shadow-card">
          <RefreshCw className="mr-2 h-4 w-4" />
          Generate New Plan
        </Button>
      </div>
    </div>
  );
};

export default TripPlan;