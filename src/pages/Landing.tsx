import { Button } from "@/components/ui/button";
import { Wallet, TrendingUp, Users, BarChart3, Shield, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Zap,
      title: "Automatic Royalty Distribution",
      description: "Smart contracts automatically distribute royalties to all collaborators based on pre-set splits. No manual transfers, no delays.",
    },
    {
      icon: Users,
      title: "Collaborator Management",
      description: "Easily add, remove, or adjust collaborator splits. Manage team permissions and view individual earnings in real-time.",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Comprehensive charts and insights showing earnings over time, top-performing collections, and detailed transaction history.",
    },
    {
      icon: Wallet,
      title: "Marketplace Integration",
      description: "Seamlessly connect with major NFT marketplaces. Track royalties from OpenSea, Rarible, and other platforms in one place.",
    },
  ];

  const benefits = [
    {
      title: "Complete Transparency",
      description: "Every transaction is recorded on-chain. View detailed breakdowns of all earnings and splits in real-time.",
    },
    {
      title: "Save Time",
      description: "Eliminate hours of manual tracking and payment distribution. Focus on creating while we handle the finances.",
    },
    {
      title: "Never Miss a Royalty",
      description: "Automated tracking ensures you capture every royalty payment across all connected marketplaces.",
    },
  ];

  const partners = [
    { name: "Flow", logo: "flow" },
    { name: "Dapper", logo: "dapper" },
    { name: "Disney", logo: "disney" },
    { name: "NBA", logo: "nba" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
        
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <div className="animate-fade-in">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 gradient-text animate-gradient-shift bg-300%">
              CreatorStream
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Automate and track your NFT royalties with the most advanced creator platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                variant="gradient"
                onClick={() => navigate('/dashboard')}
                className="group"
              >
                <Wallet className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                Connect Wallet
              </Button>
              <Button size="lg" variant="glass">
                Learn More
              </Button>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="glass-card p-6 rounded-lg animate-fade-in">
              <div className="text-3xl font-bold gradient-text">$2.4M+</div>
              <div className="text-sm text-muted-foreground mt-1">Total Royalties Tracked</div>
            </div>
            <div className="glass-card p-6 rounded-lg animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-3xl font-bold gradient-text">15K+</div>
              <div className="text-sm text-muted-foreground mt-1">Active Creators</div>
            </div>
            <div className="glass-card p-6 rounded-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-3xl font-bold gradient-text">50K+</div>
              <div className="text-sm text-muted-foreground mt-1">NFT Collections</div>
            </div>
            <div className="glass-card p-6 rounded-lg animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-3xl font-bold gradient-text">99.9%</div>
              <div className="text-sm text-muted-foreground mt-1">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works / Features Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage and grow your NFT royalty income
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-card p-8 rounded-xl hover:scale-105 transition-transform duration-300 group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-primary/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              Why Creators Choose CreatorStream
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built by creators, for creators
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="glass-card p-8 rounded-xl text-center group hover:scale-105 transition-transform duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className="text-2xl font-bold mb-4 gradient-text">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-4">Trusted By Industry Leaders</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12 max-w-4xl mx-auto opacity-60">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="text-2xl font-bold text-muted-foreground hover:text-foreground transition-colors"
              >
                {partner.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="glass-card p-12 rounded-2xl text-center max-w-3xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 gradient-primary opacity-10" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to take control of your royalties?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of creators already using CreatorStream
              </p>
              <Button 
                size="lg" 
                variant="gradient"
                onClick={() => navigate('/dashboard')}
                className="group"
              >
                <Wallet className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                Get Started Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-4 mt-20">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4 gradient-text">CreatorStream</h3>
              <p className="text-sm text-muted-foreground">
                Automate and track your NFT royalties with ease.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Roadmap</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#about" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#docs" className="hover:text-foreground transition-colors">Docs</a></li>
                <li><a href="#contact" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 CreatorStream. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
