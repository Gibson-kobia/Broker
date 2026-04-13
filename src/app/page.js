'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Shield, Zap, Globe, Activity, Code, 
  CreditCard, ChevronRight, Menu, X, 
  Wallet, PieChart, Terminal, CheckCircle2,
  TrendingUp
} from 'lucide-react';

// --- THEME & UTILS ---
const colors = {
  primary: 'from-blue-500 to-cyan-400',
  glass: 'bg-white/[0.03] backdrop-blur-xl border border-white/[0.08]',
};

// --- REUSABLE UI COMPONENTS ---

const Button = ({ children, variant = 'primary', className = '', icon, onClick, type = "button", disabled = false }) => {
  const baseStyle = "relative inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium tracking-wide transition-all duration-300 rounded-full overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: `bg-white text-black hover:bg-slate-200`,
    glow: `bg-transparent text-white border border-white/20 hover:border-white/50 hover:bg-white/5`,
    ghost: `bg-transparent text-slate-300 hover:text-white hover:bg-white/5`
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {variant === 'glow' && !disabled && (
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full blur-md" />
      )}
      <span className="relative flex items-center gap-2">
        {children}
        {icon && <span className="group-hover:translate-x-1 transition-transform duration-300">{icon}</span>}
      </span>
    </button>
  );
};

