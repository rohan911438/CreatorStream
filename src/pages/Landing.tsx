import { Button } from "@/components/ui/button";
import { Wallet, Users, BarChart3, Shield, Zap, Sparkles, Lock, Clock, Gift, Rocket, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { login, logout, subscribeToAuth } from "@/lib/dapper-wallet";
import type { CurrentUser } from "@onflow/fcl";
import { toast } from "sonner";

const Landing = () => {
	const navigate = useNavigate();
	const [user, setUser] = useState<CurrentUser | null>(null);
	const [isConnecting, setIsConnecting] = useState(false);

	useEffect(() => {
		const unsubscribe = subscribeToAuth((currentUser) => {
			setUser(currentUser);
		});
		return () => unsubscribe();
	}, []);

	const handleConnectWallet = async () => {
		setIsConnecting(true);
		try {
			await login();
			toast.success("Dapper Wallet connected successfully!");
		} catch (error) {
			toast.error("Failed to connect wallet. Please try again.");
			console.error(error);
		} finally {
			setIsConnecting(false);
		}
	};

	const handleDisconnect = async () => {
		try {
			await logout();
			toast.success("Wallet disconnected");
		} catch (error) {
			toast.error("Failed to disconnect");
			console.error(error);
		}
	};

	const features = [
		{
			icon: Zap,
			title: "Automatic Royalty Distribution",
			description: "Smart contracts automatically distribute royalties to all collaborators based on pre-set splits. No manual transfers, no delays.",
			color: "from-yellow-500 to-orange-500",
		},
		{
			icon: Users,
			title: "Collaborator Management",
			description: "Easily add, remove, or adjust collaborator splits. Manage team permissions and view individual earnings in real-time.",
			color: "from-blue-500 to-cyan-500",
		},
		{
			icon: BarChart3,
			title: "Analytics Dashboard",
			description: "Comprehensive charts and insights showing earnings over time, top-performing collections, and detailed transaction history.",
			color: "from-purple-500 to-pink-500",
		},
		{
			icon: Shield,
			title: "Secure & Trustless",
			description: "Built on Flow blockchain with military-grade security. Your funds are always safe and transactions are transparent.",
			color: "from-green-500 to-emerald-500",
		},
		{
			icon: Clock,
			title: "Real-Time Tracking",
			description: "Monitor your royalties as they come in. Get instant notifications for every transaction.",
			color: "from-red-500 to-rose-500",
		},
		{
			icon: Gift,
			title: "Multi-Marketplace Support",
			description: "Track royalties from NBA Top Shot, NFL All Day, and other Flow marketplaces all in one place.",
			color: "from-indigo-500 to-violet-500",
		},
	];

	const benefits = [
		{
			icon: Sparkles,
			title: "Complete Transparency",
			description: "Every transaction is recorded on-chain. View detailed breakdowns of all earnings and splits in real-time.",
		},
		{
			icon: Rocket,
			title: "Save Time",
			description: "Eliminate hours of manual tracking and payment distribution. Focus on creating while we handle the finances.",
		},
		{
			icon: Lock,
			title: "Never Miss a Royalty",
			description: "Automated tracking ensures you capture every royalty payment across all connected marketplaces.",
		},
	];

	const partners = [
		{ name: "Flow", logo: "🌊" },
		{ name: "Dapper", logo: "💎" },
		{ name: "NBA Top Shot", logo: "🏀" },
		{ name: "NFL All Day", logo: "🏈" },
	];

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: {
				duration: 0.5,
			},
		},
	};

	return (
		<div className="min-h-screen bg-background">
			{/* Hero Section */}
			<section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
				{/* Animated background elements */}
				<div className="absolute inset-0 overflow-hidden">
					<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
					<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
					<div className="absolute top-1/2 left-1/2 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
				</div>
        
				<div className="relative z-10 container mx-auto px-4 py-20">
					<motion.div 
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className="text-center"
					>
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{ duration: 0.5, delay: 0.2 }}
							className="inline-block mb-4"
						>
							<span className="px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold backdrop-blur-sm">
								⚡ Powered by Flow & Dapper Wallet
							</span>
						</motion.div>
            
						<h1 className="text-6xl md:text-7xl lg:text-9xl font-bold mb-6 gradient-text animate-gradient-shift bg-300% tracking-tight">
							CreatorStream
						</h1>
            
						<motion.p 
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.4 }}
							className="text-xl md:text-3xl text-muted-foreground mb-12 max-w-3xl mx-auto font-light"
						>
							Automate and track your NFT royalties on Flow blockchain
							<br />
							<span className="text-2xl md:text-xl gradient-text font-semibold">The most advanced creator platform for Web3</span>
						</motion.p>
            
						<motion.div 
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.6 }}
							className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
						>
							{user?.loggedIn ? (
								<>
									<Button 
										size="lg" 
										variant="gradient"
										onClick={() => navigate('/dashboard')}
										className="group text-lg px-8 py-6 h-auto"
									>
										<BarChart3 className="mr-2 h-6 w-6 group-hover:scale-110 transition-transform" />
										Go to Dashboard
									</Button>
									<Button 
										size="lg" 
										variant="outline"
										onClick={handleDisconnect}
										className="text-lg px-8 py-6 h-auto"
									>
										Disconnect ({user.addr?.slice(0, 6)}...{user.addr?.slice(-4)})
									</Button>
								</>
							) : (
								<>
									<Button 
										size="lg" 
										variant="gradient"
										onClick={handleConnectWallet}
										disabled={isConnecting}
										className="group text-lg px-8 py-6 h-auto shadow-2xl shadow-primary/50"
									>
										<Wallet className="mr-2 h-6 w-6 group-hover:rotate-12 transition-transform" />
										{isConnecting ? "Connecting..." : "Connect Dapper Wallet"}
									</Button>
									<Button 
										size="lg" 
										variant="glass"
										className="text-lg px-8 py-6 h-auto"
										onClick={() => {
											const featuresSection = document.getElementById('features');
											featuresSection?.scrollIntoView({ behavior: 'smooth' });
										}}
									>
										<Sparkles className="mr-2 h-5 w-5" />
										Explore Features
									</Button>
								</>
							)}
						</motion.div>
            
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.8 }}
							className="flex items-center justify-center gap-4 text-sm text-muted-foreground flex-wrap"
						>
							<div className="flex items-center gap-2">
								<Shield className="h-4 w-4 text-green-500" />
								Secure on Flow
							</div>
							<div className="w-1 h-1 rounded-full bg-muted-foreground" />
							<div className="flex items-center gap-2">
								<Star className="h-4 w-4 text-yellow-500" />
								Trusted by 15K+ creators
							</div>
							<div className="w-1 h-1 rounded-full bg-muted-foreground" />
							<div className="flex items-center gap-2">
								<Zap className="h-4 w-4 text-blue-500" />
								Instant payments
							</div>
						</motion.div>
					</motion.div>

					<motion.div 
						variants={containerVariants}
						initial="hidden"
						animate="visible"
						className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto"
					>
						<motion.div variants={itemVariants} className="glass-card p-8 rounded-2xl hover:scale-105 transition-transform duration-300 border-2 border-primary/20">
							<div className="text-4xl font-bold gradient-text mb-2">$2.4M+</div>
							<div className="text-sm text-muted-foreground mt-1">Total Royalties Tracked</div>
						</motion.div>
						<motion.div variants={itemVariants} className="glass-card p-8 rounded-2xl hover:scale-105 transition-transform duration-300 border-2 border-secondary/20">
							<div className="text-4xl font-bold gradient-text mb-2">15K+</div>
							<div className="text-sm text-muted-foreground mt-1">Active Creators</div>
						</motion.div>
						<motion.div variants={itemVariants} className="glass-card p-8 rounded-2xl hover:scale-105 transition-transform duration-300 border-2 border-accent/20">
							<div className="text-4xl font-bold gradient-text mb-2">50K+</div>
							<div className="text-sm text-muted-foreground mt-1">NFT Collections</div>
						</motion.div>
						<motion.div variants={itemVariants} className="glass-card p-8 rounded-2xl hover:scale-105 transition-transform duration-300 border-2 border-primary/20">
							<div className="text-4xl font-bold gradient-text mb-2">99.9%</div>
							<div className="text-sm text-muted-foreground mt-1">Uptime</div>
						</motion.div>
					</motion.div>
				</div>
			</section>

			{/* Features Section */}
			<section id="features" className="py-20 px-4 relative">
				<div className="container mx-auto">
					<motion.div 
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="text-center mb-16"
					>
						<h2 className="text-5xl md:text-6xl font-bold mb-4 gradient-text">
							Powerful Features
						</h2>
						<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
							Everything you need to manage and grow your NFT royalty income
						</p>
					</motion.div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
						{features.map((feature, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								className="glass-card p-8 rounded-2xl hover:scale-105 transition-all duration-300 group relative overflow-hidden"
							>
								<div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
								<div className={`bg-gradient-to-br ${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
									<feature.icon className="h-7 w-7 text-white" />
								</div>
								<h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
								<p className="text-muted-foreground leading-relaxed">{feature.description}</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Benefits Section */}
			<section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
				<div className="container mx-auto">
					<motion.div 
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="text-center mb-16"
					>
						<h2 className="text-5xl md:text-6xl font-bold mb-4 gradient-text">
							Why Creators Choose Us
						</h2>
						<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
							Built by creators, for creators
						</p>
					</motion.div>

					<div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
						{benefits.map((benefit, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, scale: 0.9 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								className="glass-card p-10 rounded-2xl text-center group hover:scale-105 transition-all duration-300 relative overflow-hidden"
							>
								<div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
								<div className="relative z-10">
									<div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
										<benefit.icon className="h-8 w-8 text-primary" />
									</div>
									<h3 className="text-2xl font-bold mb-4 gradient-text">{benefit.title}</h3>
									<p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Partners Section */}
			<section className="py-20 px-4">
				<div className="container mx-auto">
					<motion.div 
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="text-center mb-12"
					>
						<p className="text-sm text-muted-foreground uppercase tracking-wider mb-4">Powered by Industry Leaders</p>
					</motion.div>
					<motion.div 
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="flex flex-wrap justify-center items-center gap-12 max-w-4xl mx-auto"
					>
						{partners.map((partner, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, scale: 0.8 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: index * 0.1 }}
								className="flex items-center gap-3 text-2xl font-bold text-muted-foreground hover:text-foreground transition-colors group"
							>
								<span className="text-4xl group-hover:scale-125 transition-transform">{partner.logo}</span>
								<span>{partner.name}</span>
							</motion.div>
						))}
					</motion.div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 px-4">
				<div className="container mx-auto">
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="glass-card p-12 md:p-16 rounded-3xl text-center max-w-4xl mx-auto relative overflow-hidden border-2 border-primary/20"
					>
						<div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10" />
						<div className="relative z-10">
							<h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
								Ready to take control of your royalties?
							</h2>
							<p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
								Join thousands of creators already using CreatorStream to automate their NFT royalties on Flow
							</p>
							<Button 
								size="lg" 
								variant="gradient"
								onClick={user?.loggedIn ? () => navigate('/dashboard') : handleConnectWallet}
								disabled={isConnecting}
								className="group text-lg px-10 py-7 h-auto shadow-2xl shadow-primary/50"
							>
								<Wallet className="mr-2 h-6 w-6 group-hover:rotate-12 transition-transform" />
								{user?.loggedIn ? "Go to Dashboard" : isConnecting ? "Connecting..." : "Connect Dapper Wallet Now"}
							</Button>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t border-border/50 py-12 px-4 mt-20 bg-muted/10">
				<div className="container mx-auto">
					<div className="grid md:grid-cols-4 gap-8 mb-8">
						<div>
							<h3 className="font-bold text-2xl mb-4 gradient-text">CreatorStream</h3>
							<p className="text-sm text-muted-foreground">
								Automate and track your NFT royalties on Flow blockchain with ease.
							</p>
						</div>
						<div>
							<h4 className="font-semibold mb-4">Product</h4>
							<ul className="space-y-2 text-sm text-muted-foreground">
								<li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
								<li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
								<li><a href="#" className="hover:text-foreground transition-colors">Roadmap</a></li>
							</ul>
						</div>
						<div>
							<h4 className="font-semibold mb-4">Resources</h4>
							<ul className="space-y-2 text-sm text-muted-foreground">
								<li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
								<li><a href="#" className="hover:text-foreground transition-colors">Docs</a></li>
								<li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
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
						<p>© 2024 CreatorStream. All rights reserved. Built for Forte Hacks with Flow & Dapper Wallet 💜</p>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default Landing;
