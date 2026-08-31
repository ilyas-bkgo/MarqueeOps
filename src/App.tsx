import React, { useState } from 'react';
import { PulseBoardProvider, usePulseBoard } from './context/PulseBoardContext';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { OverviewView } from './components/Overview/OverviewView';
import { UsersView } from './components/Users/UsersView';
import { ActivityView } from './components/Activity/ActivityView';
import { InsightsView } from './components/Insights/InsightsView';
import { ToastContainer } from './components/Common/ToastContainer';
import { AddUserModal } from './components/Users/AddUserModal';

const DashboardLayout: React.FC = () => {
  const { activeView } = usePulseBoard();
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-zinc-50/50 text-zinc-900 font-sans antialiased overflow-hidden selection:bg-zinc-900 selection:text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Navigation Bar */}
        <TopBar onOpenAddUserModal={() => setIsAddUserModalOpen(true)} />

        {/* Scrollable View Canvas */}
        <main className="flex-1 overflow-y-auto min-h-0 bg-[#fafafa]">
          {activeView === 'overview' && <OverviewView />}
          {activeView === 'users' && <UsersView />}
          {activeView === 'activity' && <ActivityView />}
          {activeView === 'insights' && <InsightsView />}
        </main>
      </div>

      {/* Global Modals */}
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
      />

      {/* Real-time Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <PulseBoardProvider>
      <DashboardLayout />
    </PulseBoardProvider>
  );
}
