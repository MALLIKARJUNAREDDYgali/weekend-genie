import { ProfileSidebar } from "@/components/ProfileSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Calendar, ThumbsUp } from "lucide-react";

const mockReviews = [
  {
    id: "1",
    destination: "Goa",
    rating: 5,
    comment: "Amazing trip! The recommendations were spot-on and we had a wonderful time.",
    date: "2024-11-15",
    helpful: 12,
  },
  {
    id: "2",
    destination: "Manali",
    rating: 4,
    comment: "Great experience overall. The hotels were nice but some activities could be better planned.",
    date: "2024-11-10",
    helpful: 8,
  },
  {
    id: "3",
    destination: "Udaipur",
    rating: 5,
    comment: "Absolutely loved the itinerary! Everything was well-organized and within budget.",
    date: "2024-11-05",
    helpful: 15,
  },
];

export default function ProfileReviews() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          <ProfileSidebar />
          
          <div className="flex-1">
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Plan Reviews
                </CardTitle>
                <CardDescription>
                  Your reviews help others plan better trips
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {mockReviews.map((review) => (
                  <Card
                    key={review.id}
                    className="border-border/30 hover:border-primary/30 transition-all hover:shadow-md"
                  >
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-5 w-5 text-primary" />
                              <h3 className="text-xl font-semibold">{review.destination}</h3>
                            </div>
                            <div className="flex items-center gap-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-5 w-5 ${
                                    i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>{review.date}</span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground">{review.comment}</p>
                        
                        <div className="flex items-center gap-4 pt-2 border-t border-border/50">
                          <Button variant="ghost" size="sm" className="gap-2">
                            <ThumbsUp className="h-4 w-4" />
                            Helpful ({review.helpful})
                          </Button>
                          <Badge variant="outline">Verified Trip</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
