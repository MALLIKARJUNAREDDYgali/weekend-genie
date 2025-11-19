import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, IndianRupee, Sparkles } from "lucide-react";

const recommendations = [
  {
    id: 1,
    destination: "Goa Beaches",
    category: "Beach Paradise",
    estimatedCost: "₹5,000 - ₹8,000",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
    tag: "Best under ₹10,000",
    tagColor: "bg-ocean"
  },
  {
    id: 2,
    destination: "Manali Mountains",
    category: "Mountain Escape",
    estimatedCost: "₹8,000 - ₹12,000",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    tag: "Adventure Special",
    tagColor: "bg-mountain"
  },
  {
    id: 3,
    destination: "Jaipur Heritage",
    category: "Cultural Journey",
    estimatedCost: "₹6,000 - ₹9,000",
    image: "https://images.unsplash.com/photo-1477586957327-847a0f3f4fe3?w=800&q=80",
    tag: "Budget Friendly",
    tagColor: "bg-sunset"
  },
  {
    id: 4,
    destination: "Kerala Backwaters",
    category: "Nature Retreat",
    estimatedCost: "₹7,000 - ₹10,000",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80",
    tag: "Relaxation Haven",
    tagColor: "bg-forest"
  }
];

export function RecommendationsSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="py-16 px-4 bg-gradient-subtle">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Popular Weekend Destinations
            </h2>
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Handpicked destinations perfect for your budget and interests
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {recommendations.map((rec) => (
            <motion.div key={rec.id} variants={cardVariants}>
              <Card className="group cursor-pointer overflow-hidden border-0 shadow-card hover:shadow-magical transition-all duration-300 h-full">
                <div className="relative h-48 overflow-hidden">
                  <motion.img
                    src={rec.image}
                    alt={rec.destination}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <Badge 
                    className={`absolute top-3 right-3 ${rec.tagColor} text-white border-0 shadow-lg`}
                  >
                    {rec.tag}
                  </Badge>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-bold text-xl mb-1">{rec.destination}</h3>
                    <p className="text-white/90 text-sm">{rec.category}</p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <IndianRupee className="h-4 w-4" />
                      <span className="text-sm font-medium">{rec.estimatedCost}</span>
                    </div>
                    <div className="flex items-center gap-1 text-primary">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm font-medium">Explore</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
