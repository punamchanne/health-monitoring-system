import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import CaretakerDashboard from './pages/CaretakerDashboard';
import PatientDashboard from './pages/PatientDashboard';
import Navbar from './components/Navbar';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

const NavigationWrapper = ({ children }) => {
  const location = useLocation();
  const isDashboard = location.pathname.includes('dashboard');

  return (
    <div className="min-h-screen flex flex-col">
      {!isDashboard && <Navbar />}
      <main className={`flex-grow ${!isDashboard ? 'pt-20' : ''}`}>
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavigationWrapper>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/caretaker-dashboard/*" 
              element={
                <ProtectedRoute role="caretaker">
                  <CaretakerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/patient-dashboard/*" 
              element={
                <ProtectedRoute role="patient">
                  <PatientDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </NavigationWrapper>
      </Router>
    </AuthProvider>
  );
}

export default App;
