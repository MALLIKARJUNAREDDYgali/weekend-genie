import { ProfileSidebar } from "@/components/ProfileSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ProfileContact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24-48 hours.",
    });
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          <ProfileSidebar />
          
          <div className="flex-1">
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Contact Support
                </CardTitle>
                <CardDescription>
                  Have questions or feedback? We're here to help!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="border-border/30 hover:border-primary/30 transition-colors">
                    <CardContent className="pt-6 text-center space-y-2">
                      <Mail className="h-8 w-8 mx-auto text-primary" />
                      <h3 className="font-semibold">Email</h3>
                      <p className="text-sm text-muted-foreground">support@tripplanner.com</p>
                    </CardContent>
                  </Card>
                  <Card className="border-border/30 hover:border-primary/30 transition-colors">
                    <CardContent className="pt-6 text-center space-y-2">
                      <Phone className="h-8 w-8 mx-auto text-primary" />
                      <h3 className="font-semibold">Phone</h3>
                      <p className="text-sm text-muted-foreground">+91 1800-123-4567</p>
                    </CardContent>
                  </Card>
                  <Card className="border-border/30 hover:border-primary/30 transition-colors">
                    <CardContent className="pt-6 text-center space-y-2">
                      <MessageSquare className="h-8 w-8 mx-auto text-primary" />
                      <h3 className="font-semibold">Live Chat</h3>
                      <p className="text-sm text-muted-foreground">Available 9 AM - 6 PM</p>
                    </CardContent>
                  </Card>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="What's this about?"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us how we can help..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
