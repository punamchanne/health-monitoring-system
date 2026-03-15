import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Mail, Lock, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'doctor') {
        navigate('/doctor-dashboard');
      } else {
        navigate('/patient-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-white relative overflow-hidden px-4 py-8">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 -z-10 w-[500px] h-[500px] bg-primary-100/50 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 -z-10 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-[2.5rem] shadow-2xl shadow-primary-200/50 overflow-hidden border border-slate-100">
        
        {/* Left Side - Promotional */}
        <div className="hidden md:flex flex-col justify-center p-12 bg-primary-600 text-white relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Activity size={200} />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold mb-12">
              <div className="bg-white p-1.5 rounded-lg">
                <Activity className="text-primary-600" size={24} />
              </div>
              <span>Smart <span className="text-primary-200">Health</span></span>
            </Link>

            <h2 className="text-4xl font-black mb-6 leading-tight">Welcome Back to Your Health Hub.</h2>
            <p className="text-primary-100 text-lg mb-8 leading-relaxed">
              Log in to access your personalized medical dashboard, track vitals, and connect with your healthcare providers.
            </p>

            <div className="space-y-4">
              {[
                "Real-time vital monitoring",
                "Automated medicine reminders",
                "Instant clinical history access",
                "Secure data encryption"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="text-primary-300" size={20} />
                  <span className="text-sm font-medium">{text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="mt-12 pt-12 border-t border-primary-500/50 flex items-center gap-4">
            <div className="bg-primary-500/30 p-3 rounded-xl border border-primary-400/30">
              <ShieldCheck className="text-white" size={24} />
            </div>
            <div>
              <div className="text-sm font-bold">Secure Access</div>
              <div className="text-xs text-primary-200">End-to-end encrypted medical records</div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="mb-10 text-center md:text-left">
              <h3 className="text-3xl font-black text-slate-900 mb-2">Sign In</h3>
              <p className="text-slate-500">Please enter your details to continue</p>
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

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors">
                    <Mail size={20} />
                  </div>
                  <input
                    type="email"
                    required
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary-500 focus:bg-white transition-all text-slate-900 font-medium"
                    placeholder="name@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-sm font-bold text-slate-700">Password</label>
                  <button type="button" className="text-primary-600 text-xs font-bold hover:underline">Forgot Password?</button>
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors">
                    <Lock size={20} />
                  </div>
                  <input
                    type="password"
                    required
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary-500 focus:bg-white transition-all text-slate-900 font-medium"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 px-1">
                <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                <label htmlFor="remember" className="text-sm text-slate-500 font-medium cursor-pointer">Remember me for 30 days</label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-4 text-lg shadow-xl shadow-primary-200 flex items-center justify-center gap-2 h-[60px]"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Sign In <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-slate-500 font-medium">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary-600 font-black hover:underline underline-offset-4">
                  Register for free
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
