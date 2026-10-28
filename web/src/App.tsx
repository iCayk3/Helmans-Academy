import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import type { User } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { QuickCheckInModal } from './components/QuickCheckInModal';
import { DashboardView } from './pages/DashboardView';
import { MembersView } from './pages/MembersView';
import { CheckinView } from './pages/CheckinView';
import { WorkoutsView } from './pages/WorkoutsView';
import { AssessmentsView } from './pages/AssessmentsView';
import { FinancialView } from './pages/FinancialView';
import { LoginView } from './pages/LoginView';

export const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [isQuickCheckInOpen, setIsQuickCheckInOpen] = useState<boolean>(false);
  const [initializing, setInitializing] = useState<boolean>(true);

  // Validate existing session on mount
  useEffect(() => {
    const savedToken = api.getToken();
    const savedUser = api.getUser();

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);

      // Verify token integrity in backend
      api.get<User>('/auth/me')
        .then((freshUser) => {
          setUser(freshUser);
          api.setUser(freshUser);
        })
        .catch(() => {
          // Token expired or invalid
          handleLogout();
        })
        .finally(() => {
          setInitializing(false);
        });
    } else {
      setInitializing(false);
    }

    const onLogoutEvent = () => handleLogout();
    window.addEventListener('auth-logout', onLogoutEvent);
    return () => window.removeEventListener('auth-logout', onLogoutEvent);
  }, []);

  const handleLoginSuccess = (authenticatedUser: User, sessionToken: string) => {
    setUser(authenticatedUser);
    setToken(sessionToken);
  };

  const handleLogout = () => {
    api.removeToken();
    setUser(null);
    setToken(null);
    setCurrentTab('dashboard');
  };

  if (initializing) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If not logged in, render the athlete cinematic login screen
  if (!token || !user) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-brand-black text-gray-100 flex flex-col selection:bg-brand-gold selection:text-brand-black">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        user={user}
        onLogout={handleLogout}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Layout Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Top Sticky Header */}
        <Header
          currentTab={currentTab}
          onOpenMobileMenu={() => setIsMobileOpen(true)}
          onOpenQuickCheckIn={() => setIsQuickCheckInOpen(true)}
        />

        {/* Content View Container (Universal Responsive Grid) */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardView
              onNavigate={(tab) => setCurrentTab(tab)}
              onOpenQuickCheckIn={() => setIsQuickCheckInOpen(true)}
            />
          )}

          {currentTab === 'members' && <MembersView />}

          {currentTab === 'checkin' && <CheckinView />}

          {currentTab === 'workouts' && <WorkoutsView />}

          {currentTab === 'assessments' && <AssessmentsView />}

          {currentTab === 'financial' && <FinancialView />}
        </main>
      </div>

      {/* Quick Check-in Modal Accessible from any screen */}
      <QuickCheckInModal
        isOpen={isQuickCheckInOpen}
        onClose={() => setIsQuickCheckInOpen(false)}
        onSuccess={() => {
          // Check-in was processed
        }}
      />
    </div>
  );
};
