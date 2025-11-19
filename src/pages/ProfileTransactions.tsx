import { ProfileSidebar } from "@/components/ProfileSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownRight, ArrowUpRight, Calendar } from "lucide-react";

const mockTransactions = [
  {
    id: "1",
    type: "debit",
    description: "Trip to Goa - Saved Plan",
    amount: "₹25,000",
    date: "2024-11-15",
    status: "completed",
  },
  {
    id: "2",
    type: "credit",
    description: "Refund - Cancelled Trip",
    amount: "₹8,500",
    date: "2024-11-10",
    status: "completed",
  },
  {
    id: "3",
    type: "debit",
    description: "Trip to Manali - Premium Plan",
    amount: "₹45,000",
    date: "2024-11-05",
    status: "pending",
  },
];

export default function ProfileTransactions() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          <ProfileSidebar />
          
          <div className="flex-1">
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Transaction History
                </CardTitle>
                <CardDescription>
                  View all your trip-related transactions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockTransactions.map((transaction) => (
                  <Card
                    key={transaction.id}
                    className="border-border/30 hover:border-primary/30 transition-all hover:shadow-md"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div
                            className={`p-2 rounded-full ${
                              transaction.type === "credit"
                                ? "bg-green-500/10"
                                : "bg-red-500/10"
                            }`}
                          >
                            {transaction.type === "credit" ? (
                              <ArrowUpRight className="h-5 w-5 text-green-500" />
                            ) : (
                              <ArrowDownRight className="h-5 w-5 text-red-500" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">
                              {transaction.description}
                            </h3>
                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>{transaction.date}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <p
                            className={`text-xl font-bold ${
                              transaction.type === "credit"
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {transaction.type === "credit" ? "+" : "-"}
                            {transaction.amount}
                          </p>
                          <Badge
                            variant={
                              transaction.status === "completed"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {transaction.status}
                          </Badge>
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
