import { Button } from "@/components/ui/button";
import { Wallet, Users, BarChart3, Shield, Zap, Sparkles, Lock, Clock, Gift, Rocket, Star } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { login, logout, subscribeToAuth } from "@/lib/dapper-wallet";
import type { CurrentUser } from "@onflow/fcl";
import { toast } from "sonner";

const Landing = () => {
	const navigate = useNavigate();
	const [user, setUser] = useState<CurrentUser | null>(null);
	const [isConnecting, setIsConnecting] = useState(false);
	const { scrollYProgress } = useScroll();
	const heroRef = useRef<HTMLDivElement>(null);

	// Parallax transform
	const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);

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
			icon: Clock,
			title: "Upcoming Payout Schedule",
			description: "See exactly when and how much you'll receive next, across all collections, with smart reminders.",
			color: "from-sky-500 to-cyan-500",
		},
		{
			icon: Users,
			title: "Collaborator Management",
			description: "Add, edit, and validate royalty splits so totals always add up to 100%. Keep everyone in sync.",
			color: "from-blue-500 to-indigo-500",
		},
		{
			icon: BarChart3,
			title: "Deep Analytics",
			description: "Earnings over time, top NFTs, and marketplace contributions — all visualized with beautiful charts.",
			color: "from-purple-500 to-pink-500",
		},
		{
			icon: Zap,
			title: "NFT Earnings Breakdown",
			description: "Drill down by NFT and marketplace. Export CSV or PDF reports for accounting in one click.",
			color: "from-amber-500 to-orange-500",
		},
		{
			icon: Shield,
			title: "Real-Time Alerts",
			description: "Get notified for new sales and payouts. A dedicated notifications section keeps you up to date.",
			color: "from-emerald-500 to-green-500",
		},
		{
			icon: Gift,
			title: "Multi-Wallet + Marketplaces",
			description: "Dapper Wallet today, Blocto tomorrow. Track royalties from NBA Top Shot, NFL All Day, and more.",
			color: "from-fuchsia-500 to-violet-500",
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
			<section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
				{/* Animated background elements with floating animation */}
				<div className="absolute inset-0 overflow-hidden">
					<motion.div 
						className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
						animate={{
							x: [0, 50, -30, 0],
							y: [0, -40, 30, 0],
							scale: [1, 1.1, 0.9, 1],
						}}
						transition={{
							duration: 20,
							repeat: Infinity,
							ease: "easeInOut",
						}}
					/>
					<motion.div 
						className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
						animate={{
							x: [0, -60, 40, 0],
							y: [0, 50, -35, 0],
							scale: [1, 0.9, 1.1, 1],
						}}
						transition={{
							duration: 25,
							repeat: Infinity,
							ease: "easeInOut",
							delay: 1,
						}}
					/>
					<motion.div 
						className="absolute top-1/2 left-1/2 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
						animate={{
							x: [0, 30, -50, 0],
							y: [0, -60, 40, 0],
							scale: [1, 1.2, 0.8, 1],
						}}
						transition={{
							duration: 30,
							repeat: Infinity,
							ease: "easeInOut",
							delay: 2,
						}}
					/>
					{/* Additional floating particles */}
					{[...Array(6)].map((_, i) => (
						<motion.div
							key={i}
							className="absolute w-2 h-2 bg-primary/30 rounded-full"
							style={{
								left: `${20 + i * 15}%`,
								top: `${30 + (i % 3) * 20}%`,
							}}
							animate={{
								y: [0, -30, 0],
								opacity: [0.3, 0.6, 0.3],
								scale: [1, 1.5, 1],
							}}
							transition={{
								duration: 3 + i,
								repeat: Infinity,
								ease: "easeInOut",
								delay: i * 0.5,
							}}
						/>
					))}
				</div>
        
				<div className="relative z-10 container mx-auto px-4 py-20">
					<motion.div 
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						style={{ y: y2 }}
						className="text-center"
					>
						<motion.div
							initial={{ scale: 0.9, opacity: 0, y: -20 }}
							animate={{ scale: 1, opacity: 1, y: 0 }}
							transition={{ 
								duration: 0.6, 
								delay: 0.2,
								type: "spring",
								stiffness: 200,
								damping: 20
							}}
							whileHover={{ scale: 1.05 }}
							className="inline-block mb-4"
						>
							<span className="px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold backdrop-blur-sm">
								⚡ Powered by Flow & Dapper Wallet
							</span>
						</motion.div>
            
						<motion.h1 
							initial={{ opacity: 0, scale: 0.8, y: 50 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							transition={{ 
								duration: 1,
								delay: 0.3,
								type: "spring",
								stiffness: 100,
								damping: 15
							}}
							className="text-6xl md:text-7xl lg:text-9xl font-bold mb-6 gradient-text animate-gradient-shift bg-300% tracking-tight"
						>
							CreatorStream
						</motion.h1>
            
						<motion.p 
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.6, duration: 0.8 }}
							className="text-xl md:text-3xl text-muted-foreground mb-12 max-w-3xl mx-auto font-light"
						>
							Automate and track your NFT royalties on Flow blockchain
							<br />
							<motion.span 
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.9 }}
								className="text-2xl md:text-xl gradient-text font-semibold inline-block"
							>
								The most advanced creator platform for Web3
							</motion.span>
						</motion.p>
            
						<motion.div 
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.6 }}
							className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
						>
							{user?.loggedIn ? (
								<>
									<motion.div
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										<Button 
											size="lg" 
											variant="gradient"
											onClick={() => navigate('/dashboard')}
											className="group text-lg px-8 py-6 h-auto"
										>
											<motion.div
												animate={{ rotate: [0, 10, -10, 0] }}
												transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
											>
												<BarChart3 className="mr-2 h-6 w-6 group-hover:scale-110 transition-transform" />
											</motion.div>
											Go to Dashboard
										</Button>
									</motion.div>
									<motion.div
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										<Button 
											size="lg" 
											variant="outline"
											onClick={handleDisconnect}
											className="text-lg px-8 py-6 h-auto"
										>
											Disconnect ({user.addr?.slice(0, 6)}...{user.addr?.slice(-4)})
										</Button>
									</motion.div>
								</>
							) : (
								<>
									<motion.div
										whileHover={{ scale: 1.05, y: -2 }}
										whileTap={{ scale: 0.95 }}
										animate={{ y: [0, -5, 0] }}
										transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
									>
										<Button 
											size="lg" 
											variant="gradient"
											onClick={handleConnectWallet}
											disabled={isConnecting}
											className="group text-lg px-8 py-6 h-auto shadow-2xl shadow-primary/50"
										>
											<motion.div
												animate={{ rotate: [0, 12, -12, 0] }}
												transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
											>
												<Wallet className="mr-2 h-6 w-6 group-hover:rotate-12 transition-transform" />
											</motion.div>
											{isConnecting ? "Connecting..." : "Connect Dapper Wallet"}
										</Button>
									</motion.div>
									<motion.div
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
									>
										<Button 
											size="lg" 
											variant="glass"
											className="text-lg px-8 py-6 h-auto"
											onClick={() => {
												const featuresSection = document.getElementById('features');
												featuresSection?.scrollIntoView({ behavior: 'smooth' });
											}}
										>
											<motion.div
												animate={{ rotate: 360 }}
												transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
											>
												<Sparkles className="mr-2 h-5 w-5" />
											</motion.div>
											Explore Features
										</Button>
									</motion.div>
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
						<motion.div 
							variants={itemVariants}
							whileHover={{ scale: 1.1, y: -5, rotateY: 5 }}
							className="glass-card p-8 rounded-2xl transition-all duration-300 border-2 border-primary/20 cursor-pointer relative overflow-hidden group"
						>
							<motion.div 
								className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
							/>
							<motion.div 
								animate={{ scale: [1, 1.1, 1] }}
								transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
								className="text-4xl font-bold gradient-text mb-2 relative z-10"
							>
								$2.4M+
							</motion.div>
							<div className="text-sm text-muted-foreground mt-1 relative z-10">Total Royalties Tracked</div>
						</motion.div>
						<motion.div 
							variants={itemVariants}
							whileHover={{ scale: 1.1, y: -5, rotateY: -5 }}
							className="glass-card p-8 rounded-2xl transition-all duration-300 border-2 border-secondary/20 cursor-pointer relative overflow-hidden group"
						>
							<motion.div 
								className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
							/>
							<motion.div 
								animate={{ scale: [1, 1.1, 1] }}
								transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
								className="text-4xl font-bold gradient-text mb-2 relative z-10"
							>
								15K+
							</motion.div>
							<div className="text-sm text-muted-foreground mt-1 relative z-10">Active Creators</div>
						</motion.div>
						<motion.div 
							variants={itemVariants}
							whileHover={{ scale: 1.1, y: -5, rotateY: 5 }}
							className="glass-card p-8 rounded-2xl transition-all duration-300 border-2 border-accent/20 cursor-pointer relative overflow-hidden group"
						>
							<motion.div 
								className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
							/>
							<motion.div 
								animate={{ scale: [1, 1.1, 1] }}
								transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
								className="text-4xl font-bold gradient-text mb-2 relative z-10"
							>
								50K+
							</motion.div>
							<div className="text-sm text-muted-foreground mt-1 relative z-10">NFT Collections</div>
						</motion.div>
						<motion.div 
							variants={itemVariants}
							whileHover={{ scale: 1.1, y: -5, rotateY: -5 }}
							className="glass-card p-8 rounded-2xl transition-all duration-300 border-2 border-primary/20 cursor-pointer relative overflow-hidden group"
						>
							<motion.div 
								className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
							/>
							<motion.div 
								animate={{ scale: [1, 1.1, 1] }}
								transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
								className="text-4xl font-bold gradient-text mb-2 relative z-10"
							>
								99.9%
							</motion.div>
							<div className="text-sm text-muted-foreground mt-1 relative z-10">Uptime</div>
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
								initial={{ opacity: 0, y: 50, rotateX: -15 }}
								whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
								viewport={{ once: true, margin: "-100px" }}
								transition={{ 
									duration: 0.6, 
									delay: index * 0.1,
									type: "spring",
									stiffness: 100
								}}
								whileHover={{ 
									scale: 1.05, 
									y: -10,
									rotateY: 5,
									transition: { duration: 0.3 }
								}}
								className="glass-card p-8 rounded-2xl transition-all duration-300 group relative overflow-hidden cursor-pointer"
							>
								<motion.div 
									className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
									initial={false}
									animate={{ 
										scale: [1, 1.1, 1],
										opacity: [0, 0.1, 0]
									}}
									transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
								/>
								<motion.div 
									className={`bg-gradient-to-br ${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4 relative z-10`}
									whileHover={{ scale: 1.2, rotate: 360, transition: { duration: 0.5 } }}
									animate={{ 
										y: [0, -5, 0],
										rotate: [0, 5, -5, 0]
									}}
									transition={{ 
										duration: 3 + index * 0.5, 
										repeat: Infinity, 
										ease: "easeInOut" 
									}}
								>
									<feature.icon className="h-7 w-7 text-white" />
								</motion.div>
								<motion.h3 
									className="text-xl font-semibold mb-3 relative z-10"
									whileHover={{ x: 5 }}
									transition={{ type: "spring", stiffness: 400 }}
								>
									{feature.title}
								</motion.h3>
								<p className="text-muted-foreground leading-relaxed relative z-10">{feature.description}</p>
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
								initial={{ opacity: 0, scale: 0.8, y: 30 }}
								whileInView={{ opacity: 1, scale: 1, y: 0 }}
								viewport={{ once: true, margin: "-50px" }}
								transition={{ 
									duration: 0.6, 
									delay: index * 0.15,
									type: "spring",
									stiffness: 100
								}}
								whileHover={{ 
									scale: 1.08, 
									y: -10,
									transition: { duration: 0.3 }
								}}
								className="glass-card p-10 rounded-2xl text-center group transition-all duration-300 relative overflow-hidden cursor-pointer"
							>
								<motion.div 
									className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
									animate={{ 
										opacity: [0, 0.05, 0],
									}}
									transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
								/>
								<div className="relative z-10">
								<motion.div 
									className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
									whileHover={{ scale: 1.3, rotate: 360 }}
									animate={{ 
										rotate: [0, 10, -10, 0],
										scale: [1, 1.1, 1]
									}}
									transition={{ 
										duration: 4, 
										repeat: Infinity, 
										ease: "easeInOut", 
										delay: index * 0.3 
									}}
								>
										<benefit.icon className="h-8 w-8 text-primary" />
									</motion.div>
									<motion.h3 
										className="text-2xl font-bold mb-4 gradient-text"
										whileHover={{ scale: 1.05 }}
										transition={{ type: "spring", stiffness: 400 }}
									>
										{benefit.title}
									</motion.h3>
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
								initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
								whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
								viewport={{ once: true }}
								transition={{ 
									duration: 0.6, 
									delay: index * 0.15,
									type: "spring",
									stiffness: 200
								}}
								whileHover={{ scale: 1.15, y: -5 }}
								className="flex items-center gap-3 text-2xl font-bold text-muted-foreground hover:text-foreground transition-colors group cursor-pointer"
							>
								<motion.span 
									className="text-4xl"
									whileHover={{ scale: 1.5, rotate: 360 }}
									transition={{ duration: 0.6 }}
									animate={{ 
										rotate: [0, 10, -10, 0],
										scale: [1, 1.1, 1]
									}}
									style={{
										transition: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }
									}}
								>
									{partner.logo}
								</motion.span>
								<motion.span
									whileHover={{ x: 5 }}
									transition={{ type: "spring", stiffness: 400 }}
								>
									{partner.name}
								</motion.span>
							</motion.div>
						))}
					</motion.div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 px-4">
				<div className="container mx-auto">
					<motion.div
						initial={{ opacity: 0, scale: 0.9, y: 50 }}
						whileInView={{ opacity: 1, scale: 1, y: 0 }}
						viewport={{ once: true, margin: "-100px" }}
						transition={{ 
							duration: 0.8,
							type: "spring",
							stiffness: 100
						}}
						whileHover={{ scale: 1.02 }}
						className="glass-card p-12 md:p-16 rounded-3xl text-center max-w-4xl mx-auto relative overflow-hidden border-2 border-primary/20"
					>
						<motion.div 
							className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10"
							animate={{
								backgroundPosition: ["0% 0%", "100% 100%"],
								opacity: [0.3, 0.6, 0.3]
							}}
							transition={{
								duration: 8,
								repeat: Infinity,
								ease: "easeInOut"
							}}
							style={{
								backgroundSize: "200% 200%"
							}}
						/>
						<div className="relative z-10">
							<motion.h2 
								className="text-4xl md:text-5xl font-bold mb-6 gradient-text"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: 0.2 }}
							>
								Ready to take control of your royalties?
							</motion.h2>
							<motion.p 
								className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: 0.3 }}
							>
								Join thousands of creators already using CreatorStream to automate their NFT royalties on Flow
							</motion.p>
							<motion.div
								initial={{ opacity: 0, scale: 0.8 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true }}
								transition={{ delay: 0.4 }}
								whileHover={{ scale: 1.05, y: -3 }}
								whileTap={{ scale: 0.95 }}
							>
								<Button 
									size="lg" 
									variant="gradient"
									onClick={user?.loggedIn ? () => navigate('/dashboard') : handleConnectWallet}
									disabled={isConnecting}
									className="group text-lg px-10 py-7 h-auto shadow-2xl shadow-primary/50"
								>
									<motion.div
										animate={{ rotate: [0, 15, -15, 0] }}
										transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
									>
										<Wallet className="mr-2 h-6 w-6 group-hover:rotate-12 transition-transform" />
									</motion.div>
									{user?.loggedIn ? "Go to Dashboard" : isConnecting ? "Connecting..." : "Connect Dapper Wallet Now"}
								</Button>
							</motion.div>
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
								<li><Link to="#" className="hover:text-foreground transition-colors">Pricing</Link></li>
								<li><Link to="#" className="hover:text-foreground transition-colors">Roadmap</Link></li>
							</ul>
						</div>
						<div>
							<h4 className="font-semibold mb-4">Resources</h4>
							<ul className="space-y-2 text-sm text-muted-foreground">
								<li><Link to="#" className="hover:text-foreground transition-colors">About</Link></li>
								<li><Link to="#" className="hover:text-foreground transition-colors">Docs</Link></li>
								<li><Link to="#" className="hover:text-foreground transition-colors">Contact</Link></li>
							</ul>
						</div>
						<div>
							<h4 className="font-semibold mb-4">Community</h4>
							<ul className="space-y-2 text-sm text-muted-foreground">
								<li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a></li>
								<li><Link to="#" className="hover:text-foreground transition-colors">Discord</Link></li>
								<li><Link to="#" className="hover:text-foreground transition-colors">Twitter</Link></li>
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
