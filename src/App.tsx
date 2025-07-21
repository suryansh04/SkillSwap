import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import Dashboard from './pages/Dashboard';
import { MainLayout } from './components/layouts/MainLayout';
import { AuthLayout } from './components/layouts/AuthLayout';
import { MainNav } from './components/layouts/MainNav';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Layout wrapper for main pages
const MainLayoutWrapper = () => {
  const isLoggedIn = !!localStorage.getItem('token');
  return (
    <MainLayout>
      <MainNav isLoggedIn={isLoggedIn} />
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </MainLayout>
  );
};

// Protected route wrapper
const ProtectedRouteWrapper = () => {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Main layout routes */}
        <Route element={<MainLayoutWrapper />}>
          <Route path="/" element={<HomePage />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRouteWrapper />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Route>
        
        {/* Auth layout routes */}
        <Route element={<AuthLayout><Outlet /></AuthLayout>}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          {/* Handle reset password with token */}
          <Route path="/reset-password" >
            <Route path=":token" element={<ResetPasswordPage />} />
            <Route index element={<Navigate to="/forgot-password" replace />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
