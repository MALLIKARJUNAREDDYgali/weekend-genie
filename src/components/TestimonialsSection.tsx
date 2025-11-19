import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";
import { useState } from "react";

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Solo Traveler",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    rating: 5,
    text: "Planned my entire Goa trip under ₹5,000! The AI recommendations were spot-on and I discovered amazing local spots I wouldn't have found otherwise. Best travel app ever! 🌴",
    location: "Mumbai"
  },
  {
    id: 2,
    name: "Rahul Verma",
    role: "Weekend Explorer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
    rating: 5,
    text: "Weekend Genie made planning so easy! Got a perfect itinerary for Manali with hotels, food spots, and activities - all within my budget. Way better than spending hours researching! ⛰️",
    location: "Delhi"
  },
  {
    id: 3,
    name: "Ananya Patel",
    role: "Budget Traveler",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya",
    rating: 5,
    text: "This AI is magical! ✨ Created a detailed Jaipur itinerary in seconds. The local food recommendations were incredible and the budget breakdown helped me plan everything perfectly!",
    location: "Bangalore"
  },
  {
    id: 4,
    name: "Karan Singh",
    role: "Adventure Seeker",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karan",
    rating: 5,
    text: "Used it for 3 trips now and each time it surprises me with new hidden gems. The 'Surprise Me' feature took me to Kerala backwaters - best decision ever! 🚤",
    location: "Pune"
  }
];

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-16 px-4 bg-background">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Loved by Weekend Adventurers
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join thousands of happy travelers who've discovered their perfect weekend getaways
          </p>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          <motion.div 
            className="grid md:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, staggerChildren: 0.2 }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-card hover:shadow-magical transition-all duration-300 bg-gradient-card">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="h-14 w-14 border-2 border-primary/20">
                        <AvatarImage src={testimonial.avatar} />
                        <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        <p className="text-xs text-muted-foreground mt-1">📍 {testimonial.location}</p>
                      </div>
                      <Quote className="h-8 w-8 text-primary/20" />
                    </div>
                    
                    <div className="flex mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-sunset text-sunset" />
                      ))}
                    </div>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      {testimonial.text}
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
