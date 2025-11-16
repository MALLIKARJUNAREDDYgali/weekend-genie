import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Users, IndianRupee, Sparkles, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TripPlan from "./TripPlan";
import VoiceInput from "./VoiceInput";
import TripHistory from "./TripHistory";

interface PlannerFormData {
  budget: string;
  numberOfPeople: string;
  destinationPreference: string;
  surpriseMe: boolean;
}

const WeekendPlannerForm = () => {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPlan, setShowPlan] = useState(false);
  const [formData, setFormData] = useState<PlannerFormData>({
    budget: "",
    numberOfPeople: "2",
    destinationPreference: "",
    surpriseMe: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    
    // Save to history
    const historyItem = {
      id: Date.now().toString(),
      ...formData,
      timestamp: Date.now(),
    };
    const existingHistory = JSON.parse(localStorage.getItem('tripHistory') || '[]');
    localStorage.setItem('tripHistory', JSON.stringify([historyItem, ...existingHistory].slice(0, 10)));
    
    // Show success feedback
    setIsSubmitted(true);
    toast({
      title: "✨ Generating Your Perfect Weekend!",
      description: `Creating AI-powered itinerary for ${formData.numberOfPeople} people with ₹${formData.budget}...`,
    });
    
    // Simulate AI generation delay, then show plan
    setTimeout(() => {
      setIsSubmitted(false);
      setShowPlan(true);
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 2000);
  };

  const handleHistorySelect = (trip: any) => {
    setFormData({
      budget: trip.budget,
      numberOfPeople: trip.numberOfPeople,
      destinationPreference: trip.destinationPreference,
      surpriseMe: trip.surpriseMe,
    });
    setShowPlan(true);
  };

  const handleBudgetChange = (value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, "");
    setFormData({ ...formData, budget: numericValue });
  };

  const handleSurpriseMeChange = (checked: boolean) => {
    setFormData({ 
      ...formData, 
      surpriseMe: checked,
      destinationPreference: checked ? "" : formData.destinationPreference
    });
  };

  const isBudgetValid = parseInt(formData.budget) >= 2000;
  const isFormValid = formData.budget && isBudgetValid && formData.numberOfPeople;

  if (showPlan) {
    return (
      <div className="space-y-6">
        <TripPlan 
          budget={formData.budget}
          numberOfPeople={formData.numberOfPeople}
          destinationPreference={formData.destinationPreference}
          surpriseMe={formData.surpriseMe}
        />
        <div className="text-center">
          <Button 
            onClick={() => setShowPlan(false)}
            variant="outline"
            size="lg"
            className="transition-smooth hover:shadow-card"
          >
            Plan Another Trip
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <TripHistory onSelectTrip={handleHistorySelect} />
      <Card className="w-full max-w-2xl mx-auto backdrop-blur-sm bg-gradient-card shadow-card border-0 animate-fade-in">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
          Plan Your Perfect Weekend
        </CardTitle>
        <CardDescription className="text-lg text-muted-foreground">
          Tell us your preferences and let our AI genie create magic ✨
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Budget Input */}
          <div className="space-y-2">
            <Label htmlFor="budget" className="text-base font-medium flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-primary" />
              Budget (Minimum ₹2000)
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  ₹
                </span>
                <Input
                  id="budget"
                  type="text"
                  placeholder="2000"
                  value={formData.budget}
                  onChange={(e) => handleBudgetChange(e.target.value)}
                  className="pl-8 h-12 text-lg transition-smooth focus:shadow-glow hover:border-ocean"
                />
              </div>
              <VoiceInput 
                onResult={(text) => handleBudgetChange(text)}
                placeholder="Say your budget in rupees"
              />
            </div>
            {formData.budget && !isBudgetValid && (
              <p className="text-sm text-destructive">Budget must be at least ₹2000</p>
            )}
          </div>

          {/* Number of People */}
          <div className="space-y-2">
            <Label htmlFor="people" className="text-base font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Number of People
            </Label>
            <Select value={formData.numberOfPeople} onValueChange={(value) => setFormData({ ...formData, numberOfPeople: value })}>
              <SelectTrigger className="h-12 text-lg transition-smooth focus:shadow-glow hover:border-forest">
                <SelectValue placeholder="Select number of people" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? "Person" : "People"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Destination Preference */}
          <div className="space-y-2">
            <Label htmlFor="destination" className="text-base font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Destination Preference (Optional)
            </Label>
            <div className="flex gap-2">
              <Input
                id="destination"
                type="text"
                placeholder="e.g., Beach, Mountains, City, or specific place..."
                value={formData.destinationPreference}
                onChange={(e) => setFormData({ ...formData, destinationPreference: e.target.value })}
                disabled={formData.surpriseMe}
                className="h-12 text-lg transition-smooth focus:shadow-glow hover:border-sunset disabled:opacity-60 flex-1"
              />
              <VoiceInput 
                onResult={(text) => setFormData({ ...formData, destinationPreference: text })}
                placeholder="Say your destination preference"
              />
            </div>
          </div>

          {/* Surprise Me Checkbox */}
          <div className="flex items-center space-x-3 p-4 rounded-lg bg-gradient-accent/10 border border-accent/20 transition-smooth hover:shadow-subtle hover:border-mountain/40">
            <Checkbox
              id="surprise"
              checked={formData.surpriseMe}
              onCheckedChange={handleSurpriseMeChange}
              className="h-5 w-5"
            />
            <Label 
              htmlFor="surprise" 
              className="text-base font-medium flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-accent" />
              Surprise me with a destination!
            </Label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!isFormValid || isSubmitted}
            className="w-full h-14 text-lg font-semibold bg-gradient-hero hover:shadow-magical transition-bounce hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
          >
            {isSubmitted ? (
              <>
                <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                Generating Magic...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Plan My Weekend Adventure
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
    </>
  );
};

export default WeekendPlannerForm;