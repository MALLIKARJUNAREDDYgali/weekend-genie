import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Utensils, Calendar, Star, Sparkles } from "lucide-react";

interface TripPlanProps {
  budget: string;
  numberOfPeople: string;
  destinationPreference: string;
  surpriseMe: boolean;
}

const TripPlan = ({ budget, numberOfPeople, destinationPreference, surpriseMe }: TripPlanProps) => {
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
    <div className="space-y-6 w-full max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <Card className="bg-gradient-hero text-white border-0 shadow-magical transition-smooth hover:shadow-glow">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <MapPin className="h-6 w-6" />
            <CardTitle className="text-3xl font-bold">{samplePlan.destination}</CardTitle>
          </div>
          <CardDescription className="text-white/90 text-lg">
            {samplePlan.summary}
          </CardDescription>
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
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

      {/* Where to Stay */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Bed className="h-6 w-6 text-ocean" />
          Where to Stay
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 hover:shadow-glow transition-smooth hover:scale-[1.02] animate-scale-in border-ocean/20 hover:border-ocean">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-semibold">{samplePlan.accommodation[0].name}</h3>
              <div className="flex items-center gap-1 text-sunset">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm font-medium">{samplePlan.accommodation[0].rating}</span>
              </div>
            </div>
            <Badge variant="secondary" className="mb-3">{samplePlan.accommodation[0].type}</Badge>
            <p className="text-lg font-bold text-ocean">{samplePlan.accommodation[0].cost}</p>
          </Card>

          <Card className="p-6 hover:shadow-glow transition-smooth hover:scale-[1.02] animate-scale-in border-sunset/20 hover:border-sunset">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-semibold">{samplePlan.accommodation[1].name}</h3>
              <div className="flex items-center gap-1 text-sunset">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm font-medium">{samplePlan.accommodation[1].rating}</span>
              </div>
            </div>
            <Badge variant="secondary" className="mb-3">{samplePlan.accommodation[1].type}</Badge>
            <p className="text-lg font-bold text-sunset">{samplePlan.accommodation[1].cost}</p>
          </Card>
        </div>
      </div>

      {/* What to Eat */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Utensils className="h-6 w-6 text-forest" />
          What to Eat
        </h2>
        <Card className="p-6 space-y-4 hover:shadow-glow transition-smooth hover:scale-[1.02] animate-scale-in border-forest/20 hover:border-forest">
          {/* Day 1 Meals */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-5 w-5 text-forest" />
              <h3 className="text-xl font-semibold">Day 1</h3>
            </div>
            <div className="space-y-2 ml-7">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">Breakfast</Badge>
                <p className="flex-1">{samplePlan.meals.day1.breakfast}</p>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">Lunch</Badge>
                <p className="flex-1">{samplePlan.meals.day1.lunch}</p>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">Dinner</Badge>
                <p className="flex-1">{samplePlan.meals.day1.dinner}</p>
              </div>
            </div>
          </div>

          {/* Day 2 Meals */}
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-5 w-5 text-forest" />
              <h3 className="text-xl font-semibold">Day 2</h3>
            </div>
            <div className="space-y-2 ml-7">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">Breakfast</Badge>
                <p className="flex-1">{samplePlan.meals.day2.breakfast}</p>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">Lunch</Badge>
                <p className="flex-1">{samplePlan.meals.day2.lunch}</p>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">Dinner</Badge>
                <p className="flex-1">{samplePlan.meals.day2.dinner}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Activities */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-mountain" />
          Activities & Things to Do
        </h2>
        <Card className="p-6 space-y-4 hover:shadow-glow transition-smooth hover:scale-[1.02] animate-scale-in border-mountain/20 hover:border-mountain">
          {samplePlan.activities.map((activity, index) => (
            <div key={index} className="pb-4 last:pb-0 border-b last:border-0">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{activity.name}</h3>
                <Badge variant="secondary" className="bg-mountain/10 text-mountain border-mountain/20">{activity.cost}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
              <div className="flex gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-mountain" />
                  {activity.time}
                </span>
                <span className="text-muted-foreground">Duration: {activity.duration}</span>
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Hidden Gem Tip */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Star className="h-6 w-6 text-sunset fill-current" />
          Local Secret
        </h2>
        <Card className="p-6 bg-gradient-sunset/20 border-sunset/30 hover:shadow-glow transition-smooth hover:scale-[1.02] animate-scale-in hover:border-sunset">
          <p className="text-lg leading-relaxed">{samplePlan.optional_tip}</p>
        </Card>
      </div>
    </div>
  );
};

export default TripPlan;
