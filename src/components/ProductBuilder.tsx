import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircuitBoard, FileText, Wrench, Presentation, Palette, TrendingUp, Loader2, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import FormattedContent from "./FormattedContent";

interface GeneratedContent {
  circuits?: string;
  cad?: string;
  build?: string;
  design?: string;
  marketing?: string;
  pitch?: string;
}

const ProductBuilder = () => {
  const [productDescription, setProductDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent>({});
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!productDescription.trim()) {
      toast({
        title: "Missing Information",
        description: "Please describe your product idea first.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedContent({});

    try {
      const { data, error } = await supabase.functions.invoke('generate-product-docs', {
        body: { description: productDescription }
      });

      if (error) throw error;

      setGeneratedContent(data);
      toast({
        title: "Success!",
        description: "Your product documentation has been generated.",
      });
    } catch (error: any) {
      console.error('Generation error:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate documentation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const tabs = [
    { id: "circuits", label: "Circuits", icon: CircuitBoard, key: "circuits" },
    { id: "cad", label: "CAD", icon: Wrench, key: "cad" },
    { id: "build", label: "Build Steps", icon: FileText, key: "build" },
    { id: "design", label: "Design", icon: Palette, key: "design" },
    { id: "marketing", label: "Marketing", icon: TrendingUp, key: "marketing" },
    { id: "pitch", label: "Pitch Deck", icon: Presentation, key: "pitch" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2 text-foreground">Product Builder</h1>
          <p className="text-muted-foreground text-lg">
            Describe your product and let AI generate comprehensive documentation
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <Card className="lg:col-span-1 p-6 h-fit sticky top-8">
            <div className="space-y-4">
              <div>
                <Label htmlFor="description" className="text-lg font-semibold">Product Description</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Describe your product idea, features, target users, and any specific requirements
                </p>
                <Textarea
                  id="description"
                  placeholder="Example: A smart garden irrigation system that uses soil moisture sensors and weather data to automatically water plants. It should be solar-powered, waterproof, and controllable via smartphone app..."
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  className="min-h-[300px] resize-none"
                  disabled={isGenerating}
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !productDescription.trim()}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Documentation"
                )}
              </Button>
            </div>
          </Card>

          {/* Output Section */}
          <Card className="lg:col-span-2 p-6">
            {Object.keys(generatedContent).length === 0 && !isGenerating ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                  <FileText className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">No Documentation Yet</h3>
                <p className="text-muted-foreground max-w-md">
                  Describe your product on the left and click "Generate Documentation" to get started
                </p>
              </div>
            ) : (
              <Tabs defaultValue="circuits" className="w-full">
                <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full mb-6">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                {tabs.map((tab) => (
                  <TabsContent key={tab.id} value={tab.id} className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <tab.icon className="w-5 h-5 text-primary" />
                      </div>
                      <h2 className="text-2xl font-bold text-foreground">{tab.label}</h2>
                    </div>
                    
                    {isGenerating ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      </div>
                    ) : generatedContent[tab.key as keyof GeneratedContent] ? (
                      <div className="bg-card/50 border border-border rounded-lg p-8">
                        <FormattedContent content={generatedContent[tab.key as keyof GeneratedContent] || ''} />
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        Content will appear here after generation
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductBuilder;