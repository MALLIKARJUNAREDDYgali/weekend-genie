import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, MapPin, Users, IndianRupee, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface TripHistoryItem {
  _id: string;
  id: string;
  budget: string;
  numberOfPeople: string;
  destinationPreference: string;
  surpriseMe: boolean;
  destination?: string;
  createdAt: string;
}

interface TripHistoryProps {
  onSelectTrip: (trip: TripHistoryItem) => void;
  refreshKey?: number;
}

const TripHistory = ({ onSelectTrip, refreshKey = 0 }: TripHistoryProps) => {
  const [history, setHistory] = useState<TripHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, session } = useAuth();
  const { toast } = useToast();

  // Fetch history from MongoDB when user is logged in
  useEffect(() => {
    if (user && session) {
      fetchHistory();
    } else {
      setHistory([]);
    }
  }, [user, session, refreshKey]);

  const fetchHistory = async () => {
    if (!session) return;

    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/history`, {
        headers: {
          'Authorization': `Bearer ${session.token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch history');

      const data = await response.json();
      setHistory(data.map((item: any) => ({ ...item, id: item._id })));
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = async () => {
    if (!session) return;

    try {
      const response = await fetch(`${API_URL}/history`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to clear history');

      setHistory([]);
      toast({
        title: "History cleared 🗑️",
        description: "All your search history has been removed",
      });
    } catch (error) {
      console.error('Error clearing history:', error);
      toast({
        title: "Error",
        description: "Failed to clear history",
        variant: "destructive",
      });
    }
  };

  const deleteItem = async (id: string) => {
    if (!session) return;

    try {
      const response = await fetch(`${API_URL}/history/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete item');

      setHistory(prev => prev.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error deleting history item:', error);
      toast({
        title: "Error",
        description: "Failed to delete history item",
        variant: "destructive",
      });
    }
  };

  // Don't show anything if not logged in or no history
  if (!user || history.length === 0) {
    return null;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto backdrop-blur-sm bg-gradient-card shadow-card border-0 mb-6 animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <CardTitle className="text-2xl">Trip History</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={clearHistory} className="transition-bounce hover:scale-105 active:scale-95 hover:shadow-subtle">
            Clear All
          </Button>
        </div>
        <CardDescription>Your previously planned trips</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-3">
              {history.map((trip) => (
                <Card
                  key={trip._id}
                  className="cursor-pointer hover:shadow-glow transition-smooth relative group animate-scale-in hover:scale-[1.02] hover:border-ocean/40"
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
                          {new Date(trip.createdAt).toLocaleDateString('en-IN', {
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
                          deleteItem(trip._id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-bounce hover:scale-110 active:scale-90 hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default TripHistory;
