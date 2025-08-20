import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Zap, Shield, Sparkles } from "lucide-react";

const SupabaseConnectPrompt = () => {
  return (
    <Card className="w-full max-w-2xl mx-auto mt-8 bg-gradient-card shadow-magical border-2 border-primary/20">
      <CardHeader className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-hero rounded-full flex items-center justify-center shadow-glow">
          <Database className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold">Ready for the Magic? ✨</CardTitle>
        <CardDescription className="text-lg">
          Your form is working perfectly! To generate AI-powered itineraries and save your plans, connect to Supabase.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-lg bg-primary/5">
            <Database className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h3 className="font-semibold mb-1">Store Plans</h3>
            <p className="text-sm text-muted-foreground">Save user requests & generated itineraries</p>
          </div>
          
          <div className="text-center p-4 rounded-lg bg-accent/10">
            <Zap className="h-8 w-8 mx-auto mb-2 text-accent" />
            <h3 className="font-semibold mb-1">AI Generation</h3>
            <p className="text-sm text-muted-foreground">Use OpenAI to create personalized trips</p>
          </div>
          
          <div className="text-center p-4 rounded-lg bg-primary/5">
            <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h3 className="font-semibold mb-1">User Auth</h3>
            <p className="text-sm text-muted-foreground">Secure login & personal trip history</p>
          </div>
        </div>
        
        <div className="text-center p-6 bg-gradient-accent/10 rounded-lg border border-accent/20">
          <Sparkles className="h-6 w-6 mx-auto mb-2 text-accent" />
          <p className="font-medium mb-4">Click the green <strong>Supabase</strong> button in the top-right corner to connect your backend!</p>
          <p className="text-sm text-muted-foreground">Once connected, I'll implement the full AI trip planning system with database storage.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupabaseConnectPrompt;