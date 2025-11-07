import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CircuitBoard, FileText, Wrench, Presentation, Palette, TrendingUp, Zap, Shield, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const features = [
    {
      icon: CircuitBoard,
      title: "Circuit Diagrams",
      description: "AI-generated circuit schematics tailored to your product specifications"
    },
    {
      icon: Wrench,
      title: "CAD Instructions",
      description: "Detailed 3D modeling guidance and technical drawings"
    },
    {
      icon: FileText,
      title: "Build Instructions",
      description: "Step-by-step assembly guides with real-world considerations"
    },
    {
      icon: Palette,
      title: "Design Guidelines",
      description: "Professional design principles and aesthetic recommendations"
    },
    {
      icon: TrendingUp,
      title: "Marketing Strategy",
      description: "Go-to-market plans and promotional strategies"
    },
    {
      icon: Presentation,
      title: "Pitch Deck",
      description: "Investor-ready presentations with compelling narratives"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered Product Development</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
              Build Physical Products
              <span className="block bg-gradient-hero bg-clip-text text-transparent">
                From Idea to Reality
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Transform your product concept into comprehensive technical documentation, design specs, and marketing materials—all powered by advanced AI.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/builder">
                <Button size="lg" className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all">
                  Start Building
                  <Zap className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                View Examples
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-bold text-foreground">Everything You Need</h2>
          <p className="text-xl text-muted-foreground">Comprehensive tools for complete product development</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="p-6 hover:shadow-lg transition-all border-border bg-gradient-card">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-secondary/50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-foreground">Simple. Powerful. Fast.</h2>
              <p className="text-xl text-muted-foreground">Get professional results in three easy steps</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "1", title: "Describe", desc: "Tell us about your product idea and requirements" },
                { step: "2", title: "Generate", desc: "AI creates comprehensive technical and marketing materials" },
                { step: "3", title: "Build", desc: "Download and use your custom documentation" }
              ].map((item) => (
                <div key={item.step} className="space-y-3">
                  <div className="w-16 h-16 rounded-full bg-gradient-hero flex items-center justify-center mx-auto text-2xl font-bold text-white">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <Card className="p-12 text-center space-y-6 bg-gradient-hero border-0">
            <div className="flex items-center justify-center gap-2 text-white">
              <Shield className="w-6 h-6" />
              <span className="font-medium">Secure & Professional</span>
            </div>
            <h2 className="text-4xl font-bold text-white">Ready to Build Your Product?</h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Join engineers and makers creating amazing physical products with AI assistance.
            </p>
            <Link to="/builder">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Get Started Free
              </Button>
            </Link>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;