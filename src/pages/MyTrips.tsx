import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ProfileMenu } from "@/components/ProfileMenu";
import { ProfileSidebar } from "@/components/ProfileSidebar";
import { Loader2, MapPin, Users, IndianRupee, ArrowLeft, Sparkles, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SavedTrip {
  id: string;
  destination: string;
  budget: string;
  number_of_people: string;
  trip_data: any;
  is_favorite: boolean;
  created_at: string;
}

const MyTrips = () => {
  const { user, loading: authLoading } = useAuth();
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchTrips();
    }
  }, [user]);

  const fetchTrips = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_trips')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTrips(data || []);
    } catch (error) {
      console.error('Error fetching trips:', error);
      toast({
        title: "Error",
        description: "Failed to load your trips",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl bg-gradient-hero bg-clip-text text-transparent">
              Weekend Genie
            </span>
          </motion.div>
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <ProfileMenu />
          </div>
        </div>
      </nav>

      <div className="pt-20 pb-16 px-4 bg-gradient-to-br from-background via-background to-accent/5">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-8">
            <ProfileSidebar />
            
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Button
                  variant="ghost"
                  onClick={() => navigate('/')}
                  className="mb-6 hover:bg-accent/50"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>

                <div className="mb-8">
                  <h1 className="text-4xl font-bold mb-2 bg-gradient-hero bg-clip-text text-transparent">
                    My Trips
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    View and manage your planned adventures
                  </p>
                </div>

            {trips.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="text-center py-16 border-0 shadow-card">
                  <CardContent>
                    <MapPin className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">No trips yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Start planning your first weekend adventure!
                    </p>
                    <Button 
                      onClick={() => navigate('/')}
                      className="bg-gradient-hero hover:shadow-magical"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Plan a Trip
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                className="grid md:grid-cols-2 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, staggerChildren: 0.1 }}
              >
                {trips.map((trip, index) => (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-magical transition-all duration-300 border-0 shadow-card h-full">
                      <CardHeader className="bg-gradient-hero text-white rounded-t-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-2xl mb-2">
                              {trip.trip_data?.destination || trip.destination}
                            </CardTitle>
                            <p className="text-white/80 text-sm">
                              {trip.trip_data?.summary || ''}
                            </p>
                          </div>
                          {trip.is_favorite && (
                            <Badge className="bg-sunset border-0">
                              ⭐ Favorite
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <IndianRupee className="h-4 w-4" />
                            <span>Budget: ₹{trip.budget}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{trip.number_of_people} {trip.number_of_people === '1' ? 'Person' : 'People'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>Planned on {formatDate(trip.created_at)}</span>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => {
                            toast({
                              title: "Coming Soon! 🚀",
                              description: "Trip details view is under development",
                            });
                          }}
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTrips;