const GlassCard = ({ children, className = '', delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    className={`${colors.glass} rounded-2xl p-6 ${className}`}
  >
    {children}
  </motion.div>
);

const GradientText = ({ children, className = '' }) => (
  <span className={`bg-clip-text text-transparent bg-gradient-to-r ${colors.primary} ${className}`}>
    {children}
  </span>
);

// --- NAVBAR ---
const Navbar = ({ showToast }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ['Integrations', 'Solutions', 'Developers', 'Company'];

  const handleNav = (target) => {
    setMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById(target.toLowerCase());
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[#0a0a0c]/90 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <Zap className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Nexara</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button key={link} onClick={() => handleNav(link)} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                {link}
              </button>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" onClick={() => showToast('Sign In modal would open here')}>Sign In</Button>
            <Button onClick={() => showToast('Account connection flow started')}>Connect Account</Button>
          </div>
          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-[#0a0a0c] p-6 flex flex-col"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="text-xl font-bold text-white">Nexara</span>
              <button onClick={() => setMobileMenuOpen(false)}><X className="text-white w-6 h-6" /></button>
            </div>
            <div className="flex flex-col gap-6 text-2xl font-medium text-white">
              {navLinks.map((link) => (
                <button key={link} onClick={() => handleNav(link)} className="text-left border-b border-white/10 pb-4">
                  {link}
                </button>
              ))}
            </div>
            <div className="mt-auto flex flex-col gap-4">
              <Button variant="glow" onClick={() => { setMobileMenuOpen(false); showToast('Sign In modal would open here'); }} className="w-full justify-center">Sign In</Button>
              <Button onClick={() => { setMobileMenuOpen(false); showToast('Account connection flow started'); }} className="w-full justify-center">Connect Account</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// --- PLATFORM CARD ---
const PlatformCard = ({ platform, index, showToast }) => {
  const isImageUrl = typeof platform.icon === 'string';
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 + (index * 0.05) }}
      onClick={() => showToast(`Opening ${platform.name} integration...`)}
      className="group relative p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all duration-300 overflow-hidden flex flex-col h-full shadow-lg cursor-pointer"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="relative z-10 flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors overflow-hidden">
            {isImageUrl ? (
              <img src={platform.icon} alt={platform.name} className="w-full h-full object-cover" />
            ) : (
              <platform.icon className="w-5 h-5 text-slate-300 group-hover:text-cyan-400 transition-colors" />
            )}
          </div>
          <h3 className="text-base font-semibold text-white tracking-tight">{platform.name}</h3>
        </div>
        <span className={`text-[9px] uppercase tracking-wider font-semibold px-2 py-1 rounded-full border ${platform.status === 'Available' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
          {platform.status}
        </span>
      </div>
      <p className="relative z-10 text-xs sm:text-sm text-slate-400 mb-4 flex-grow leading-relaxed">
        {platform.desc}
      </p>
      <div className="relative z-10 flex items-center gap-1.5 text-xs font-medium text-slate-500 group-hover:text-cyan-400 transition-colors mt-auto cursor-pointer">
        {platform.cta}
        <ArrowRight className="w-3 h-3 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
      </div>
    </motion.div>
  );
};

// --- HERO ---
const Hero = ({ showToast }) => {
  const platforms = [
    { name: 'Coinbase', icon: 'https://placehold.co/100x100/0052FF/FFF?text=CB', desc: 'Access Prime and Advanced Trade.', status: 'Available', cta: 'Connect Account' },
    { name: 'Binance', icon: 'https://placehold.co/100x100/F0B90B/000?text=BNB', desc: 'Sync spot and futures liquidity securely.', status: 'Available', cta: 'Connect Account' },
    { name: 'Bybit', icon: 'https://placehold.co/100x100/000000/FFF?text=BYBIT', desc: 'Unified trading account (UTA) integration.', status: 'Beta', cta: 'Link Platform' },
    { name: 'Noones', icon: 'https://placehold.co/100x100/00A56A/FFF?text=Noones', desc: 'Connect global P2P liquidity seamlessly.', status: 'Available', cta: 'Link Platform' },
    { name: 'Ext. Wallets', icon: Wallet, desc: 'Link MetaMask, Ledger, and custom RPCs.', status: 'Beta', cta: 'View Support' },
    { name: 'Bank Rails', icon: CreditCard, desc: 'ACH, SEPA, and wire transfer endpoints.', status: 'Planned', cta: 'Learn More' }
  ];

  return (
    <section id="integrations" className="relative pt-28 pb-16 md:pt-40 md:pb-24 overflow-hidden border-b border-white/5">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/15 blur-[120px] rounded-[100%] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-12 gap-10 md:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="lg:col-span-5 flex flex-col justify-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6 md:mb-8 backdrop-blur-sm self-start">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-slate-300">Nexara v2 API is live</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-5 md:mb-6">
            One control layer.<br />
            <GradientText>All your platforms.</GradientText>
          </h1>
          <p className="text-base md:text-lg text-slate-400 mb-8 md:mb-10 leading-relaxed max-w-md">
            Unify your balances and route liquidity. Execute across exchanges, Web3 wallets, and bank rails from a single, seamless dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <Button onClick={() => showToast('Opening account connection flow...')} icon={<ArrowRight className="w-4 h-4" />}>Connect Accounts</Button>
            <Button onClick={() => showToast('Navigating to documentation...')} variant="glow">Read the Docs</Button>
          </div>
        </motion.div>

        <div className="lg:col-span-7 relative">
          <div className="absolute inset-0 bg-blue-500/5 blur-[80px] rounded-full mix-blend-screen pointer-events-none" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 relative z-10">
            {platforms.map((platform, i) => (
              <PlatformCard key={platform.name} platform={platform} index={i} showToast={showToast} />
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 text-center lg:text-right"
          >
            <span className="text-xs font-medium text-slate-500 flex items-center justify-center lg:justify-end gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
              Supporting 40+ global exchanges and fiat endpoints
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// --- FEATURES ---
const Features = () => {
  const features = [
    { icon: Zap, title: "Microsecond Execution", desc: "Our unified matching layer processes routed transactions in under 400ms globally." },
    { icon: Shield, title: "Bank-Grade Security", desc: "MPC wallet infrastructure, role-based access control, and real-time transaction monitoring." },
    { icon: Globe, title: "Global Fiat Rails", desc: "Seamlessly convert between digital assets and fiat in over 150+ countries instantly." },
    { icon: Activity, title: "Deep Liquidity", desc: "Access aggregated liquidity from top tier exchanges and OTC desks through a single endpoint." },
    { icon: Code, title: "Developer First", desc: "RESTful APIs, WebSockets, and comprehensive SDKs in all major languages. Built by devs, for devs." },
    { icon: PieChart, title: "Smart Routing", desc: "Intelligent order routing algorithms ensure the best execution price across multiple venues." }
  ];

  return (
    <section id="solutions" className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Engineered for Scale</h2>
          <p className="text-base md:text-lg text-slate-400">Everything you need to unify and scale your digital financial operations without managing underlying API complexity.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((feat, i) => (
            <GlassCard key={i} delay={i * 0.1} className="group hover:border-cyan-500/30 transition-colors duration-500">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                <feat.icon className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feat.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">{feat.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- DEVELOPER SECTION ---
const DeveloperSection = ({ showToast }) => {
  return (
    <section id="developers" className="py-24 md:py-32 bg-black relative border-y border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-2 mb-6 text-cyan-400 font-medium text-sm md:text-base">
            <Terminal className="w-5 h-5" /> <span>Unified API</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
            Integrate in minutes,<br />route to millions.
          </h2>
          <p className="text-base md:text-lg text-slate-400 mb-8">
            A single, standardized API to command your entire digital stack. Sync wallets, process payments, and manage cross-platform liquidity with a few lines of code.
          </p>
          <ul className="space-y-4 mb-10 text-sm md:text-base">
            {['Standardized cross-exchange payload formats', 'Webhooks for real-time order state', 'Multi-signature programmatic execution'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Button onClick={() => showToast('Opening API Documentation...')} variant="glow" icon={<ChevronRight className="w-4 h-4" />}>View Documentation</Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-white/10 bg-[#0d0d12] overflow-hidden shadow-2xl"
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-4 text-xs font-mono text-slate-500">route_liquidity.ts</span>
          </div>
          <div className="p-4 md:p-6 overflow-x-auto text-xs md:text-sm font-mono leading-relaxed">
            <pre className="text-slate-300">
              <span className="text-purple-400">import</span>{' '}
              <span className="text-white">{'{ Nexara }'}</span>{' '}
              <span className="text-purple-400">from</span>{' '}
              <span className="text-emerald-300">&apos;@nexara/node&apos;</span>;{'\n\n'}
              <span className="text-slate-500">{'// Initialize the unified SDK'}</span>{'\n'}
              <span className="text-purple-400">const</span>{' nexara '}
              <span className="text-cyan-400">=</span>{' '}
              <span className="text-purple-400">new</span>{' '}
              <span className="text-yellow-200">Nexara</span>
              {'(process.env.'}
              <span className="text-blue-300">NEXARA_API_KEY</span>
              {');\n\n'}
              <span className="text-purple-400">async function</span>{' '}
              <span className="text-blue-400">rebalancePortfolio</span>
              {'() {\n'}
              {'  '}
              <span className="text-slate-500">{'// Move 50k USDC from Binance to Bybit'}</span>{'\n'}
              {'  '}
              <span className="text-purple-400">const</span>
              {' transfer '}
              <span className="text-cyan-400">=</span>
              {' '}
              <span className="text-purple-400">await</span>
              {' nexara.routing.'}
              <span className="text-blue-400">execute</span>
              {'({\n'}
              {'    asset: '}
              <span className="text-emerald-300">&apos;USDC&apos;</span>
              {',\n'}
              {'    amount: '}
              <span className="text-emerald-300">&apos;50000.00&apos;</span>
              {',\n'}
              {'    source: '}
              <span className="text-emerald-300">&apos;binance_spot&apos;</span>
              {',\n'}
              {'    destination: '}
              <span className="text-emerald-300">&apos;bybit_uta&apos;</span>
              {',\n'}
              {'    network: '}
              <span className="text-emerald-300">&apos;arbitrum_one&apos;</span>
              {'\n  });\n\n  '}
              <span className="text-purple-400">return</span>
              {' transfer.status; '}
              <span className="text-slate-500">{'// settled'}</span>
              {'\n}'}
            </pre>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// --- CTA ---
const CTA = ({ showToast }) => {
  const [email, setEmail] = useState('');

  return (
    <section id="company" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-black pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-8 backdrop-blur-sm">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-medium text-slate-300">Now in early access</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
            The infrastructure for the<br />
            <GradientText>next era of finance.</GradientText>
          </h2>

          <p className="text-base md:text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of traders, developers, and institutions already using Nexara to unify their financial stack and route liquidity at scale.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-md mx-auto mb-12">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-5 py-3 rounded-full bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500/50 transition-all duration-300"
            />
            <Button
              onClick={() => {
                if (email) {
                  showToast("You're on the waitlist!");
                  setEmail('');
                } else {
                  showToast('Please enter a valid email.');
                }
              }}
              className="whitespace-nowrap w-full sm:w-auto"
            >
              Get Early Access
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            {[
              { icon: Shield, text: 'No credit card required' },
              { icon: Zap, text: 'Free during beta' },
              { icon: CheckCircle2, text: 'Cancel anytime' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-slate-600" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// --- FOOTER ---
const Footer = ({ showToast }) => {
  const footerLinks = {
    Product: ['Integrations', 'Solutions', 'Pricing', 'Changelog'],
    Developers: ['Documentation', 'API Reference', 'SDKs', 'Status'],
    Company: ['About', 'Blog', 'Careers', 'Contact'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Security'],
  };

  return (
    <footer className="border-t border-white/5 bg-black py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                <Zap className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Nexara</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              The unified financial infrastructure for the next generation of digital finance.
            </p>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <button
                      onClick={() => showToast(`Navigating to ${link}...`)}
                      className="text-sm text-slate-500 hover:text-white transition-colors"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-600">&copy; {new Date().getFullYear()} Nexara, Inc. All rights reserved.</p>
          <p className="text-xs text-slate-700">Built with precision for the future of finance.</p>
        </div>
      </div>
    </footer>
  );
};

// --- TOAST ---
const Toast = ({ message, onClose }) => (
  <AnimatePresence>
    {message && (
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-full bg-white text-black text-sm font-medium shadow-2xl flex items-center gap-3 whitespace-nowrap"
      >
        <span>{message}</span>
        <button onClick={onClose} className="opacity-50 hover:opacity-100 transition-opacity">
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    )}
  </AnimatePresence>
);

// --- MAIN PAGE ---
export default function Home() {
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0c] text-white overflow-x-hidden">
      <Navbar showToast={showToast} />
      <Hero showToast={showToast} />
      <Features />
      <DeveloperSection showToast={showToast} />
      <CTA showToast={showToast} />
      <Footer showToast={showToast} />
      <Toast message={toast} onClose={() => setToast('')} />
    </main>
  );
}
