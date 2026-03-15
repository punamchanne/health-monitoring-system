import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Briefcase, User as PatientIcon, ArrowRight, ShieldCheck, CheckCircle2, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient', // Default to patient
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await register(formData.name, formData.email, formData.password, formData.role);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-white relative overflow-hidden px-4 py-8">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary-100/50 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-[2.5rem] shadow-2xl shadow-primary-200/50 overflow-hidden border border-slate-100">
        
        {/* Left Side - Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center order-2 md:order-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8 text-center md:text-left">
              <h3 className="text-3xl font-black text-slate-900 mb-2">Create Account</h3>
              <p className="text-slate-500">Join our modern healthcare ecosystem</p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100 flex items-center gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors">
                    <User size={20} />
                  </div>
                  <input
                    type="text"
                    required
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-primary-500 focus:bg-white transition-all text-slate-900 font-medium"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors">
                    <Mail size={20} />
                  </div>
                  <input
                    type="email"
                    required
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-primary-500 focus:bg-white transition-all text-slate-900 font-medium"
                    placeholder="name@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors">
                    <Lock size={20} />
                  </div>
                  <input
                    type="password"
                    required
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-primary-500 focus:bg-white transition-all text-slate-900 font-medium"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>

              {/* Account type selection removed - Patient only registration */}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-4 mt-4 text-lg shadow-xl shadow-primary-200 flex items-center justify-center gap-2 h-[60px]"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Create Account <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-slate-500 font-medium">
                Already member of Smart Health?{' '}
                <Link to="/login" className="text-primary-600 font-black hover:underline underline-offset-4">
                  Login here
                </Link>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Info Panel */}
        <div className="hidden md:flex flex-col justify-center p-12 bg-slate-900 text-white relative order-1 md:order-2">
          <div className="absolute top-0 left-0 p-8 opacity-5">
            <Activity size={240} />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-xs font-bold mb-8 border border-primary-500/30">
              <ShieldCheck size={14} />
              HIPAA Compliant Platform
            </div>
            
            <h2 className="text-4xl font-black mb-6 leading-tight">Start Your <span className="text-primary-500">Journey</span> to Better Health.</h2>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed">
              Join thousands of users who trust Smart Health for their daily medical monitoring and professional consultations.
            </p>

            <div className="space-y-6">
              {[
                { title: "24/7 Monitoring", desc: "Your vitals are tracked around the clock." },
                { title: "Expert Consults", desc: "Connect with certified professionals." },
                { title: "Smart Reminders", desc: "Personalized medicine schedules." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 size={14} className="text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-100">{item.title}</div>
                    <div className="text-sm text-slate-500">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                <div className="italic text-slate-400 mb-4 font-medium">
                  "This system changed the way I manage my diabetes. The reminders are a lifesaver!"
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-600 overflow-hidden">
                    <img src="https://i.pravatar.cc/100?u=jane" alt="user" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">Jane Cooper</div>
                    <div className="text-xs text-slate-500">Patient since 2024</div>
                  </div>
                </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;
