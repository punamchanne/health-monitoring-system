import { useState, useEffect } from 'react';
import api from '../api';
import HealthChart from '../components/HealthChart';
import { 
  Users, UserPlus, Activity, Bell, ClipboardList, 
  Thermometer, Heart, Droplets, Clock, Send, 
  Search, Filter, ChevronRight, AlertCircle, 
  LayoutDashboard, LogOut, User as UserIcon,
  Calendar, CheckCircle2, MoreVertical, ShieldCheck, 
  XCircle, Mail, TrendingUp, ChevronLeft, MapPin, 
  Phone, Smartphone, Pill, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [stats, setStats] = useState({ totalPatients: 0, pendingApprovals: 0, criticalAlerts: 0 });
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientData, setPatientData] = useState([]);
  const [patientPrescriptions, setPatientPrescriptions] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPrescribeModal, setShowPrescribeModal] = useState(false);
  const [newPatient, setNewPatient] = useState({ patientEmail: '', age: '', gender: '', contact: '' });
  const [newPrescription, setNewPrescription] = useState({ medicineName: '', reminderTime: '', duration: '', dosage: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'pending'
  const [detailTab, setDetailTab] = useState('history'); // 'history', 'prescription'

  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
    fetchAlerts();
    fetchPendingApprovals();
    fetchStats();

    const interval = setInterval(() => {
      fetchPatients();
      fetchAlerts();
      fetchPendingApprovals();
      fetchStats();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/doctor/dashboard-stats');
      setStats(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await api.get('/doctor/patients');
      setPatients(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await api.get('/doctor/alerts');
      setAlerts(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPendingApprovals = async () => {
    try {
      const response = await api.get('/doctor/pending-approvals');
      setPendingUsers(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await api.post(`/doctor/approve-user/${userId}`);
      fetchPendingApprovals();
      fetchStats();
      alert('User approved successfully!');
    } catch (err) {
      alert('Failed to approve user');
    }
  };

  const handlePatientSelect = async (patient) => {
    setSelectedPatient(patient);
    setDetailTab('history');
    try {
      const [dataRes, presRes] = await Promise.all([
        api.get(`/doctor/patient-data/${patient.patientId._id}`),
        api.get(`/doctor/patient-prescriptions/${patient.patientId._id}`)
      ]);
      setPatientData(dataRes.data);
      setPatientPrescriptions(presRes.data);
      setActiveTab('overview'); 
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    try {
      await api.post('/doctor/add-patient', newPatient);
      setShowAddModal(false);
      fetchPatients();
      setNewPatient({ patientEmail: '', age: '', gender: '', contact: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add patient');
    }
  };

  const handlePrescribe = async (e) => {
    e.preventDefault();
    try {
      await api.post('/doctor/prescribe', {
        ...newPrescription,
        patientId: selectedPatient.patientId._id
      });
      setShowPrescribeModal(false);
      // Refresh prescriptions
      const presRes = await api.get(`/doctor/patient-prescriptions/${selectedPatient.patientId._id}`);
      setPatientPrescriptions(presRes.data);
      setNewPrescription({ medicineName: '', reminderTime: '', duration: '', dosage: '' });
      alert('Prescription added successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to prescribe medicine');
    }
  };

  const filteredPatients = patients.filter(p => 
    p.patientId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.patientId.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans text-slate-900">
      {/* Sidebar - Desktop Only */}
      <aside className="hidden md:flex flex-col w-[280px] bg-white border-r border-slate-100 p-8 sticky top-0 h-screen overflow-y-auto">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-200">
            <Activity className="text-white" size={24} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-black text-slate-800 tracking-tight">Smart<span className="text-primary-600">Health</span></span>
        </div>

        <nav className="space-y-2 mb-auto">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-4">Management</h2>
          <button 
            onClick={() => { setSelectedPatient(null); setActiveTab('overview'); }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${activeTab === 'overview' && !selectedPatient ? 'bg-primary-600 text-white shadow-xl shadow-primary-100 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <LayoutDashboard size={20} />
            <span>Overview</span>
          </button>
          <button 
            onClick={() => { setSelectedPatient(null); setActiveTab('pending'); }}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 ${activeTab === 'pending' ? 'bg-primary-600 text-white shadow-xl shadow-primary-100 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <div className="flex items-center gap-3">
              <ShieldCheck size={20} />
              <span>Approvals</span>
            </div>
            {pendingUsers.length > 0 && (
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${activeTab === 'pending' ? 'bg-white text-primary-600' : 'bg-primary-600 text-white'}`}>{pendingUsers.length}</span>
            )}
          </button>

          <div className="pt-10">
            <div className="flex items-center justify-between px-4 mb-4">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Patients</h2>
              <button 
                onClick={() => setShowAddModal(true)}
                className="w-7 h-7 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 hover:bg-primary-600 hover:text-white transition-all shadow-sm"
              >
                <UserPlus size={14} />
              </button>
            </div>
            <div className="space-y-1 max-h-[350px] overflow-y-auto px-1">
              {filteredPatients.map((p) => (
                <button
                  key={p._id}
                  onClick={() => handlePatientSelect(p)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all text-sm group ${
                    selectedPatient?._id === p._id 
                    ? 'bg-slate-900 text-white font-bold shadow-lg' 
                    : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-[10px] flex-shrink-0 transition-all ${
                    selectedPatient?._id === p._id ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-primary-100 group-hover:text-primary-600'
                  }`}>
                    {p.patientId.name.charAt(0)}
                  </div>
                  <div className="flex-1 text-left truncate">{p.patientId.name}</div>
                  {selectedPatient?._id === p._id && <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />}
                </button>
              ))}
            </div>
          </div>
        </nav>

        <div className="pt-8 border-t border-slate-100">
          <div className="flex items-center gap-3 px-4 mb-6">
             <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <UserIcon size={20} strokeWidth={2.5} />
             </div>
             <div className="overflow-hidden">
                <div className="text-sm font-black text-slate-800 truncate">{user?.name}</div>
                <div className="text-[9px] font-black text-primary-600 uppercase tracking-tighter">Clinical Specialist</div>
             </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-red-500 hover:bg-red-50 rounded-2xl transition-all font-black text-sm"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto max-h-screen bg-[#F8FAFC]">
        {/* Navigation / Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50 px-8 py-4 flex items-center justify-between">
           <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">Health Monitoring System</div>
              <h2 className="text-xl font-black text-slate-900">Clinical Dashboard</h2>
           </div>
           <div className="flex items-center gap-4">
              <div className="relative group hidden sm:block">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={16} />
                 <input 
                   type="text" placeholder="Quick Patient Search" 
                   className="bg-slate-50 border-none rounded-xl py-2 pl-10 pr-4 text-xs font-bold w-[250px] focus:ring-2 focus:ring-primary-500/10 transition-all"
                   value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>
              <button className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-500 hover:text-primary-600 transition-all relative">
                 <Bell size={20} />
                 {alerts.length > 0 && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse" />}
              </button>
           </div>
        </header>

        <div className="p-8 pb-32">
          <AnimatePresence mode="wait">
            {activeTab === 'pending' ? (
              <motion.div 
                key="pending" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="max-w-6xl mx-auto"
              >
                <div className="mb-10">
                   <h1 className="text-4xl font-black text-slate-900 leading-none mb-3">Verification Center</h1>
                   <p className="text-slate-500 text-lg font-medium tracking-tight">Review new registration requests to ensure system security.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {pendingUsers.map((u) => (
                    <div key={u._id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 group hover:shadow-xl hover:shadow-primary-600/5 transition-all duration-500">
                      <div className="flex items-center gap-5 mb-8">
                        <div className="w-16 h-16 bg-slate-50 text-slate-900 rounded-[1.5rem] flex items-center justify-center text-2xl font-black group-hover:bg-primary-600 group-hover:text-white transition-all duration-500 shadow-inner">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                           <div className="text-xl font-black text-slate-900 mb-0.5">{u.name}</div>
                           <div className="text-xs font-bold text-slate-400 group-hover:text-primary-600 transition-colors">{u.email}</div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <button 
                          onClick={() => handleApprove(u._id)}
                          className="w-full bg-slate-900 text-white py-4 rounded-[1.25rem] font-bold text-sm hover:bg-primary-600 transition-all shadow-lg hover:shadow-primary-200"
                        >
                          Approve Registration
                        </button>
                        <button className="w-full bg-red-50 text-red-500 py-4 rounded-[1.25rem] font-bold text-sm hover:bg-red-500 hover:text-white transition-all">
                          Decline Request
                        </button>
                      </div>
                    </div>
                  ))}
                  {pendingUsers.length === 0 && (
                    <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                       <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                          <ShieldCheck size={40} className="text-slate-300" />
                       </div>
                       <h3 className="text-2xl font-black text-slate-900 mb-2">Queue is Empty</h3>
                       <p className="text-slate-400 font-bold">All pending verifications have been processed.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : !selectedPatient ? (
              <motion.div 
                key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="max-w-7xl mx-auto"
              >
                {/* Hero Stats */}
                <div className="flex flex-col lg:flex-row gap-6 mb-12">
                   <div className="flex-1 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex items-center gap-8 group hover:border-primary-200 transition-all overflow-hidden relative">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/5 rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700" />
                      <div className="w-16 h-16 bg-primary-100 rounded-3xl flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-500">
                        <Users size={32} />
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">System Capacity</div>
                        <div className="text-4xl font-black text-slate-900 leading-none">{stats.totalPatients}</div>
                        <div className="text-[10px] font-bold text-green-500 mt-2 flex items-center gap-1">
                           <TrendingUp size={12} /> +12% from last month
                        </div>
                      </div>
                   </div>

                   <div className="flex-1 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex items-center gap-8 group hover:border-red-200 transition-all overflow-hidden relative">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full translate-x-10 -translate-y-10" />
                      <div className="w-16 h-16 bg-red-100 rounded-3xl flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all">
                        <Bell size={32} />
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">High Risk Cases</div>
                        <div className="text-4xl font-black text-slate-900 leading-none">{alerts.length}</div>
                        <div className="text-[10px] font-bold text-slate-400 mt-2">Active critical anomalies</div>
                      </div>
                   </div>

                   <div className="flex-1 bg-slate-900 p-8 rounded-[3rem] shadow-2xl flex items-center gap-8 group cursor-pointer hover:bg-primary-950 transition-all" onClick={() => setActiveTab('pending')}>
                      <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center text-white group-hover:bg-white/20 transition-all">
                        <ShieldCheck size={32} />
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Queue Requests</div>
                        <div className="text-4xl font-black text-white leading-none">{pendingUsers.length}</div>
                        <div className="text-[10px] font-bold text-primary-400 mt-2">Click to review profiles</div>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                   {/* Main Patient List Table */}
                   <div className="xl:col-span-2 space-y-8">
                     <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                           <div>
                              <h3 className="text-2xl font-black text-slate-900">Assigned Patients</h3>
                              <p className="text-slate-400 text-xs font-bold mt-1">Directly managed by your clinical team.</p>
                           </div>
                           <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-primary-100 hover:scale-105 transition-all">
                              <UserPlus size={18} />
                              Add Patient
                           </button>
                        </div>
                        <div className="overflow-x-auto">
                           <table className="w-full text-left">
                              <thead className="bg-[#FBFCFE] text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                 <tr>
                                    <th className="px-10 py-5">Managed Profile</th>
                                    <th className="px-10 py-5">Biometrics</th>
                                    <th className="px-10 py-5 text-right">Access</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-50">
                                 {filteredPatients.map((p) => (
                                    <tr key={p._id} className="hover:bg-[#F8FAFF]/50 transition-colors group">
                                       <td className="px-10 py-6">
                                          <div className="flex items-center gap-4">
                                             <div className="w-12 h-12 rounded-[1.25rem] bg-slate-50 text-slate-900 flex items-center justify-center font-black transition-all group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white">
                                                {p.patientId.name.charAt(0)}
                                             </div>
                                             <div>
                                                <div className="font-black text-slate-900 group-hover:text-primary-600 transition-colors">{p.patientId.name}</div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{p.patientId.email}</div>
                                             </div>
                                          </div>
                                       </td>
                                       <td className="px-10 py-6">
                                          <div className="flex items-center gap-4">
                                             <div className="px-3 py-1.5 bg-slate-50 rounded-xl text-xs font-black text-slate-600 border border-slate-100">{p.age}y</div>
                                             <div className="px-3 py-1.5 bg-slate-50 rounded-xl text-xs font-black text-slate-600 border border-slate-100">{p.gender}</div>
                                          </div>
                                       </td>
                                       <td className="px-10 py-6 text-right">
                                          <button 
                                             onClick={() => handlePatientSelect(p)}
                                             className="inline-flex items-center gap-2 bg-white border-2 border-slate-100 text-slate-800 px-5 py-2.5 rounded-2xl font-black text-xs hover:border-primary-600 hover:text-primary-600 transition-all shadow-sm"
                                          >
                                             Analytics & RX
                                             <ChevronRight size={14} />
                                          </button>
                                       </td>
                                    </tr>
                                 ))}
                                 {filteredPatients.length === 0 && (
                                    <tr>
                                       <td colSpan="3" className="py-24 text-center">
                                          <Users size={48} className="mx-auto text-slate-100 mb-4" />
                                          <p className="text-slate-400 font-bold">No linked patients found.</p>
                                       </td>
                                    </tr>
                                 )}
                              </tbody>
                           </table>
                        </div>
                     </div>
                   </div>

                   {/* Secondary Analytics Sidebar */}
                   <div className="space-y-8">
                     <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                           <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                              <Bell size={20} className="text-red-500" />
                              Emergency Queue
                           </h3>
                           <button className="text-[10px] font-black text-primary-600 uppercase tracking-widest hover:underline">Clear All</button>
                        </div>
                        <div className="space-y-4">
                           {alerts.slice(0, 4).length === 0 ? (
                             <p className="text-center py-10 text-slate-400 font-bold italic">No critical anomalies.</p>
                           ) : (
                             alerts.slice(0, 4).map((alert) => (
                               <div key={alert._id} className="p-5 bg-[#FFF8F8] border border-red-50 rounded-[1.75rem] flex items-start gap-4 hover:scale-[1.02] transition-transform cursor-pointer" onClick={() => handlePatientSelect({ patientId: alert.patientId, _id: 'temp' })}>
                                  <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 flex-shrink-0">
                                     <AlertCircle size={20} />
                                  </div>
                                  <div className="flex-1 overflow-hidden">
                                     <div className="text-xs font-black text-slate-900 truncate mb-1">{alert.patientId?.name || "Patient"}</div>
                                     <div className="text-[10px] font-bold text-red-700 leading-tight uppercase tracking-tight">{alert.message}</div>
                                  </div>
                               </div>
                             ))
                           )}
                        </div>
                        {alerts.length > 4 && (
                          <button className="w-full mt-6 py-4 bg-slate-50 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-100 transition-colors">See all {alerts.length} Warnings</button>
                        )}
                     </div>

                     <div className="bg-gradient-to-br from-indigo-600 to-primary-700 rounded-[3rem] p-8 text-white shadow-xl shadow-primary-200">
                        <Activity className="text-white/40 mb-6" size={40} />
                        <h4 className="text-2xl font-black leading-tight mb-3">Clinician AI Support</h4>
                        <p className="text-indigo-100 text-sm font-medium leading-relaxed mb-8">System is active and monitoring real-time bio-data streams. Abnormalities will flag immediately.</p>
                        <button className="w-full bg-white text-primary-600 py-3.5 rounded-2xl font-black text-sm hover:bg-indigo-50 transition-all">Support Center</button>
                     </div>
                   </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                 key="detail" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                 className="max-w-7xl mx-auto"
              >
                {/* Detail Header / Nav */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
                   <div className="flex items-center gap-6">
                      <button 
                        onClick={() => setSelectedPatient(null)}
                        className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-900 hover:border-primary-600 hover:text-primary-600 transition-all shadow-sm"
                      >
                         <ChevronLeft size={24} />
                      </button>
                      <div className="flex items-center gap-5">
                         <div className="w-16 h-16 bg-slate-900 rounded-[1.75rem] flex items-center justify-center text-2xl font-black text-white shadow-xl">
                            {selectedPatient.patientId.name.charAt(0)}
                         </div>
                         <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-1">{selectedPatient.patientId.name}</h1>
                            <div className="flex items-center gap-4 text-slate-400">
                               <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest"><Calendar size={12} /> {selectedPatient.age} yrs</div>
                               <div className="w-1 h-1 rounded-full bg-slate-300" />
                               <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest"><Users size={12} /> {selectedPatient.gender}</div>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="flex items-center gap-3">
                      <button 
                         onClick={() => setShowPrescribeModal(true)}
                         className="flex items-center gap-2 bg-primary-600 text-white px-8 py-3.5 rounded-2xl font-black text-sm shadow-xl shadow-primary-100 hover:scale-105 active:scale-95 transition-all"
                      >
                         <Pill size={20} />
                         Generate Prescription
                      </button>
                      <button className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm">
                         <MoreVertical size={24} />
                      </button>
                   </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                   {/* Left Column - Main Details */}
                   <div className="lg:col-span-3 space-y-10">
                      {/* Interactive Visualizer */}
                      <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden group">
                         <div className="flex items-center justify-between mb-10 relative z-10">
                            <div>
                               <h3 className="text-2xl font-black text-slate-900">Physiological Trends</h3>
                               <p className="text-slate-400 text-xs font-bold mt-1">Real-time biological monitoring overview.</p>
                            </div>
                            <div className="flex bg-slate-50 p-1.5 rounded-2xl gap-1">
                               {['history', 'rx'].map((t) => (
                                 <button 
                                   key={t} onClick={() => setDetailTab(t === 'history' ? 'history' : 'prescription')}
                                   className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                     (t === 'history' && detailTab === 'history') || (t === 'rx' && detailTab === 'prescription')
                                     ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-400'
                                   }`}
                                 >
                                   {t === 'history' ? 'Bio-Logs' : 'Medications'}
                                 </button>
                               ))}
                            </div>
                         </div>

                         {detailTab === 'history' ? (
                           <div className="space-y-10">
                              <div className="h-[350px]">
                                 <HealthChart data={patientData} />
                              </div>

                              <div className="overflow-x-auto pt-6 border-t border-slate-50">
                                 <table className="w-full text-left">
                                    <thead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                       <tr>
                                          <th className="px-4 py-4">Snapshot</th>
                                          <th className="px-4 py-4">Temp (°F)</th>
                                          <th className="px-4 py-4">Bio-Heart</th>
                                          <th className="px-4 py-4">Sugar</th>
                                          <th className="px-4 py-4">B.P.</th>
                                          <th className="px-4 py-4 text-right">Diagnosis</th>
                                       </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                       {patientData.map((data) => {
                                          const isAbnormal = data.temperature > 99 || data.heartbeat > 100 || data.sugarLevel > 140;
                                          return (
                                             <tr key={data._id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-4 py-5">
                                                   <div className="text-sm font-black text-slate-900 leading-none mb-1">{new Date(data.date).toLocaleDateString()}</div>
                                                   <div className="text-[9px] font-black text-slate-400 uppercase">{new Date(data.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                </td>
                                                <td className={`px-4 py-5 text-sm font-black ${data.temperature > 99 ? 'text-red-500' : 'text-slate-700'}`}>{data.temperature}</td>
                                                <td className={`px-4 py-5 text-sm font-black ${data.heartbeat > 100 ? 'text-red-500' : 'text-slate-700'}`}>{data.heartbeat}</td>
                                                <td className={`px-4 py-5 text-sm font-black ${data.sugarLevel > 140 ? 'text-red-500' : 'text-slate-700'}`}>{data.sugarLevel}</td>
                                                <td className="px-4 py-5 text-sm font-bold text-slate-500">{data.bloodPressure || '-'}</td>
                                                <td className="px-4 py-5 text-right">
                                                   <span className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${isAbnormal ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                                      {isAbnormal ? 'Flagged anomaly' : 'Static stable'}
                                                   </span>
                                                </td>
                                             </tr>
                                          )
                                       })}
                                    </tbody>
                                 </table>
                              </div>
                           </div>
                         ) : (
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
                             {patientPrescriptions.map((p) => (
                               <div key={p._id} className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6 relative group/med overflow-hidden">
                                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary-600/5 rounded-full translate-x-10 -translate-y-10 group-hover/med:scale-150 transition-transform" />
                                  <div className="flex items-start justify-between mb-6 relative z-10">
                                     <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-600 shadow-sm">
                                        <Pill size={24} />
                                     </div>
                                     <div className="text-right">
                                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Time Set</div>
                                        <div className="bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg">{p.reminderTime}</div>
                                     </div>
                                  </div>
                                  <div className="relative z-10">
                                     <h4 className="text-xl font-black text-slate-900 mb-1">{p.medicineName}</h4>
                                     <p className="text-slate-500 text-sm font-bold mb-6">{p.dosage} • {p.duration}</p>
                                     <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${p.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'}`}>
                                           {p.status}
                                        </span>
                                        <div className="flex-1" />
                                        <button className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                                     </div>
                                  </div>
                               </div>
                             ))}
                             {patientPrescriptions.length === 0 && (
                               <div className="col-span-full py-20 text-center text-slate-400 font-bold italic border-2 border-dashed border-slate-100 rounded-[2rem]">No active prescriptions on file.</div>
                             )}
                           </div>
                         )}
                      </div>
                   </div>

                   {/* Right Column - Profile Summary */}
                   <div className="space-y-8">
                      <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm space-y-8 overflow-hidden relative group">
                         <div className="absolute bottom-0 right-0 w-40 h-40 bg-indigo-600/5 rounded-full translate-x-20 translate-y-20 group-hover:scale-150 transition-transform duration-1000" />
                         <h3 className="text-xl font-black text-slate-900 border-b border-slate-50 pb-4">Clinical File</h3>
                         
                         <div className="space-y-6 relative z-10">
                            <div className="flex items-start gap-4">
                               <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
                                  <Mail size={18} />
                               </div>
                               <div className="overflow-hidden">
                                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Digital Mail</label>
                                  <div className="text-sm font-black text-slate-800 truncate">{selectedPatient.patientId.email}</div>
                               </div>
                            </div>

                            <div className="flex items-start gap-4">
                               <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
                                  <Smartphone size={18} />
                               </div>
                               <div>
                                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Mobile Link</label>
                                  <div className="text-sm font-black text-slate-800">{selectedPatient.contact || "Not Configured"}</div>
                               </div>
                            </div>

                            <div className="flex items-start gap-4">
                               <div className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shadow-inner">
                                  <MapPin size={18} />
                               </div>
                               <div>
                                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Home Residency</label>
                                  <div className="text-sm font-black text-slate-800 leading-tight">{selectedPatient.address || "No address on file"}</div>
                               </div>
                            </div>
                         </div>
                      </div>

                      <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm border-l-8 border-l-red-500 overflow-hidden relative group">
                         <div className="absolute top-0 right-0 p-4 opacity-5 translate-x-5 -translate-y-5 rotate-12 group-hover:rotate-0 group-hover:opacity-10 transition-all duration-700">
                            <AlertCircle size={100} />
                         </div>
                         <h3 className="text-xl font-black text-red-500 mb-6 flex items-center gap-2">
                             Emergency Line
                         </h3>
                         <div className="space-y-6 relative z-10">
                            <div>
                               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Primary Contact</label>
                               <div className="text-lg font-black text-slate-900">{selectedPatient.emergencyName || "NOT SET"}</div>
                            </div>
                            <div>
                               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Hotline Number</label>
                               <div className="text-xl font-black text-red-600 font-mono tracking-tighter">{selectedPatient.emergencyPhone || "NOT SET"}</div>
                            </div>
                         </div>
                         <div className="mt-8 pt-6 border-t border-slate-50 italic text-[10px] font-black text-slate-400 uppercase leading-relaxed text-center tracking-tighter">Clinical Alert Priority: High</div>
                      </div>

                      <button className="w-full bg-[#1A1F2D] text-white py-6 rounded-[2.5rem] font-black text-sm shadow-2xl shadow-slate-200 hover:bg-slate-800 active:scale-95 transition-all">
                        Compile PDF Report
                      </button>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Add Patient Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10 overflow-y-auto bg-slate-900/40 backdrop-blur-xl">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }} className="relative w-full max-w-[550px] bg-white rounded-[3.5rem] p-12 shadow-2xl border border-slate-100">
              <div className="absolute top-8 right-8 text-primary-600/10"><UserPlus size={100} /></div>
              <div className="mb-10 relative z-10">
                 <h2 className="text-4xl font-black text-slate-900 leading-none mb-3">Link Patient</h2>
                 <p className="text-slate-500 font-bold">Register a new profile to your clinical database.</p>
              </div>
              
              <form onSubmit={handleAddPatient} className="space-y-6 relative z-10">
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Network Identity</label>
                   <input 
                      type="email" required placeholder="patient@healthcare.com" 
                      className="w-full bg-[#F8FAFC] border-2 border-transparent focus:border-primary-600 focus:bg-white rounded-2xl py-4 px-6 outline-none font-bold text-slate-800 transition-all shadow-inner" 
                      value={newPatient.patientEmail} onChange={(e) => setNewPatient({ ...newPatient, patientEmail: e.target.value })} 
                   />
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Patient Age</label>
                       <input 
                         type="number" required placeholder="00" 
                         className="w-full bg-[#F8FAFC] border-2 border-transparent focus:border-primary-600 focus:bg-white rounded-2xl py-4 px-6 outline-none font-bold text-slate-800 transition-all shadow-inner" 
                         value={newPatient.age} onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })} 
                       />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Identity Gender</label>
                       <select 
                         className="w-full bg-[#F8FAFC] border-2 border-transparent focus:border-primary-600 focus:bg-white rounded-2xl py-4 px-6 outline-none font-bold text-slate-800 transition-all shadow-inner appearance-none cursor-pointer" 
                         value={newPatient.gender} onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                       >
                         <option value="">Select</option>
                         <option value="Male">Male Profile</option>
                         <option value="Female">Female Profile</option>
                         <option value="Non-Binary">Non-Binary</option>
                       </select>
                    </div>
                </div>
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Emergency Mobile</label>
                   <input 
                      type="text" required placeholder="+1 000 000 0000" 
                      className="w-full bg-[#F8FAFC] border-2 border-transparent focus:border-primary-600 focus:bg-white rounded-2xl py-4 px-6 outline-none font-bold text-slate-800 transition-all shadow-inner" 
                      value={newPatient.contact} onChange={(e) => setNewPatient({ ...newPatient, contact: e.target.value })} 
                   />
                </div>
                <div className="flex gap-4 pt-8">
                   <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-5 rounded-2xl font-black text-slate-500 hover:bg-slate-50 transition-all">Cancel</button>
                   <button type="submit" className="flex-2 bg-slate-900 text-white px-10 py-5 rounded-[1.5rem] font-black text-sm shadow-xl shadow-slate-200 hover:bg-primary-600 transition-all">Create Profile</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Prescription Modal */}
      <AnimatePresence>
        {showPrescribeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10 overflow-y-auto bg-slate-900/40 backdrop-blur-xl">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPrescribeModal(false)} className="absolute inset-0" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }} className="relative w-full max-w-[550px] bg-white rounded-[3.5rem] p-12 shadow-2xl border border-slate-100">
               <div className="mb-10 relative z-10">
                 <div className="inline-flex py-1.5 px-4 bg-primary-50 rounded-full text-[10px] font-black text-primary-600 uppercase tracking-[0.2em] mb-4 border border-primary-100">Medical Prescription (RX)</div>
                 <h2 className="text-4xl font-black text-slate-900 leading-none mb-2">Drafting Medication</h2>
                 <p className="text-slate-500 font-bold italic">Configuring plan for: {selectedPatient?.patientId?.name}</p>
              </div>

              <form onSubmit={handlePrescribe} className="space-y-6 relative z-10">
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Medicine Nomenclature</label>
                   <input 
                      type="text" required placeholder="e.g. Lipitor 20mg" 
                      className="w-full bg-[#F8FAFC] border-2 border-transparent focus:border-primary-600 focus:bg-white rounded-2xl py-4 px-6 outline-none font-black text-slate-800 transition-all shadow-inner" 
                      value={newPrescription.medicineName} onChange={(e) => setNewPrescription({ ...newPrescription, medicineName: e.target.value })} 
                   />
                </div>
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Specific Dosage Instruction</label>
                   <input 
                      type="text" required placeholder="e.g. One tablet after breakfast" 
                      className="w-full bg-[#F8FAFC] border-2 border-transparent focus:border-primary-600 focus:bg-white rounded-2xl py-4 px-6 outline-none font-bold text-slate-800 transition-all shadow-inner" 
                      value={newPrescription.dosage} onChange={(e) => setNewPrescription({ ...newPrescription, dosage: e.target.value })} 
                   />
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Cron-Time (Daily)</label>
                       <input 
                         type="time" required 
                         className="w-full bg-[#F8FAFC] border-2 border-transparent focus:border-primary-600 focus:bg-white rounded-2xl py-4 px-6 outline-none font-black text-slate-800 transition-all shadow-inner" 
                         value={newPrescription.reminderTime} onChange={(e) => setNewPrescription({ ...newPrescription, reminderTime: e.target.value })} 
                       />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Plan Duration</label>
                       <input 
                         type="text" required placeholder="e.g. 14 Days" 
                         className="w-full bg-[#F8FAFC] border-2 border-transparent focus:border-primary-600 focus:bg-white rounded-2xl py-4 px-6 outline-none font-bold text-slate-800 transition-all shadow-inner" 
                         value={newPrescription.duration} onChange={(e) => setNewPrescription({ ...newPrescription, duration: e.target.value })} 
                       />
                    </div>
                </div>
                <div className="flex gap-4 pt-8">
                   <button type="button" onClick={() => setShowPrescribeModal(false)} className="flex-1 py-5 rounded-2xl font-black text-slate-500 hover:bg-slate-50 transition-all uppercase tracking-widest text-[10px]">Abandon</button>
                   <button type="submit" className="flex-2 bg-primary-600 text-white px-10 py-5 rounded-[1.5rem] font-black text-sm shadow-2xl shadow-primary-200 hover:bg-slate-900 transition-all uppercase tracking-wider">Authorize RX</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DoctorDashboard;
