import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin, Utensils, Hotel, Compass, Sparkles, Heart, Calendar, Users, Wallet,
  Star, Clock, Car, Footprints, Ticket, Timer, Eye, RefreshCw, ChevronDown,
  ChevronUp, Navigation, Map, Loader2, ExternalLink
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { ShareTripPlan } from "./ShareTripPlan";
import { RatingModal } from "./RatingModal";
import { useAuth } from "@/contexts/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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
  category?: string;
  description: string;
  rating?: number;
  reviewCount?: number;
  distanceFromHotel?: string;
  distanceFromPrevious?: string;
  travelTimeFromPrevious?: string;
  travelTime?: {
    drive?: string;
    walk?: string;
  };
  openingHours?: string;
  visitDuration?: string;
  entryFee?: string;
  address?: string;
  scheduledTime?: string;
  image_query?: string;
  nearbyAlternatives?: string[];
  // Legacy fields
  time?: string;
  duration?: string;
}

// ─── Star Rating Component ──────────────────────────────────────────
const StarRating = ({ rating, reviewCount }: { rating: number; reviewCount?: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.3;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  const formatCount = (count: number) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`;
    return count.toString();
  };

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {Array.from({ length: fullStars }, (_, i) => (
          <Star key={`f-${i}`} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
        ))}
        {hasHalf && (
          <div className="relative h-3.5 w-3.5">
            <Star className="absolute h-3.5 w-3.5 text-gray-300 dark:text-gray-600" />
            <div className="absolute overflow-hidden w-[50%]">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            </div>
          </div>
        )}
        {Array.from({ length: emptyStars }, (_, i) => (
          <Star key={`e-${i}`} className="h-3.5 w-3.5 text-gray-300 dark:text-gray-600" />
        ))}
      </div>
      <span className="text-sm font-bold text-foreground">{rating}</span>
      {reviewCount && (
        <span className="text-xs text-muted-foreground">({formatCount(reviewCount)} reviews)</span>
      )}
    </div>
  );
};

// ─── Info Pill Component ────────────────────────────────────────────
const InfoPill = ({ icon: Icon, text, color }: {
  icon: React.ElementType;
  text: string;
  color: string;
}) => (
  <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 dark:bg-muted/30 rounded-full px-3 py-1.5 border border-transparent hover:border-border/50 transition-colors">
    <Icon className={`h-3.5 w-3.5 shrink-0 ${color}`} />
    <span className="truncate">{text}</span>
  </div>
);

// ─── Activity Card Component ────────────────────────────────────────
const ActivityCard = ({
  activity, idx, destination, isSaved, isReplacing, imageUrl,
  onToggleSave, onOpenMaps, onReplace, onToggleAlternatives,
  showAlternatives, showRouteInfo,
}: {
  activity: Activity;
  idx: number;
  destination: string;
  isSaved: boolean;
  isReplacing: boolean;
  imageUrl?: string;
  onToggleSave: () => void;
  onOpenMaps: (address: string, name: string) => void;
  onReplace: () => void;
  onToggleAlternatives: () => void;
  showAlternatives: boolean;
  showRouteInfo: boolean;
}) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const isEnhanced = activity.category || activity.rating || activity.distanceFromHotel;

  // Category icon mapping
  const getCategoryEmoji = (category?: string) => {
    if (!category) return '📍';
    const c = category.toLowerCase();
    if (c.includes('nature') || c.includes('park') || c.includes('garden')) return '🌿';
    if (c.includes('histor') || c.includes('fort') || c.includes('palace')) return '🏛️';
    if (c.includes('temple') || c.includes('religious') || c.includes('spiritual')) return '🛕';
    if (c.includes('museum') || c.includes('art') || c.includes('gallery')) return '🎨';
    if (c.includes('market') || c.includes('shopping') || c.includes('bazaar')) return '🛍️';
    if (c.includes('beach') || c.includes('lake') || c.includes('water')) return '🏖️';
    if (c.includes('adventure') || c.includes('trek') || c.includes('sport')) return '🧗';
    if (c.includes('food') || c.includes('café') || c.includes('restaurant')) return '🍽️';
    if (c.includes('landmark') || c.includes('monument')) return '🗿';
    return '📍';
  };

  return (
    <div className={`group relative flex flex-col rounded-2xl border bg-card overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${isReplacing ? 'opacity-60 pointer-events-none' : 'shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)]'}`}>

      {/* ── Route Info from Previous Stop ──────────────────── */}
      {showRouteInfo && (activity.travelTimeFromPrevious || activity.distanceFromPrevious) && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50/80 dark:bg-blue-950/40 border-b border-blue-100 dark:border-blue-900/40">
          <Car className="h-3 w-3 text-blue-500" />
          <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400">
            {activity.travelTimeFromPrevious || activity.distanceFromPrevious}
          </span>
        </div>
      )}

      {/* ── Image Section (fixed 192px height) ────────────── */}
      <div className="relative w-full h-[192px] overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-slate-800 dark:via-blue-950 dark:to-indigo-950">
        {imageUrl && !imgError ? (
          <>
            {!imgLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-50 dark:from-slate-800 dark:to-blue-950">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            )}
            <img
              src={imageUrl}
              alt={activity.name}
              className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
            />
          </>
        ) : (
          <div className="relative w-full h-full">
            {/* Fallback: gradient background + category icon + place name */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-blue-100 to-indigo-200 dark:from-primary/10 dark:via-blue-950 dark:to-indigo-950" />
            <div className="relative w-full h-full flex flex-col items-center justify-center gap-2 px-4">
              <span className="text-5xl drop-shadow-md">{getCategoryEmoji(activity.category)}</span>
              <span className="text-xs text-muted-foreground font-semibold text-center bg-white/70 dark:bg-black/40 rounded-full px-3 py-1 backdrop-blur-sm">
                {activity.category || 'Attraction'}
              </span>
            </div>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Scheduled Time Badge */}
        {activity.scheduledTime && (
          <Badge className="absolute top-3 left-3 bg-white/95 dark:bg-gray-900/95 text-foreground border-0 backdrop-blur-md shadow-lg text-xs font-semibold px-3 py-1.5 rounded-full">
            <Calendar className="h-3 w-3 mr-1.5 text-primary" />
            {activity.scheduledTime}
          </Badge>
        )}

        {/* Heart save overlay */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleSave(); }}
          className="absolute top-3 right-3 p-2.5 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 transition-all duration-200 border border-white/20 shadow-lg group/heart"
          aria-label={isSaved ? "Remove from saved" : "Save activity"}
        >
          <Heart className={`h-4 w-4 transition-all duration-200 ${isSaved ? 'fill-red-500 text-red-500 scale-110' : 'text-white group-hover/heart:text-red-300'}`} />
        </button>

        {/* Title on image */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-bold text-white text-lg leading-tight drop-shadow-lg line-clamp-2">{activity.name}</h3>
          {activity.category && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-sm">{getCategoryEmoji(activity.category)}</span>
              <span className="text-xs text-white/80 font-medium">{activity.category}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Card Body ────────────────────────────────────── */}
      <div className="p-4 space-y-3">

        {/* Rating */}
        {isEnhanced && activity.rating && (
          <StarRating rating={activity.rating} reviewCount={activity.reviewCount} />
        )}

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{activity.description}</p>

        {/* Travel Info Pills */}
        {isEnhanced ? (
          <div className="flex flex-wrap gap-1.5">
            {activity.distanceFromHotel && (
              <InfoPill icon={Navigation} text={`${activity.distanceFromHotel} from hotel`} color="text-blue-500" />
            )}
            {activity.travelTime?.drive && (
              <InfoPill icon={Car} text={`${activity.travelTime.drive} drive`} color="text-orange-500" />
            )}
            {activity.openingHours && (
              <InfoPill icon={Clock} text={activity.openingHours} color="text-indigo-500" />
            )}
            {activity.entryFee && (
              <InfoPill icon={Ticket} text={activity.entryFee} color="text-emerald-500" />
            )}
            {activity.visitDuration && (
              <InfoPill icon={Timer} text={activity.visitDuration} color="text-teal-500" />
            )}
            {activity.travelTime?.walk && (
              <InfoPill icon={Footprints} text={`${activity.travelTime.walk} walk`} color="text-purple-500" />
            )}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            {activity.time && <span>🕒 {activity.time}</span>}
            {activity.duration && <span>⏱️ {activity.duration}</span>}
          </div>
        )}

        {/* Address */}
        {activity.address && (
          <p className="text-xs text-muted-foreground flex items-start gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
            <span className="line-clamp-1">{activity.address}</span>
          </p>
        )}

        {/* ── Action Buttons ─────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border/50">
          {activity.address && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8 gap-1.5 rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-200 border-border/60"
              onClick={() => onOpenMaps(activity.address!, activity.name)}
            >
              <MapPin className="h-3.5 w-3.5" />
              Maps
              <ExternalLink className="h-2.5 w-2.5 opacity-50" />
            </Button>
          )}
          <Button
            variant={isSaved ? "default" : "outline"}
            size="sm"
            className={`text-xs h-8 gap-1.5 rounded-full transition-all duration-200 ${isSaved
              ? 'bg-amber-500 hover:bg-amber-600 border-amber-500 text-white shadow-sm'
              : 'hover:bg-amber-50 hover:text-amber-600 hover:border-amber-400 dark:hover:bg-amber-950/50 dark:hover:text-amber-400 border-border/60'
              }`}
            onClick={onToggleSave}
          >
            <Star className={`h-3.5 w-3.5 ${isSaved ? 'fill-current' : ''}`} />
            {isSaved ? 'Saved' : 'Save'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-8 gap-1.5 rounded-full hover:bg-violet-50 hover:text-violet-600 hover:border-violet-400 dark:hover:bg-violet-950/50 dark:hover:text-violet-400 transition-all duration-200 border-border/60"
            onClick={onReplace}
            disabled={isReplacing}
          >
            {isReplacing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
            Replace
          </Button>
          {activity.nearbyAlternatives && activity.nearbyAlternatives.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-8 gap-1 ml-auto text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onClick={onToggleAlternatives}
            >
              <Eye className="h-3.5 w-3.5" />
              {showAlternatives ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>
          )}
        </div>

        {/* ── Nearby Alternatives ─────────────────────────── */}
        {showAlternatives && activity.nearbyAlternatives && activity.nearbyAlternatives.length > 0 && (
          <div className="p-3 bg-gradient-to-br from-blue-50/70 to-indigo-50/70 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border border-blue-200/40 dark:border-blue-800/30">
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5" />
              Other Nearby Options
            </p>
            <div className="space-y-1">
              {activity.nearbyAlternatives.map((alt, altIdx) => (
                <button
                  key={altIdx}
                  className="w-full flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-all cursor-pointer py-1.5 px-2.5 rounded-lg hover:bg-white/70 dark:hover:bg-white/5 group/alt"
                  onClick={() => onOpenMaps(destination, alt)}
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                  <span className="flex-1 text-left">{alt}</span>
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover/alt:opacity-100 transition-opacity text-blue-500" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


// ─── Main TripPlan Component ────────────────────────────────────────
const TripPlan = ({ budget, numberOfPeople, destinationPreference, surpriseMe }: TripPlanProps) => {
  const { toast } = useToast();
  const { user, session } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [tripData, setTripData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [savedActivities, setSavedActivities] = useState<Set<number>>(new Set());
  const [expandedAlternatives, setExpandedAlternatives] = useState<Set<number>>(new Set());
  const [activityImages, setActivityImages] = useState<Record<number, string>>({});
  const [replacingActivity, setReplacingActivity] = useState<number | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);

  useEffect(() => {
    const generateTripPlan = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const progressInterval = setInterval(() => {
          setLoadingProgress(prev => {
            if (prev >= 90) { clearInterval(progressInterval); return prev; }
            return prev + Math.random() * 12;
          });
        }, 300);

        const response = await fetch(`${API_URL}/generate/trip-plan`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ budget, numberOfPeople, destinationPreference, surpriseMe }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `Failed to generate trip plan: ${response.status}`);
        }

        const data = await response.json();
        clearInterval(progressInterval);
        setLoadingProgress(100);

        setTimeout(() => {
          setTripData(data);
          setIsLoading(false);
          if (data.activities) {
            data.activities.forEach((_: Activity, idx: number) => {
              loadActivityImage(data.activities[idx], idx, data.destination);
            });
          }
          toast({
            title: "✨ Trip Plan Generated!",
            description: `Your personalized itinerary for ${data.destination} is ready!`,
          });

          // Show rating modal after a short delay (only for logged-in users)
          if (user) {
            setTimeout(() => setShowRatingModal(true), 3000);
          }
        }, 400);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate trip plan');
        setIsLoading(false);
        toast({ title: "Error", description: err instanceof Error ? err.message : "Failed to generate trip plan.", variant: "destructive" });
      }
    };
    generateTripPlan();
  }, [budget, numberOfPeople, destinationPreference, surpriseMe]);

  const loadActivityImage = useCallback(async (activity: Activity, idx: number, city?: string) => {
    const placeName = activity.image_query || activity.name;
    const searchQuery = city ? `${placeName} ${city}` : placeName;

    try {
      // Fetch real place image via backend (Wikipedia/Wikimedia Commons — free, no API key)
      const response = await fetch(`${API_URL}/images/place?query=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();

      if (data.imageUrl) {
        setActivityImages(prev => ({ ...prev, [idx]: data.imageUrl }));
        return;
      }
    } catch (err) {
      console.warn('Image API failed, using fallback:', err);
    }

    // Fallback: loremflickr provides keyword-based real photos, no API key needed
    const fallbackQuery = placeName.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, ',');
    const fallbackUrl = `https://loremflickr.com/600/400/${fallbackQuery},landmark?lock=${idx}`;
    setActivityImages(prev => ({ ...prev, [idx]: fallbackUrl }));
  }, []);

  const handleSaveTrip = async () => {
    if (!user || !session) {
      toast({ title: "Sign in required", description: "Please sign in to save your trip", variant: "destructive" });
      return;
    }
    try {
      setIsSaving(true);
      const response = await fetch(`${API_URL}/trips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.token}` },
        body: JSON.stringify({ destination: tripData.destination, budget, number_of_people: numberOfPeople, trip_data: tripData }),
      });
      if (!response.ok) throw new Error('Failed to save trip');
      setIsSaved(true);
      toast({ title: "Trip saved! 💾", description: "You can view it in My Trips section" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save trip. Please try again.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReplaceActivity = async (idx: number) => {
    if (!tripData?.activities) return;
    setReplacingActivity(idx);

    try {
      const response = await fetch(`${API_URL}/generate/replace-activity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: tripData.destination,
          currentActivity: tripData.activities[idx].name,
          existingActivities: tripData.activities,
          hotelAddress: tripData.accommodations?.[0]?.address || '',
        }),
      });

      if (!response.ok) throw new Error('Failed to generate replacement');
      const newActivity = await response.json();

      // Preserve scheduled time from original
      newActivity.scheduledTime = tripData.activities[idx].scheduledTime;

      const updatedActivities = [...tripData.activities];
      updatedActivities[idx] = newActivity;
      setTripData({ ...tripData, activities: updatedActivities });
      loadActivityImage(newActivity, idx, tripData.destination);

      toast({ title: "🔄 Activity replaced!", description: `Now featuring: ${newActivity.name}` });
    } catch (err) {
      toast({ title: "Error", description: "Failed to replace activity. Please try again.", variant: "destructive" });
    } finally {
      setReplacingActivity(null);
    }
  };

  const toggleSaveActivity = (idx: number) => {
    setSavedActivities(prev => {
      const s = new Set(prev);
      if (s.has(idx)) { s.delete(idx); toast({ title: "Removed from saved" }); }
      else { s.add(idx); toast({ title: "⭐ Saved!" }); }
      return s;
    });
  };

  const toggleAlternatives = (idx: number) => {
    setExpandedAlternatives(prev => {
      const s = new Set(prev);
      s.has(idx) ? s.delete(idx) : s.add(idx);
      return s;
    });
  };

  const openGoogleMaps = (address: string, name: string) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}, ${address}`)}`, '_blank');
  };

  const openEntireTripOnMap = () => {
    if (!tripData) return;
    const stops: string[] = [];
    // Hotel
    if (tripData.accommodations?.[0]?.address) {
      stops.push(tripData.accommodations[0].address);
    }
    // Activities
    tripData.activities?.forEach((a: Activity) => {
      if (a.address) stops.push(`${a.name}, ${a.address}`);
    });
    // Build Google Maps directions URL
    if (stops.length >= 2) {
      const origin = encodeURIComponent(stops[0]);
      const destination = encodeURIComponent(stops[stops.length - 1]);
      const waypoints = stops.slice(1, -1).map(s => encodeURIComponent(s)).join('|');
      const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypoints ? `&waypoints=${waypoints}` : ''}&travelmode=driving`;
      window.open(url, '_blank');
    } else if (stops.length === 1) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stops[0])}`, '_blank');
    }
  };

  // ── Loading State ───────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-card shadow-lg border overflow-hidden">
          <CardContent className="flex flex-col items-center justify-center py-20 px-6">
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-10 w-10 text-primary animate-spin" />
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Crafting Your Adventure</h3>
            <p className="text-muted-foreground text-sm mb-6">Our AI is finding the best spots for you...</p>
            <div className="w-full max-w-sm space-y-3">
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(loadingProgress, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {loadingProgress < 25 && "🔍 Analyzing preferences..."}
                  {loadingProgress >= 25 && loadingProgress < 50 && "🏨 Finding places to stay..."}
                  {loadingProgress >= 50 && loadingProgress < 75 && "🍽️ Discovering local cuisine..."}
                  {loadingProgress >= 75 && loadingProgress < 90 && "🧭 Curating experiences..."}
                  {loadingProgress >= 90 && "✨ Finalizing your itinerary..."}
                </span>
                <span className="font-semibold tabular-nums">{Math.round(Math.min(loadingProgress, 100))}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Error State ─────────────────────────────────────────────
  if (error || !tripData) {
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

  const totalEstimate = parseInt(budget);
  const perPersonCost = Math.round(totalEstimate / parseInt(numberOfPeople));

  // ── Main Render ─────────────────────────────────────────────
  return (
    <div className="space-y-6 w-full">

      {/* ═══ Header ═══════════════════════════════════════ */}
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

      {/* ═══ Accommodations ═══════════════════════════════ */}
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
                {acc.address && <p className="text-sm text-muted-foreground">📍 {acc.address}</p>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ═══ Meals ════════════════════════════════════════ */}
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
                    <div className="font-semibold mb-1">🌅 Breakfast — {meals.breakfast.name}</div>
                    <p className="text-sm mb-1">{meals.breakfast.food}</p>
                    <p className="text-sm text-muted-foreground">📍 {meals.breakfast.address}</p>
                  </div>
                )}
                {meals.lunch && (
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="font-semibold mb-1">☀️ Lunch — {meals.lunch.name}</div>
                    <p className="text-sm mb-1">{meals.lunch.food}</p>
                    <p className="text-sm text-muted-foreground">📍 {meals.lunch.address}</p>
                  </div>
                )}
                {meals.dinner && (
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="font-semibold mb-1">🌙 Dinner — {meals.dinner.name}</div>
                    <p className="text-sm mb-1">{meals.dinner.food}</p>
                    <p className="text-sm text-muted-foreground">📍 {meals.dinner.address}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ═══ THINGS TO DO ════════════════════════════════ */}
      <Card className="shadow-lg overflow-hidden border-0 bg-gradient-to-b from-card to-card">
        <CardHeader className="border-b bg-gradient-to-r from-primary/5 via-primary/8 to-primary/5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="flex items-center gap-2.5 text-2xl">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Compass className="h-5 w-5 text-primary" />
                </div>
                Things To Do
                {tripData.activities && (
                  <Badge variant="secondary" className="text-xs font-medium ml-1">
                    {tripData.activities.length} experiences
                  </Badge>
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1.5 ml-12">
                AI-curated attractions with real-time info • Click to explore
              </p>
            </div>
            {/* View Entire Trip on Map */}
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-full h-9 px-4 bg-white dark:bg-gray-900 hover:bg-primary hover:text-primary-foreground transition-all duration-200 shadow-sm border-border/60"
              onClick={openEntireTripOnMap}
            >
              <Map className="h-4 w-4" />
              <span className="hidden sm:inline">View Entire Trip on Map</span>
              <span className="sm:hidden">Trip Map</span>
              <ExternalLink className="h-3 w-3 opacity-50" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <div className="grid gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 auto-rows-auto items-start">
            {tripData.activities?.map((activity: Activity, idx: number) => (
              <ActivityCard
                key={idx}
                activity={activity}
                idx={idx}
                destination={tripData.destination}
                isSaved={savedActivities.has(idx)}
                isReplacing={replacingActivity === idx}
                imageUrl={activityImages[idx]}
                onToggleSave={() => toggleSaveActivity(idx)}
                onOpenMaps={openGoogleMaps}
                onReplace={() => handleReplaceActivity(idx)}
                onToggleAlternatives={() => toggleAlternatives(idx)}
                showAlternatives={expandedAlternatives.has(idx)}
                showRouteInfo={idx > 0}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ═══ Local Secret ════════════════════════════════ */}
      {tripData.localSecret && (
        <Card className="shadow-lg border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="h-6 w-6 text-primary" />
              Local Secret
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-base leading-relaxed">{tripData.localSecret}</p>
          </CardContent>
        </Card>
      )}

      {/* ═══ Actions ═════════════════════════════════════ */}
      <Card className="shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              onClick={handleSaveTrip}
              disabled={isSaving || isSaved || !user}
              size="lg"
              className="gap-2 rounded-full px-6"
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

      {/* Rating Modal */}
      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        destination={tripData?.destination || ''}
        budget={budget}
        numberOfPeople={numberOfPeople}
      />
    </div>
  );
};

export default TripPlan;
