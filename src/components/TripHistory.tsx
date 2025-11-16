import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, MapPin, Users, IndianRupee, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TripHistoryItem {
  id: string;
  budget: string;
  numberOfPeople: string;
  destinationPreference: string;
  surpriseMe: boolean;
  timestamp: number;
  destination?: string;
}

interface TripHistoryProps {
  onSelectTrip: (trip: TripHistoryItem) => void;
}

const TripHistory = ({ onSelectTrip }: TripHistoryProps) => {
  const [history, setHistory] = useState<TripHistoryItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('tripHistory');
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('tripHistory');
    setHistory([]);
  };

  const deleteItem = (id: string) => {
    const updated = history.filter(item => item.id !== id);
    localStorage.setItem('tripHistory', JSON.stringify(updated));
    setHistory(updated);
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto backdrop-blur-sm bg-gradient-card shadow-card border-0 mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <CardTitle className="text-2xl">Trip History</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={clearHistory}>
            Clear All
          </Button>
        </div>
        <CardDescription>View your previously planned trips</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-3">
            {history.map((trip) => (
              <Card 
                key={trip.id} 
                className="cursor-pointer hover:shadow-glow transition-smooth relative group"
                onClick={() => onSelectTrip(trip)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary" className="gap-1">
                          <IndianRupee className="h-3 w-3" />
                          {trip.budget}
                        </Badge>
                        <Badge variant="secondary" className="gap-1">
                          <Users className="h-3 w-3" />
                          {trip.numberOfPeople} {trip.numberOfPeople === "1" ? "Person" : "People"}
                        </Badge>
                        {trip.destinationPreference && (
                          <Badge variant="secondary" className="gap-1">
                            <MapPin className="h-3 w-3" />
                            {trip.destinationPreference}
                          </Badge>
                        )}
                        {trip.surpriseMe && (
                          <Badge variant="secondary">Surprise Me</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(trip.timestamp).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteItem(trip.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-smooth"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TripHistory;
