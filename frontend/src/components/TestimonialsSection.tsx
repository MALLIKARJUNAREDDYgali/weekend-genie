import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote, MapPin, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Static demo testimonials (shown when no user reviews exist)
const fallbackTestimonials = [
  {
    userName: "Priya Sharma",
    destination: "Goa",
    rating: 5,
    comment: "Planned my entire Goa trip under ₹5,000! The AI recommendations were spot-on and I discovered amazing local spots! 🌴",
  },
  {
    userName: "Rahul Verma",
    destination: "Manali",
    rating: 5,
    comment: "Weekend Genie made planning so easy! Got a perfect itinerary for Manali with hotels, food spots, and activities. ⛰️",
  },
  {
    userName: "Ananya & Vikram",
    destination: "Udaipur",
    rating: 5,
    comment: "This AI is magical! ✨ Created a detailed Udaipur itinerary in seconds. The local food recommendations were incredible!",
  },
  {
    userName: "Meera Singh",
    destination: "Kerala",
    rating: 5,
    comment: "Used it for 3 trips and each time it surprises me with hidden gems. The 'Surprise Me' feature is the best! 🚤",
  },
];

interface Review {
  _id?: string;
  userName: string;
  destination: string;
  rating: number;
  comment: string;
  budget?: string;
  numberOfPeople?: string;
  createdAt?: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name: string) {
  const colors = [
    "bg-blue-500", "bg-purple-500", "bg-amber-500", "bg-emerald-500",
    "bg-pink-500", "bg-indigo-500", "bg-teal-500", "bg-orange-500",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export function TestimonialsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_URL}/reviews?limit=8`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        }
      } catch (err) {
        console.log("Could not fetch reviews, using fallbacks");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Combine real reviews with fallbacks if not enough real reviews
  const displayReviews: Review[] = reviews.length >= 4
    ? reviews.slice(0, 8)
    : [...reviews, ...fallbackTestimonials.slice(0, Math.max(4 - reviews.length, 0))];

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_hsl(260_60%_50%_/_0.03)_0%,_transparent_60%)]" />

      <div className="container mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4 tracking-wide uppercase">
            <MessageSquare className="h-3.5 w-3.5" />
            Traveler Reviews
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Loved by{" "}
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Weekend Adventurers
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real reviews from travelers who planned their perfect trips with Weekend Genie
          </p>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          <motion.div
            className="grid md:grid-cols-2 gap-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
          >
            {displayReviews.map((review, index) => (
              <motion.div
                key={review._id || `fallback-${index}`}
                variants={{
                  hidden: { opacity: 0, x: index % 2 === 0 ? -20 : 20 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
                }}
              >
                <Card className="h-full border border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 bg-card/80 backdrop-blur-sm rounded-2xl group">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3.5 mb-3.5">
                      {/* Avatar */}
                      <Avatar className="h-11 w-11 border-2 border-primary/10 shrink-0">
                        <AvatarFallback className={`${getAvatarColor(review.userName)} text-white text-sm font-bold`}>
                          {getInitials(review.userName)}
                        </AvatarFallback>
                      </Avatar>

                      {/* User info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-[15px] truncate">{review.userName}</h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-0.5">
                            <MapPin className="h-3 w-3" />
                            {review.destination}
                          </span>
                          {review.createdAt && (
                            <>
                              <span>·</span>
                              <span>{timeAgo(review.createdAt)}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Quote icon */}
                      <Quote className="h-6 w-6 text-primary/10 shrink-0 group-hover:text-primary/20 transition-colors" />
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-0.5 mb-2.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < review.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      ))}
                      {review.budget && (
                        <span className="ml-2 text-[10px] font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
                          ₹{review.budget}
                        </span>
                      )}
                    </div>

                    {/* Comment */}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      "{review.comment}"
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
