import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { NotificationProvider } from './context/NotificationContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AdminProtectedRoute } from './components/common/AdminProtectedRoute';
import { Sidebar } from './components/common/Sidebar';
import { AdminSidebar } from './components/admin/AdminSidebar';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Subscriptions } from './pages/Subscriptions';
import { WalletView } from './pages/WalletView';
import { Renewals } from './pages/Renewals';
import { Reports } from './pages/Reports';
import { Analytics } from './pages/Analytics';
import { SmartSavings } from './pages/SmartSavings';
import { Categories } from './pages/Categories';
import { Profile } from './pages/Profile';
import { AccountSettings } from './pages/AccountSettings';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { VerifyEmail } from './pages/VerifyEmail';
import { NotFound } from './pages/NotFound';

import { AdminDashboard } from './pages/AdminDashboard';
import { AdminUsers } from './pages/AdminUsers';
import { AdminSubscriptions } from './pages/AdminSubscriptions';
import { AdminWallet } from './pages/AdminWallet';
import { AdminSecurity } from './pages/AdminSecurity';
import { AdminAuditLogs } from './pages/AdminAuditLogs';
import AdminSystemSettingsPage from './pages/AdminSystemSettings';
import AdminProfile from './pages/AdminProfile';
import { Subscription } from './types';

const AnimatedRoutes: React.FC<{ selectedSearchSub: Subscription | null }> = ({ selectedSearchSub }) => {
  const location = useLocation();

  return (
    <div key={location.pathname} className="page-transition min-h-[calc(100vh-7.5rem)]">
      <Routes location={location}>
        <Route path="/dashboard" element={<Dashboard selectedSearchSub={selectedSearchSub} />} />
        <Route path="/subscriptions" element={<Subscriptions selectedSearchSub={selectedSearchSub} />} />
        <Route path="/wallet" element={<WalletView />} />
        <Route path="/renewals" element={<Renewals />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/smart-savings" element={<SmartSavings />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/settings" element={<AccountSettings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export const App: React.FC = () => {
  const [selectedSearchSub, setSelectedSearchSub] = useState<Subscription | null>(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isAdminSidebarExpanded, setIsAdminSidebarExpanded] = useState(false);

  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <NotificationProvider>
            <Routes>
              {/* Public Pre-Authentication Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />

              {/* 51. ADMIN ROUTES WITH ROLE PROTECTION */}
              <Route
                path="/admin/*"
                element={
                  <AdminProtectedRoute>
                    <div className="min-h-screen bg-[#1A1D27] flex text-[#FECB6E] font-sans antialiased overflow-x-hidden relative">
                      <AdminSidebar
                        isExpanded={isAdminSidebarExpanded}
                        onToggleExpand={() => setIsAdminSidebarExpanded(!isAdminSidebarExpanded)}
                      />
                      <div
                        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
                          isAdminSidebarExpanded ? 'ml-48' : 'ml-12'
                        }`}
                      >
                        <Navbar />
                        <main className="flex-1 p-4 md:p-6 overflow-x-hidden text-white">
                          <Routes>
                            <Route path="/" element={<AdminDashboard />} />
                            <Route path="/dashboard" element={<AdminDashboard />} />
                            <Route path="/users" element={<AdminUsers />} />
                            <Route path="/subscriptions" element={<AdminSubscriptions />} />
                            <Route path="/wallet" element={<AdminWallet />} />
                            <Route path="/security" element={<AdminSecurity />} />
                            <Route path="/audit-logs" element={<AdminAuditLogs />} />
                            <Route path="/settings" element={<AdminSystemSettingsPage />} />
                            <Route path="/profile" element={<AdminProfile />} />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </main>
                        <Footer />
                      </div>
                    </div>
                  </AdminProtectedRoute>
                }
              />

              {/* Regular User Protected Shell Layout */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen bg-[#1A1D27] flex text-white font-sans antialiased overflow-x-hidden relative">
                      <Sidebar
                        isExpanded={isSidebarExpanded}
                        onToggleExpand={() => setIsSidebarExpanded(!isSidebarExpanded)}
                        onResetSelectedSub={() => setSelectedSearchSub(null)}
                      />
                      <div
                        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
                          isSidebarExpanded ? 'ml-48' : 'ml-12'
                        }`}
                      >
                        <Navbar onSelectSubscription={(sub) => setSelectedSearchSub(sub)} />
                        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
                          <AnimatedRoutes selectedSearchSub={selectedSearchSub} />
                        </main>
                        <Footer />
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </NotificationProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;