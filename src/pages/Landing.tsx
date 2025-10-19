import { Button } from "@/components/ui/button";
import { Wallet, TrendingUp, Users, BarChart3, Shield, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: TrendingUp,
      title: "Real-Time Tracking",
      description: "Monitor your NFT royalties as they come in with live updates and detailed analytics.",
    },
    {
      icon: Users,
      title: "Royalty Splits",
      description: "Automatically distribute earnings among collaborators with customizable split configurations.",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Gain insights with comprehensive charts and reports on your earnings over time.",
    },
    {
      icon: Shield,
      title: "Secure & Trustworthy",
      description: "Built with industry-leading security standards to protect your assets and data.",
    },
    {
      icon: Zap,
      title: "Instant Payouts",
      description: "Receive your royalties instantly with automated smart contract execution.",
    },
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

      {/* Features Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              Built for Creators
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage and grow your NFT royalty income
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-card p-8 rounded-xl hover:scale-105 transition-transform duration-300 group"
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
      <footer className="border-t border-border/50 py-8 px-4 mt-20">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2024 CreatorStream. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
