import { Link } from 'react-router-dom';
import { Activity, Bell, MessageSquare, History, Thermometer, Heart, Droplets, ShieldCheck, Zap, Globe, Smartphone, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, description, delay, colorClass }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className="group relative h-full"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50 rounded-3xl -z-10 shadow-lg group-hover:shadow-2xl transition-all duration-500 border border-slate-100"></div>
    <div className="p-8 flex flex-col items-center text-center">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-300 ${colorClass}`}>
        <Icon size={32} />
      </div>
      <h3 className="text-xl font-bold mb-3 text-slate-800 tracking-tight">{title}</h3>
      <p className="text-slate-600 leading-relaxed text-sm">{description}</p>
    </div>
  </motion.div>
);

const LandingPage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-12 pb-16 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 -z-10 w-[800px] h-[800px] bg-primary-100/30 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-accent/5 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/4"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-bold mb-6 border border-primary-100">
                <ShieldCheck size={18} />
                <span>Next Generation AI Health Care</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-[1.1]">
                Your Health, <span className="text-primary-600 relative inline-block">
                  Monitored 
                  <span className="absolute bottom-2 left-0 w-full h-3 bg-primary-200/50 -z-10"></span>
                </span> <br />
                Smartly & Easily
              </h1>
              <p className="text-xl text-slate-600 mb-10 max-w-xl leading-relaxed">
                Connect with caretakers, monitor your heartbeat, sugar levels, and temperature in real-time. Never miss a medicine with our smart reminder system.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Link to="/register" className="btn-primary flex items-center gap-2 text-lg py-4 px-8 shadow-xl shadow-primary-200">
                  Register Now <ArrowRight size={20} />
                </Link>
                <Link to="/login" className="btn-secondary text-lg py-4 px-8">
                  Sign In
                </Link>
              </div>
              
              <div className="mt-12 flex items-center gap-6">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center overflow-hidden">
                      <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">5,000+ Happy Patients</div>
                  <div className="flex text-amber-500 text-xs">★★★★★</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10 p-4 bg-white rounded-[2rem] shadow-2xl border border-slate-100">
                <div className="bg-slate-50 rounded-[1.5rem] p-6">
                  <div className="flex items-center justify-between mb-8">
                    <div className="font-bold text-slate-800">Health Overview</div>
                    <div className="flex gap-2">
                       <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                       <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Live Monitoring</span>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-50">
                      <div className="bg-orange-50 text-orange-600 p-3 rounded-lg"><Thermometer size={24} /></div>
                      <div>
                        <div className="text-xs text-slate-400 font-bold uppercase">Body Temperature</div>
                        <div className="text-2xl font-black text-slate-800">98.6°F</div>
                      </div>
                      <div className="ml-auto flex items-center gap-1 text-green-500 text-sm font-bold">
                        <TrendingUp size={16} /> Normal
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-50">
                      <div className="bg-red-50 text-red-600 p-3 rounded-lg"><Heart size={24} /></div>
                      <div>
                        <div className="text-xs text-slate-400 font-bold uppercase">Pulse Rate</div>
                        <div className="text-2xl font-black text-slate-800">72 BPM</div>
                      </div>
                      <div className="ml-auto text-primary-600 font-bold">Stable</div>
                    </div>
                    
                    <div className="bg-primary-600 text-white p-6 rounded-2xl shadow-xl">
                      <div className="flex items-center justify-between mb-4">
                        <div className="font-bold">Next Medicine</div>
                        <Bell size={20} />
                      </div>
                      <div className="text-2xl font-bold mb-1">Metformin</div>
                      <div className="text-primary-100 text-sm">Today at 9:30 PM • 500mg</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating accents */}
              <div className="absolute top-1/2 -right-8 w-24 h-24 bg-primary-500 rounded-full blur-3xl opacity-30"></div>
              <div className="absolute -bottom-10 left-10 w-32 h-32 bg-accent rounded-full blur-[80px] opacity-10"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-accent font-black uppercase tracking-[0.2em] text-sm mb-4">Core Capabilities</h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900">Advanced Health <span className="text-primary-600">Features</span></h3>
            <p className="mt-4 text-slate-500 max-w-2xl mx-auto italic">Everything you need to manage your personal and clinical healthcare digitaly.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={Activity} 
              title="Health Monitoring" 
              description="Monitor heartbeat, sugar levels, and temperature with high precision and history tracking."
              delay={0.1}
              colorClass="bg-red-50 text-red-600"
            />
            <FeatureCard 
              icon={Bell} 
              title="Medicine Reminder" 
              description="Get instant email and push notifications so you никогда не skip your important medications again."
              delay={0.2}
              colorClass="bg-primary-50 text-primary-600"
            />
            <FeatureCard 
              icon={MessageSquare} 
              title="Digital Consultation" 
              description="A seamless bridge between patients and caretakers with dedicated messaging and reporting panels."
              delay={0.3}
              colorClass="bg-blue-50 text-blue-600"
            />
            <FeatureCard 
              icon={History} 
              title="Smart History" 
              description="Access your complete clinical data history anytime, anywhere with cloud-synced reporting."
              delay={0.4}
              colorClass="bg-green-50 text-green-600"
            />
          </div>
        </div>
      </section>

      {/* What We Provide Section */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { title: "Temperature Tracking", desc: "Keep record of daily body temp.", icon: Thermometer, color: "text-orange-500" },
                  { title: "Heartbeat Sensors", desc: "Pulse monitoring at your fingertips.", icon: Heart, color: "text-red-500" },
                  { title: "Sugar Management", desc: "Dedicated diabetic health charts.", icon: Droplets, color: "text-blue-500" },
                  { title: "Email Reminders", desc: "Real-time medicine alerts via email.", icon: globe, icon: Zap, color: "text-yellow-500" }
                ].map((item, i) => (
                  <div key={i} className="p-6 bg-slate-50 rounded-2xl hover:bg-primary-50 transition-colors border border-slate-100 group">
                    <item.icon className={`${item.color} mb-4 group-hover:scale-110 transition-transform`} size={28} />
                    <h4 className="font-bold text-slate-800 text-lg mb-1">{item.title}</h4>
                    <p className="text-slate-500 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-black mb-6 text-slate-900">What We <span className="text-primary-600">Provide</span> to You</h2>
              <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                We use industry-standard parameters to ensure you receive the most accurate monitoring possible. Our platform supports both emergency alerts and routine logs.
              </p>
              <div className="space-y-4">
                {[
                  "Automated abnormal health alerts",
                  "Direct connection with specialist caretakers",
                  "Encrypted and secure health records",
                  "Medicine dosage tracking with schedules"
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="text-primary-600 flex-shrink-0" size={24} />
                    <span className="text-slate-700 font-medium">{text}</span>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                 <Link to="/register" className="inline-flex items-center gap-2 font-black text-primary-600 hover:text-primary-700 group">
                    Start Monitoring Today
                    <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                 </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 pt-20 pb-10 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 lg:col-span-1">
              <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-white mb-6">
                <Activity className="text-primary-400" size={32} />
                <span>Smart <span className="text-primary-400">Health</span></span>
              </Link>
              <p className="text-slate-400 leading-relaxed mb-6">
                Empowering healthcare with technology. monitor vitals, manage medications, and consult professionals seamlessly.
              </p>
              <div className="flex gap-4">
                 {[Globe, Smartphone, Zap].map((Icon, i) => (
                   <div key={i} className="w-10 h-10 border border-slate-700 rounded-full flex items-center justify-center hover:bg-primary-600 hover:border-primary-600 transition-all cursor-pointer">
                     <Icon size={18} />
                   </div>
                 ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-4">
                {['Home', 'Features', 'Services', 'Consultations', 'About Us'].map(link => (
                  <li key={link}><button className="text-slate-400 hover:text-white transition-colors">{link}</button></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Patient Support</h4>
              <ul className="space-y-4">
                {['Submit Records', 'Reminders', 'Emergency Help', 'Privacy Policy'].map(link => (
                  <li key={link}><button className="text-slate-400 hover:text-white transition-colors">{link}</button></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Newsletter</h4>
              <p className="text-slate-400 text-sm mb-4">Stay updated with latest medical tech advancements.</p>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="name@email.com" 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-primary-500 transition-colors"
                />
                <button className="absolute right-2 top-2 bottom-2 bg-primary-600 px-3 rounded-md hover:bg-primary-700 transition-colors">
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
            <p>&copy; 2026 Smart Health Monitoring System. All rights reserved.</p>
            <div className="flex gap-8">
              <button className="hover:text-white transition-colors">Privacy Policy</button>
              <button className="hover:text-white transition-colors">Terms of Service</button>
              <button className="hover:text-white transition-colors">Cookie Settings</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Helper for UI mockup
const TrendingUp = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

const globe = Globe; // Just for the mapping

export default LandingPage;
