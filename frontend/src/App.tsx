import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { KitchoraAIChatDrawer } from './components/KitchoraAIChatDrawer';
import { KitchoraMascotBot } from './components/KitchoraMascotBot';
import { useAuthStore } from './store/authStore';

import { LandingPage } from './pages/LandingPage';
import { Home } from './pages/Home';
import { KitchenDetail } from './pages/KitchenDetail';
import { AISearchResults } from './pages/AISearchResults';
import { Checkout } from './pages/Checkout';
import { OrderTracking } from './pages/OrderTracking';
import { UserOrders } from './pages/UserOrders';
import { Rewards } from './pages/Rewards';
import { KitchenDashboard } from './pages/KitchenDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Role-aware Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ children, allowedRoles }) => {
  const { user } = useAuthStore();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'KITCHEN_OWNER') return <Navigate to="/kitchen" replace />;
    if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
    return <Navigate to="/explore" replace />;
  }

  return <>{children}</>;
};

const AppLayout: React.FC = () => {
  const { user } = useAuthStore();
  const location = useLocation();

  // Show Navbar ONLY after login OR on non-landing pages
  const showNavbar = user !== null || location.pathname !== '/';

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 font-sans flex flex-col antialiased selection:bg-orange-500 selection:text-white">
      {showNavbar && <Navbar />}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Routes>
          {/* Public Landing & Auth Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Customer Routes */}
          <Route path="/explore" element={<ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}><Home /></ProtectedRoute>} />
          <Route path="/restaurant/:id" element={<ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}><KitchenDetail /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}><AISearchResults /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}><Checkout /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}><UserOrders /></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}><OrderTracking /></ProtectedRoute>} />
          <Route path="/rewards" element={<ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}><Rewards /></ProtectedRoute>} />

          {/* Protected Kitchen Owner Route */}
          <Route path="/kitchen" element={<ProtectedRoute allowedRoles={['KITCHEN_OWNER', 'ADMIN']}><KitchenDashboard /></ProtectedRoute>} />

          {/* Protected Admin Route */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </main>

      <Footer />

      {/* Global Sliding Drawers & Mascot Bot */}
      <CartDrawer />
      <KitchoraAIChatDrawer />
      <KitchoraMascotBot />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppLayout />
      </Router>
    </QueryClientProvider>
  );
};

export default App;
