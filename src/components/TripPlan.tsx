import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Utensils, Calendar, Star, Sparkles } from "lucide-react";

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
  rating: number;
  address?: string;
}

interface Activity {
  name: string;
  time: string;
  duration: string;
  cost: string;
  description: string;
  address?: string;
}

const TripPlan = ({ budget, numberOfPeople, destinationPreference, surpriseMe }: TripPlanProps) => {
  const getDestinationData = (destination: string) => {
    const dest = destination.toLowerCase();
    
    if (dest.includes('bangalore') || dest.includes('bengaluru')) {
      return {
        destination: "Bangalore",
        summary: "Explore the Garden City with its vibrant tech culture, beautiful parks, historic palaces, and amazing food scene!",
        accommodation: [
          { name: "The Oberoi Bangalore", type: "Luxury Hotel", cost: "₹8,000/night", rating: 4.8, address: "37-39, Mahatma Gandhi Road, Bangalore 560001" },
          { name: "Zostel Bangalore", type: "Hostel", cost: "₹600/night", rating: 4.3, address: "697, 12th Main Road, Indiranagar, Bangalore 560038" }
        ],
        meals: {
          day1: {
            breakfast: "MTR - Authentic South Indian (₹250) - Lalbagh Road, Mavalli",
            lunch: "Vidyarthi Bhavan - Famous Dosa (₹150) - Gandhi Bazaar, Basavanagudi",
            dinner: "Toit - Craft Beer & Wood Fired Pizza (₹800) - 298, 100 Feet Road, Indiranagar"
          },
          day2: {
            breakfast: "Airlines Hotel - Benne Dosa (₹200) - Lavelle Road, Bangalore",
            lunch: "Nagarjuna - Andhra Meals (₹350) - Residency Road, Bangalore",
            dinner: "Truffles - American Diner (₹600) - St. Marks Road, Bangalore"
          }
        },
        activities: [
          {
            name: "Lalbagh Botanical Garden",
            time: "Day 1, 9:00 AM - 12:00 PM",
            duration: "3 hours",
            cost: "₹50",
            description: "Explore 240 acres of stunning gardens and the famous Glass House",
            address: "Mavalli, Bangalore 560004"
          },
          {
            name: "Bangalore Palace",
            time: "Day 1, 2:00 PM - 5:00 PM",
            duration: "3 hours",
            cost: "₹500",
            description: "Tudor-style palace with opulent interiors and beautiful architecture",
            address: "Vasanth Nagar, Bangalore 560052"
          },
          {
            name: "Cubbon Park & Government Museum",
            time: "Day 2, 10:00 AM - 1:00 PM",
            duration: "3 hours",
            cost: "₹200",
            description: "Visit Government Museum and stroll through Cubbon Park",
            address: "Kasturba Road, Ambedkar Veedhi, Bangalore 560001"
          },
          {
            name: "MG Road Shopping & Commercial Street",
            time: "Day 2, 6:00 PM - 10:00 PM",
            duration: "4 hours",
            cost: "₹1,000",
            description: "Shop at commercial street and experience Bangalore's nightlife",
            address: "Mahatma Gandhi Road & Commercial Street, Bangalore"
          }
        ],
        optional_tip: "🌟 Hidden Gem: Visit Nandi Hills (Chikkaballapur District, 60km from Bangalore) at sunrise for breathtaking views and paragliding!"
      };
    }
    
    if (dest.includes('hyderabad')) {
      return {
        destination: "Hyderabad",
        summary: "Experience the City of Pearls with its rich Nizami heritage, iconic monuments, and legendary biryani!",
        accommodation: [
          { name: "Taj Falaknuma Palace", type: "Heritage Hotel", cost: "₹15,000/night", rating: 4.9, address: "Engine Bowli, Falaknuma, Hyderabad 500053" },
          { name: "Backpacker Panda", type: "Hostel", cost: "₹500/night", rating: 4.2, address: "Road No. 12, Banjara Hills, Hyderabad 500034" }
        ],
        meals: {
          day1: {
            breakfast: "Ram Ki Bandi - Authentic Irani Chai (₹100) - Beside NMDC, Masab Tank",
            lunch: "Paradise Biryani - Hyderabadi Biryani (₹400) - SD Road, Secunderabad",
            dinner: "Jewel of Nizam - Royal Nizami Cuisine (₹1,200) - Golconda Road, Hyderabad"
          },
          day2: {
            breakfast: "Shadab - Haleem & Paya (₹250) - High Court Road, Old City",
            lunch: "Shah Ghouse - Biryani & Kebabs (₹500) - Tolichowki, Hyderabad",
            dinner: "Ohri's - Multi-cuisine (₹800) - Road No. 1, Banjara Hills"
          }
        },
        activities: [
          {
            name: "Charminar & Laad Bazaar",
            time: "Day 1, 9:00 AM - 1:00 PM",
            duration: "4 hours",
            cost: "₹200",
            description: "Explore the iconic monument and shop for bangles and pearls",
            address: "Charminar Road, Old City, Hyderabad 500002"
          },
          {
            name: "Golconda Fort",
            time: "Day 1, 4:00 PM - 8:00 PM",
            duration: "4 hours",
            cost: "₹300",
            description: "Tour the historic fort and watch the spectacular sound & light show",
            address: "Khair Complex, Ibrahim Bagh, Hyderabad 500008"
          },
          {
            name: "Hussain Sagar Lake & Buddha Statue",
            time: "Day 2, 9:00 AM - 12:00 PM",
            duration: "3 hours",
            cost: "₹150",
            description: "Boating to Buddha statue and Tank Bund walk",
            address: "Tank Bund Road, Hyderabad 500003"
          },
          {
            name: "Ramoji Film City",
            time: "Day 2, 2:00 PM - 7:00 PM",
            duration: "5 hours",
            cost: "₹1,500",
            description: "World's largest film studio with live shows and movie sets",
            address: "Anaspur Village, Hayathnagar Mandal, Hyderabad 501512"
          }
        ],
        optional_tip: "🌟 Hidden Gem: Visit Durgam Cheruvu (Secret Lake, Jubilee Hills) for kayaking and lakeside cafes away from tourist crowds!"
      };
    }
    
    if (dest.includes('chennai')) {
      return {
        destination: "Chennai",
        summary: "Discover the cultural capital of South India with beautiful beaches, ancient temples, and delicious cuisine!",
        accommodation: [
          { name: "Taj Coromandel", type: "Luxury Hotel", cost: "₹7,000/night", rating: 4.7, address: "37, Mahatma Gandhi Road, Nungambakkam, Chennai 600034" },
          { name: "Moustache Hostel", type: "Beach Hostel", cost: "₹700/night", rating: 4.4, address: "1st Avenue, Besant Nagar, Chennai 600090" }
        ],
        meals: {
          day1: {
            breakfast: "Murugan Idli Shop - Soft Idlis (₹150) - GN Chetty Road, T Nagar",
            lunch: "Saravana Bhavan - Traditional Meals (₹250) - KK Nagar, Chennai",
            dinner: "Bay 146 - Seafood Specialties (₹1,000) - East Coast Road, Neelankarai"
          },
          day2: {
            breakfast: "Ratna Cafe - Filter Coffee & Vada (₹100) - Triplicane High Road",
            lunch: "Sangeetha - Pure Veg Meals (₹200) - Nungambakkam High Road",
            dinner: "Promenade - Rooftop Fine Dining (₹1,500) - Cathedral Road, Chennai"
          }
        },
        activities: [
          {
            name: "Marina Beach",
            time: "Day 1, 6:00 AM - 9:00 AM",
            duration: "3 hours",
            cost: "Free",
            description: "World's second-longest urban beach with sunrise views",
            address: "Marina Beach, Kamaraj Salai, Chennai 600004"
          },
          {
            name: "Kapaleeshwarar Temple",
            time: "Day 1, 10:00 AM - 2:00 PM",
            duration: "4 hours",
            cost: "₹100",
            description: "Ancient Dravidian temple and Mylapore neighborhood exploration",
            address: "Kutchery Road, Mylapore, Chennai 600004"
          },
          {
            name: "Fort St. George & Museum",
            time: "Day 2, 9:00 AM - 12:00 PM",
            duration: "3 hours",
            cost: "₹200",
            description: "First British fortress in India with colonial artifacts",
            address: "Rajaji Salai, Fort St. George, Chennai 600009"
          },
          {
            name: "Mahabalipuram Shore Temple",
            time: "Day 2, 2:00 PM - 8:00 PM",
            duration: "6 hours",
            cost: "₹1,000",
            description: "UNESCO World Heritage rock-cut temples via scenic ECR drive",
            address: "East Coast Road, Mahabalipuram 603104 (55 km from Chennai)"
          }
        ],
        optional_tip: "🌟 Hidden Gem: Visit Dakshinachitra (Muttukadu, ECR) - a cultural heritage museum showcasing South Indian traditional homes and crafts!"
      };
    }
    
    // Default for other destinations
    return {
      destination: surpriseMe ? "Goa" : (destinationPreference || "Rishikesh"),
      summary: `An adventure-packed weekend in ${destinationPreference || "Rishikesh"} with nature, culture, and unforgettable experiences!`,
      accommodation: [
        { name: "Heritage Resort", type: "Resort", cost: "₹2,000/night", rating: 4.3, address: "Main City Center" },
        { name: "Budget Inn", type: "Hotel", cost: "₹800/night", rating: 4.0, address: "Near Railway Station" }
      ],
      meals: {
        day1: {
          breakfast: "Local Café - Regional Breakfast (₹200) - City Center",
          lunch: "Popular Restaurant - Local Cuisine (₹400) - Market Area",
          dinner: "Night Market - Street Food (₹300) - Old Town"
        },
        day2: {
          breakfast: "Hotel Buffet - Continental (₹250) - Hotel Restaurant",
          lunch: "Traditional Restaurant - Regional Thali (₹350) - Main Road",
          dinner: "Rooftop Café - Multi-cuisine (₹450) - City View Area"
        }
      },
      activities: [
        {
          name: "Local Sightseeing Tour",
          time: "Day 1, 9:00 AM - 1:00 PM",
          duration: "4 hours",
          cost: "₹800",
          description: "Explore major attractions and landmarks",
          address: "City Center and Main Attractions"
        },
        {
          name: "Cultural Experience",
          time: "Day 1, 3:00 PM - 6:00 PM",
          duration: "3 hours",
          cost: "₹600",
          description: "Visit museums, markets, and cultural sites",
          address: "Old Town Cultural District"
        },
        {
          name: "Adventure Activity",
          time: "Day 2, 9:00 AM - 1:00 PM",
          duration: "4 hours",
          cost: "₹1,200",
          description: "Outdoor activities and adventure sports",
          address: "Adventure Sports Center"
        },
        {
          name: "Shopping & Leisure",
          time: "Day 2, 3:00 PM - 7:00 PM",
          duration: "4 hours",
          cost: "₹500",
          description: "Local shopping and relaxation",
          address: "Main Shopping District"
        }
      ],
      optional_tip: `🌟 Hidden Gem: Explore off-the-beaten-path local spots for an authentic ${destinationPreference} experience!`
    };
  };

  const samplePlan = getDestinationData(destinationPreference || "");

  const totalEstimate = parseInt(budget);
  const perPersonCost = Math.floor(totalEstimate / parseInt(numberOfPeople));

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <Card className="bg-gradient-hero text-white border-0 shadow-magical transition-smooth hover:shadow-glow">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <MapPin className="h-6 w-6" />
            <CardTitle className="text-3xl font-bold">{samplePlan.destination}</CardTitle>
          </div>
          <CardDescription className="text-white/90 text-lg">
            {samplePlan.summary}
          </CardDescription>
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              ₹{budget} Total Budget
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              ₹{perPersonCost} per person
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              {numberOfPeople} People
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Where to Stay */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Bed className="h-6 w-6 text-ocean" />
          Where to Stay
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 hover:shadow-glow transition-smooth hover:scale-[1.02] animate-scale-in border-ocean/20 hover:border-ocean">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-semibold">{samplePlan.accommodation[0].name}</h3>
              <div className="flex items-center gap-1 text-sunset">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm font-medium">{samplePlan.accommodation[0].rating}</span>
              </div>
            </div>
            <Badge variant="secondary" className="mb-3">{samplePlan.accommodation[0].type}</Badge>
            <p className="text-lg font-bold text-ocean mb-2">{samplePlan.accommodation[0].cost}</p>
            {samplePlan.accommodation[0].address && (
              <p className="text-sm text-muted-foreground flex items-start gap-1">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                {samplePlan.accommodation[0].address}
              </p>
            )}
          </Card>

          <Card className="p-6 hover:shadow-glow transition-smooth hover:scale-[1.02] animate-scale-in border-sunset/20 hover:border-sunset">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-semibold">{samplePlan.accommodation[1].name}</h3>
              <div className="flex items-center gap-1 text-sunset">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm font-medium">{samplePlan.accommodation[1].rating}</span>
              </div>
            </div>
            <Badge variant="secondary" className="mb-3">{samplePlan.accommodation[1].type}</Badge>
            <p className="text-lg font-bold text-sunset mb-2">{samplePlan.accommodation[1].cost}</p>
            {samplePlan.accommodation[1].address && (
              <p className="text-sm text-muted-foreground flex items-start gap-1">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                {samplePlan.accommodation[1].address}
              </p>
            )}
          </Card>
        </div>
      </div>

      {/* What to Eat */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Utensils className="h-6 w-6 text-forest" />
          What to Eat
        </h2>
        <Card className="p-6 space-y-4 hover:shadow-glow transition-smooth hover:scale-[1.02] animate-scale-in border-forest/20 hover:border-forest">
          {/* Day 1 Meals */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-5 w-5 text-forest" />
              <h3 className="text-xl font-semibold">Day 1</h3>
            </div>
            <div className="space-y-2 ml-7">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">Breakfast</Badge>
                <p className="flex-1">{samplePlan.meals.day1.breakfast}</p>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">Lunch</Badge>
                <p className="flex-1">{samplePlan.meals.day1.lunch}</p>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">Dinner</Badge>
                <p className="flex-1">{samplePlan.meals.day1.dinner}</p>
              </div>
            </div>
          </div>

          {/* Day 2 Meals */}
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-5 w-5 text-forest" />
              <h3 className="text-xl font-semibold">Day 2</h3>
            </div>
            <div className="space-y-2 ml-7">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">Breakfast</Badge>
                <p className="flex-1">{samplePlan.meals.day2.breakfast}</p>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">Lunch</Badge>
                <p className="flex-1">{samplePlan.meals.day2.lunch}</p>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">Dinner</Badge>
                <p className="flex-1">{samplePlan.meals.day2.dinner}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Activities */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-mountain" />
          Activities & Things to Do
        </h2>
        <Card className="p-6 space-y-4 hover:shadow-glow transition-smooth hover:scale-[1.02] animate-scale-in border-mountain/20 hover:border-mountain">
          {samplePlan.activities.map((activity, index) => (
            <div key={index} className="pb-4 last:pb-0 border-b last:border-0">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{activity.name}</h3>
                <Badge variant="secondary" className="bg-mountain/10 text-mountain border-mountain/20">{activity.cost}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
              {activity.address && (
                <p className="text-sm text-muted-foreground mb-2 flex items-start gap-1">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-mountain" />
                  {activity.address}
                </p>
              )}
              <div className="flex gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-mountain" />
                  {activity.time}
                </span>
                <span className="text-muted-foreground">Duration: {activity.duration}</span>
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Hidden Gem Tip */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Star className="h-6 w-6 text-sunset fill-current" />
          Local Secret
        </h2>
        <Card className="p-6 bg-gradient-sunset/20 border-sunset/30 hover:shadow-glow transition-smooth hover:scale-[1.02] animate-scale-in hover:border-sunset">
          <p className="text-lg leading-relaxed">{samplePlan.optional_tip}</p>
        </Card>
      </div>
    </div>
  );
};

export default TripPlan;
