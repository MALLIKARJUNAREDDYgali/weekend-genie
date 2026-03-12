import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, Send, Sparkles, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: string;
  budget?: string;
  numberOfPeople?: string;
}

export function RatingModal({ isOpen, onClose, destination, budget, numberOfPeople }: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { user, session } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!rating || !comment.trim()) {
      toast({
        title: "Missing info",
        description: "Please select a rating and write a comment.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify({
          destination,
          rating,
          comment: comment.trim(),
          budget,
          numberOfPeople,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit review");
      }

      setSubmitted(true);
      toast({
        title: "Thank you! ✨",
        description: "Your review will help other travelers!",
      });

      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setRating(0);
        setComment("");
      }, 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to submit review",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const ratingLabels = ["", "Poor", "Fair", "Good", "Great", "Amazing!"];
  const ratingEmojis = ["", "😞", "😐", "🙂", "😊", "🤩"];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        {/* Modal Card */}
        <motion.div
          className="relative w-full max-w-md bg-card rounded-3xl shadow-2xl border border-border/60 overflow-hidden"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {/* Header gradient */}
          <div className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-orange-500/10 px-6 pt-6 pb-4">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>

            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Rate Your Trip Plan</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{destination}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6">
            {!submitted ? (
              <>
                {/* Star Rating */}
                <div className="text-center py-5">
                  <p className="text-sm text-muted-foreground mb-3">How was the generated itinerary?</p>
                  <div className="flex items-center justify-center gap-1.5 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1 transition-colors"
                      >
                        <Star
                          className={`h-9 w-9 transition-all duration-200 ${
                            star <= (hoveredRating || rating)
                              ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      </motion.button>
                    ))}
                  </div>
                  {/* Rating label */}
                  <AnimatePresence mode="wait">
                    {(hoveredRating || rating) > 0 && (
                      <motion.div
                        key={hoveredRating || rating}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="text-sm font-medium"
                      >
                        <span className="mr-1">{ratingEmojis[hoveredRating || rating]}</span>
                        <span className="text-foreground">{ratingLabels[hoveredRating || rating]}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Comment */}
                <div className="mb-5">
                  <label className="text-sm font-medium mb-2 block">Share your experience</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell other travelers what you liked about this itinerary..."
                    className="w-full h-24 rounded-xl border border-border/60 bg-muted/30 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-muted-foreground/50"
                    maxLength={500}
                  />
                  <div className="flex justify-end mt-1">
                    <span className="text-[10px] text-muted-foreground">{comment.length}/500</span>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !rating || !comment.trim()}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-primary via-blue-600 to-purple-600 text-white font-semibold text-base hover:shadow-[0_8px_25px_-5px_rgba(59,130,246,0.4)] transition-all duration-300 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                          <Sparkles className="h-4 w-4" />
                        </motion.div>
                        Submitting...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Submit Review
                      </span>
                    )}
                  </Button>
                </motion.div>

                <button
                  onClick={onClose}
                  className="w-full mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors text-center"
                >
                  Skip for now
                </button>
              </>
            ) : (
              /* Success State */
              <motion.div
                className="text-center py-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6 }}
                >
                  🎉
                </motion.div>
                <h3 className="text-xl font-bold mb-1">Thank you!</h3>
                <p className="text-sm text-muted-foreground">
                  Your review helps other travelers plan better trips.
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
