import { Share2, Download, Copy, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ShareTripPlanProps {
  tripData: any;
}

export function ShareTripPlan({ tripData }: ShareTripPlanProps) {
  const { toast } = useToast();

  const handleCopyLink = () => {
    const tripText = `🌟 Check out my ${tripData.destination} weekend trip plan!\n\n` +
      `Budget: ${tripData.budget ? `₹${tripData.budget}` : 'TBD'}\n` +
      `${tripData.summary || ''}\n\n` +
      `Planned with Weekend Genie ✨`;
    
    navigator.clipboard.writeText(tripText);
    toast({
      title: "Copied to clipboard! 📋",
      description: "Share your trip plan with friends",
    });
  };

  const handleWhatsAppShare = () => {
    const tripText = `🌟 Check out my ${tripData.destination} weekend trip plan!\n\n` +
      `Budget: ${tripData.budget ? `₹${tripData.budget}` : 'TBD'}\n` +
      `${tripData.summary || ''}\n\n` +
      `Planned with Weekend Genie ✨\n${window.location.href}`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(tripText)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleDownloadPDF = () => {
    toast({
      title: "PDF Download Coming Soon! 📄",
      description: "We're working on this feature. Stay tuned!",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex flex-wrap gap-3 justify-center"
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="transition-bounce hover:scale-105 active:scale-95 hover:shadow-glow"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Trip
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleWhatsAppShare} className="cursor-pointer">
            <MessageCircle className="h-4 w-4 mr-2 text-green-600" />
            Share on WhatsApp
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
            <Copy className="h-4 w-4 mr-2" />
            Copy Link
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="outline"
        onClick={handleDownloadPDF}
        className="transition-bounce hover:scale-105 active:scale-95 hover:shadow-glow"
      >
        <Download className="h-4 w-4 mr-2" />
        Download PDF
      </Button>
    </motion.div>
  );
}
