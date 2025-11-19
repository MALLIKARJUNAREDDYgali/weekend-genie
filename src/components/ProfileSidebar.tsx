import { Card, CardContent } from "@/components/ui/card";
import { Users, FileText, Mail, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Users, label: "My Trips", path: "/my-trips" },
  { icon: FileText, label: "Transaction History", path: "/profile/transactions" },
  { icon: Mail, label: "Plan Reviews", path: "/profile/reviews" },
  { icon: Settings, label: "Contact", path: "/profile/contact" },
];

export function ProfileSidebar() {
  const location = useLocation();

  return (
    <Card className="lg:w-64 border-border/50 shadow-lg h-fit sticky top-24">
      <CardContent className="p-4">
        <nav className="space-y-2">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                    "hover:bg-accent/50 hover:shadow-sm",
                    isActive && "bg-primary/10 text-primary border-l-4 border-primary"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </CardContent>
    </Card>
  );
}
