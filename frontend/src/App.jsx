import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import CounselorDashboard from './pages/CounselorDashboard';
import AdminDashboard from './pages/AdminDashboard'; // Will create this next
import { useAuth } from './context/AuthContext';

// Placeholders for dashboards
// Admin dashboard still pending, so let's keep it imported or placeholder if not created.
// Actually I will import it, assuming I create it next step. If not, it will fail build.
// I should better comment it out or create it right after. 
// I'll create a placeholder AdminDashboard for now inside App.jsx or just create the file in next tool call.
// Let's create the file in next tool call. I'll stick to import.

const NotFound = () => <div className="text-center mt-20 text-2xl">404 - Page Not Found</div>;

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role) && user.role !== 'admin') {
    // Admin might access everything? Or explicit roles.
    // My Logic: 'admin', 'counselor', 'student'.
    if (!allowedRoles.includes(user.role)) return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard defaultTab="my-bookings" />
          </ProtectedRoute>
        }
      />

      <Route
        path="/counselor"
        element={
          <ProtectedRoute allowedRoles={['counselor']}>
            <CounselorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/counselor/profile"
        element={
          <ProtectedRoute allowedRoles={['counselor']}>
            <CounselorDashboard defaultTab="profile" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/counselor/analytics"
        element={
          <ProtectedRoute allowedRoles={['counselor']}>
            <CounselorDashboard defaultTab="analytics" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/counselor/slots"
        element={
          <ProtectedRoute allowedRoles={['counselor']}>
            <CounselorDashboard defaultTab="slots" />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/students"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard defaultTab="users" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/counselors"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard defaultTab="counselors" />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App;
