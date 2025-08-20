import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Users, IndianRupee, Sparkles } from "lucide-react";

interface PlannerFormData {
  budget: string;
  numberOfPeople: string;
  destinationPreference: string;
  surpriseMe: boolean;
}

const WeekendPlannerForm = () => {
  const [formData, setFormData] = useState<PlannerFormData>({
    budget: "",
    numberOfPeople: "2",
    destinationPreference: "",
    surpriseMe: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // TODO: Connect to Supabase in next step
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

  return (
    <Card className="w-full max-w-2xl mx-auto backdrop-blur-sm bg-gradient-card shadow-card border-0">
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
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                ₹
              </span>
              <Input
                id="budget"
                type="text"
                placeholder="2000"
                value={formData.budget}
                onChange={(e) => handleBudgetChange(e.target.value)}
                className="pl-8 h-12 text-lg transition-smooth focus:shadow-glow"
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
              <SelectTrigger className="h-12 text-lg transition-smooth focus:shadow-glow">
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
            <Input
              id="destination"
              type="text"
              placeholder="e.g., Beach, Mountains, City, or specific place..."
              value={formData.destinationPreference}
              onChange={(e) => setFormData({ ...formData, destinationPreference: e.target.value })}
              disabled={formData.surpriseMe}
              className="h-12 text-lg transition-smooth focus:shadow-glow disabled:opacity-60"
            />
          </div>

          {/* Surprise Me Checkbox */}
          <div className="flex items-center space-x-3 p-4 rounded-lg bg-gradient-accent/10 border border-accent/20">
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
            disabled={!isFormValid}
            className="w-full h-14 text-lg font-semibold bg-gradient-hero hover:shadow-magical transition-smooth hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Plan My Weekend Adventure
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default WeekendPlannerForm;