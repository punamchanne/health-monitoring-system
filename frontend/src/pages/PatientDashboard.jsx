import { useState, useEffect } from 'react';
import api from '../api';
import HealthChart from '../components/HealthChart';
import { 
  Plus, ClipboardList, Activity, Bell, History, 
  Thermometer, Heart, Droplets, Calendar, 
  ChevronRight, TrendingUp, AlertCircle, 
  Clock, Pill, User, CheckCircle2, LayoutDashboard, LogOut, Mail,
  Scale, Wind, Moon, MapPin, Phone, Droplet, Ruler
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PatientDashboard = () => {
  const [vitals, setVitals] = useState({ 
    temperature: '', 
    heartbeat: '', 
    sugarLevel: '',
    bloodPressure: '',
    oxygenLevel: '',
    weight: '',
    sleepHours: ''
  });
  const [profile, setProfile] = useState({
    age: '',
    gender: '',
    contact: '',
    address: '',
    bloodGroup: '',
    height: '',
    emergencyName: '',
    emergencyPhone: ''
  });
  const [history, setHistory] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab ] = useState('overview'); // 'overview', 'input', 'meds', 'history', 'profile'
  const [activeReminder, setActiveReminder] = useState(null);
  const [lastNotified, setLastNotified] = useState('');

  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
    fetchMedicines();
    fetchProfile();

    const interval = setInterval(() => {
      fetchHistory();
      fetchMedicines();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const targetDate = new Date(now.getTime() + 5 * 60000);
      const targetTime = `${String(targetDate.getHours()).padStart(2, '0')}:${String(targetDate.getMinutes()).padStart(2, '0')}`;
      
      if (targetTime === lastNotified) return;

      const dueMed = medicines.find(m => m.reminderTime === targetTime);
      if (dueMed) {
        setActiveReminder(dueMed);
        setLastNotified(targetTime);
      }
    };

    const reminderInterval = setInterval(checkReminders, 10000);
    return () => clearInterval(reminderInterval);
  }, [medicines, lastNotified]);

  const fetchHistory = async () => {
    try {
      const response = await api.get('/patient/history');
      setHistory(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMedicines = async () => {
    try {
      const response = await api.get('/patient/prescriptions');
      setMedicines(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await api.get('/doctor/patients');
      const myData = response.data.find(p => p.patientId._id === user.id);
      if (myData) {
        setProfile({
            age: myData.age || '',
            gender: myData.gender || '',
            contact: myData.contact || '',
            address: myData.address || '',
            bloodGroup: myData.bloodGroup || '',
            height: myData.height || '',
            emergencyName: myData.emergencyName || '',
            emergencyPhone: myData.emergencyPhone || ''
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/patient/submit-data', vitals);
      setVitals({ 
        temperature: '', heartbeat: '', sugarLevel: '', bloodPressure: '', oxygenLevel: '', weight: '', sleepHours: ''
      });
      fetchHistory();
      setActiveTab('overview');
      alert('Health data submitted successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit data');
    } finally {
      setIsLoading(false);
    }
  };

  const latestStats = history[0] || { 
    temperature: '-', heartbeat: '-', sugarLevel: '-', bloodPressure: '-', oxygenLevel: '-', weight: '-', sleepHours: '-'
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-200 p-6 sticky top-0 h-screen overflow-y-auto">
        <div className="flex items-center gap-2 mb-10 px-3">
          <div className="bg-primary-600 p-1.5 rounded-lg">
            <Activity className="text-white" size={20} />
          </div>
          <span className="text-xl font-black text-slate-800 tracking-tight">Smart <span className="text-primary-600">Health</span></span>
        </div>

        <div className="space-y-1 mb-8 flex-1">
            <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-primary-50 text-primary-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
                <LayoutDashboard size={20} /> <span>Dashboard</span>
            </button>
            <button onClick={() => setActiveTab('input')} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${activeTab === 'input' ? 'bg-primary-50 text-primary-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
                <Plus size={20} /> <span>Add Health Info</span>
            </button>
            <button onClick={() => setActiveTab('meds')} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${activeTab === 'meds' ? 'bg-primary-50 text-primary-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
                <Pill size={20} /> <span>My Medicines</span>
            </button>
            <button onClick={() => setActiveTab('history')} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${activeTab === 'history' ? 'bg-primary-50 text-primary-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
                <History size={20} /> <span>History</span>
            </button>
            <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-primary-50 text-primary-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
                <User size={20} /> <span>My Profile</span>
            </button>
        </div>

        <div className="pt-6 border-t border-slate-100 space-y-4">
            <div className="flex items-center gap-3 px-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 sm:block"><User size={20} /></div>
                <div className="flex-1 truncate">
                    <div className="text-sm font-bold text-slate-900 truncate">{user?.name}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Patient</div>
                </div>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-3 text-red-500 hover:bg-red-50 rounded-xl font-bold text-sm">
                <LogOut size={20} /> <span>Logout</span>
            </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-screen">
        <header className="mb-10 flex justify-between items-end">
            <div>
                <h1 className="text-4xl font-black text-slate-900 mb-2">My Health</h1>
                <p className="text-slate-500 font-medium">Monitoring your vital signs and wellness.</p>
            </div>
            <div className="hidden sm:flex items-center gap-4">
                <div className="text-right">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Status</div>
                    <div className="text-sm font-bold text-green-500 flex items-center gap-1.5"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> System Live</div>
                </div>
            </div>
        </header>

        <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
                <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        <div className="glass-card p-6 border-l-4 border-l-primary-500"><div className="text-slate-400 text-xs font-bold uppercase mb-2">Temperature</div><div className="text-3xl font-black text-slate-800">{latestStats.temperature}°F</div></div>
                        <div className="glass-card p-6 border-l-4 border-l-red-500"><div className="text-slate-400 text-xs font-bold uppercase mb-2">Heart Rate</div><div className="text-3xl font-black text-slate-800">{latestStats.heartbeat} <span className="text-sm font-bold opacity-40">BPM</span></div></div>
                        <div className="glass-card p-6 border-l-4 border-l-blue-500"><div className="text-slate-400 text-xs font-bold uppercase mb-2">Sugar Level</div><div className="text-3xl font-black text-slate-800">{latestStats.sugarLevel} <span className="text-sm font-bold opacity-40">mg/dL</span></div></div>
                        <div className="glass-card p-6 border-l-4 border-l-emerald-500"><div className="text-slate-400 text-xs font-bold uppercase mb-2">Oxygen (O2)</div><div className="text-3xl font-black text-slate-800">{latestStats.oxygenLevel}%</div></div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 glass-card p-6">
                            <h3 className="text-xl font-black text-slate-800 mb-6 font-bold">Health Trends</h3>
                            <div className="h-[300px]"><HealthChart data={history} /></div>
                        </div>

                        <div className="glass-card p-6 bg-slate-900 text-white border-none shadow-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-black text-lg">Active Schedule</h3>
                                <button onClick={() => setActiveTab('meds')} className="text-xs font-bold text-primary-400 hover:underline">View All</button>
                            </div>
                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                                {medicines.filter(m => m.status === 'active').map((med) => (
                                    <div key={med._id} className="p-4 bg-white/5 rounded-2xl border border-white/10 group hover:bg-white/10 transition-all">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center flex-shrink-0"><Pill size={18} /></div>
                                            <div className="flex-1">
                                                <div className="font-bold mb-0.5">{med.medicineName}</div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase">{med.dosage} • {med.reminderTime}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {medicines.filter(m => m.status === 'active').length === 0 && (
                                    <div className="py-12 text-center text-slate-500 italic"><Clock size={32} className="mx-auto mb-3 opacity-20" /><p className="text-xs">No active medicines</p></div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {activeTab === 'input' && (
                <motion.div key="input" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto backdrop-blur-3xl">
                    <div className="glass-card p-10 bg-white">
                        <h2 className="text-3xl font-black text-slate-900 mb-8 p-1">Add Health Info (महिती भरा)</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div className="space-y-4">
                                <div><label className="text-xs font-bold text-slate-500 uppercase">Body Temperature (°F)</label><input type="number" step="0.1" required className="w-full mt-2 bg-slate-50 border-2 border-slate-100 rounded-xl py-3 px-4 outline-none focus:border-primary-500" value={vitals.temperature} onChange={(e) => setVitals({...vitals, temperature: e.target.value})} /></div>
                                <div><label className="text-xs font-bold text-slate-500 uppercase">Heart Rate (BPM)</label><input type="number" required className="w-full mt-2 bg-slate-50 border-2 border-slate-100 rounded-xl py-3 px-4 outline-none focus:border-red-500" value={vitals.heartbeat} onChange={(e) => setVitals({...vitals, heartbeat: e.target.value})} /></div>
                                <div><label className="text-xs font-bold text-slate-500 uppercase">Sugar Level (mg/dL)</label><input type="number" required className="w-full mt-2 bg-slate-50 border-2 border-slate-100 rounded-xl py-3 px-4 outline-none focus:border-blue-500" value={vitals.sugarLevel} onChange={(e) => setVitals({...vitals, sugarLevel: e.target.value})} /></div>
                                <div><label className="text-xs font-bold text-slate-500 uppercase">Blood Pressure (Simple e.g. 120/80)</label><input type="text" className="w-full mt-2 bg-slate-50 border-2 border-slate-100 rounded-xl py-3 px-4 outline-none focus:border-purple-500" value={vitals.bloodPressure} onChange={(e) => setVitals({...vitals, bloodPressure: e.target.value})} /></div>
                             </div>
                             <div className="space-y-4">
                                <div><label className="text-xs font-bold text-slate-500 uppercase">Oxygen Level (%)</label><input type="number" className="w-full mt-2 bg-slate-50 border-2 border-slate-100 rounded-xl py-3 px-4 outline-none focus:border-emerald-500" value={vitals.oxygenLevel} onChange={(e) => setVitals({...vitals, oxygenLevel: e.target.value})} /></div>
                                <div><label className="text-xs font-bold text-slate-500 uppercase">Body Weight (kg)</label><input type="number" className="w-full mt-2 bg-slate-50 border-2 border-slate-100 rounded-xl py-3 px-4 outline-none focus:border-amber-500" value={vitals.weight} onChange={(e) => setVitals({...vitals, weight: e.target.value})} /></div>
                                <div><label className="text-xs font-bold text-slate-500 uppercase">Sleep Time (hours)</label><input type="number" className="w-full mt-2 bg-slate-50 border-2 border-slate-100 rounded-xl py-3 px-4 outline-none focus:border-indigo-500" value={vitals.sleepHours} onChange={(e) => setVitals({...vitals, sleepHours: e.target.value})} /></div>
                                <div className="pt-6"><button type="submit" disabled={isLoading} className="w-full btn-primary py-4 font-black shadow-xl h-[60px]">{isLoading ? "..." : "Submit Daily Info"}</button></div>
                             </div>
                        </form>
                    </div>
                </motion.div>
            )}

            {activeTab === 'meds' && (
                <motion.div key="meds" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {medicines.map((med) => (
                        <div key={med._id} className="glass-card p-6 bg-white overflow-hidden group">
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all"><Pill size={28} /></div>
                                <div className="text-right"><div className="text-[10px] font-black uppercase text-slate-400 mb-1">Time</div><div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-700 font-mono"><Clock size={12} /> {med.reminderTime}</div></div>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-1">{med.medicineName}</h3>
                            <div className="text-slate-500 text-sm font-medium mb-6 font-bold">{med.dosage} • {med.duration}</div>
                            <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest bg-primary-50 px-2 py-0.5 rounded">Active Medicine</span>
                        </div>
                    ))}
                    {medicines.length === 0 && (
                        <div className="col-span-full py-20 text-center glass-card"><Bell size={48} className="mx-auto text-slate-200 mb-4" /><h4 className="text-lg font-bold text-slate-400">No prescriptions.</h4></div>
                    )}
                </motion.div>
            )}

            {activeTab === 'history' && (
                <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="glass-card overflow-hidden bg-white">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-400">
                                <tr><th className="px-6 py-4">Date & Time</th><th className="px-6 py-4">Temp</th><th className="px-6 py-4">Heart</th><th className="px-6 py-4">Sugar</th><th className="px-6 py-4">Status</th></tr>
                            </thead>
                            <tbody>
                                {history.map((h) => (
                                    <tr key={h._id} className="border-t border-slate-50 text-sm font-bold text-slate-700">
                                        <td className="px-6 py-4">{new Date(h.date).toLocaleDateString()} {new Date(h.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                        <td className="px-6 py-4">{h.temperature}°F</td>
                                        <td className="px-6 py-4">{h.heartbeat}</td>
                                        <td className="px-6 py-4">{h.sugarLevel}</td>
                                        <td className="px-6 py-4 text-green-500 uppercase tracking-widest">Normal</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}

            {activeTab === 'profile' && (
                <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="glass-card p-10 bg-white">
                            <h3 className="text-2xl font-black mb-8 border-b border-slate-50 pb-4">Personal Details</h3>
                            <div className="grid grid-cols-2 gap-8">
                                <div><label className="text-[10px] font-black text-slate-400 uppercase">Blood Group</label><p className="text-xl font-black text-primary-600">{profile.bloodGroup || '-'}</p></div>
                                <div><label className="text-[10px] font-black text-slate-400 uppercase">Age / Gender</label><p className="text-xl font-bold text-slate-700">{profile.age || '-'} yrs • {profile.gender || '-'}</p></div>
                                <div className="col-span-2"><label className="text-[10px] font-black text-slate-400 uppercase">Home Address</label><p className="text-slate-600 font-bold leading-relaxed">{profile.address || '-'}</p></div>
                                <div><label className="text-[10px] font-black text-slate-400 uppercase">Height (cm)</label><p className="text-xl font-bold text-slate-700">{profile.height || '-'}</p></div>
                                <div><label className="text-[10px] font-black text-slate-400 uppercase">Contact</label><p className="text-xl font-bold text-slate-700">{profile.contact || '-'}</p></div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="glass-card p-6 border-l-4 border-l-red-500 bg-white shadow-xl">
                            <h3 className="font-black text-xl mb-6 flex items-center gap-2 text-red-500 font-bold"><AlertCircle size={22} /> Emergency Help</h3>
                            <div className="space-y-4">
                                <div><label className="text-[10px] font-black text-slate-400 uppercase">Contact Person</label><p className="font-bold text-slate-700">{profile.emergencyName || 'Not added'}</p></div>
                                <div><label className="text-[10px] font-black text-slate-400 uppercase">Emergency Phone</label><p className="font-bold text-slate-700 font-mono">{profile.emergencyPhone || 'Not added'}</p></div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        <AnimatePresence>
            {activeReminder && (
                <div className="fixed bottom-8 right-8 z-[200] w-full max-w-sm">
                    <motion.div initial={{ x: 100 }} animate={{ x: 0 }} exit={{ x: 100 }} className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl border border-white/10 ring-1 ring-white/10 ring-inset">
                        <div className="flex items-start justify-between mb-6">
                            <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20"><Pill size={24} /></div>
                            <button onClick={() => setActiveReminder(null)} className="text-slate-500 hover:text-white transition-colors">✕</button>
                        </div>
                        <h3 className="text-2xl font-black mb-2 leading-tight">Medicine Alert</h3>
                        <p className="text-slate-400 mb-8 leading-relaxed italic">Take your dosage of <b>{activeReminder.medicineName}</b> ({activeReminder.dosage}) in next 5 minutes.</p>
                        <button onClick={() => setActiveReminder(null)} className="w-full bg-primary-600 py-4 rounded-2xl font-black text-sm shadow-xl shadow-primary-500/20 hover:bg-primary-500 transition-all">I'll take it now</button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default PatientDashboard;
