import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AppUser,
  ActivityLog,
  MetricOverview,
  AIInsight,
  CurrentSessionUser,
  Role,
  DashboardView,
  UserStatus,
} from '../types';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

interface PulseBoardContextType {
  currentUser: CurrentSessionUser;
  availablePersonas: Record<Role, CurrentSessionUser>;
  users: AppUser[];
  activities: ActivityLog[];
  metrics: MetricOverview | null;
  insights: AIInsight[];
  activeView: DashboardView;
  isLoading: boolean;
  isGeneratingInsights: boolean;
  toasts: ToastMessage[];
  setActiveView: (view: DashboardView) => void;
  switchRole: (role: Role) => Promise<void>;
  createUser: (userData: Partial<AppUser>) => Promise<boolean>;
  updateUser: (id: string, updates: Partial<AppUser>) => Promise<boolean>;
  updateUserRole: (id: string, newRole: Role) => Promise<boolean>;
  updateUserStatus: (id: string, newStatus: UserStatus) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;
  refreshInsights: () => Promise<void>;
  resetSeedData: () => Promise<void>;
  addToast: (type: ToastMessage['type'], title: string, message?: string) => void;
  removeToast: (id: string) => void;
  fetchData: () => Promise<void>;
}

const PulseBoardContext = createContext<PulseBoardContextType | undefined>(undefined);

export const PulseBoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<CurrentSessionUser>({
    id: 'persona-super-admin',
    name: 'Elena Rostova',
    email: 'elena.rostova@pulseboard.io',
    role: 'Super Admin',
    avatar: 'ER',
    department: 'Executive Engineering',
  });
  const [availablePersonas, setAvailablePersonas] = useState<Record<Role, CurrentSessionUser>>({} as any);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [metrics, setMetrics] = useState<MetricOverview | null>(null);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [activeView, setActiveView] = useState<DashboardView>('overview');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage['type'], title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch all initial data
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [sessionRes, usersRes, activitiesRes, metricsRes, insightsRes] = await Promise.all([
        fetch('/api/session', { headers: { 'x-pulseboard-role': currentUser.role } }),
        fetch('/api/users', { headers: { 'x-pulseboard-role': currentUser.role } }),
        fetch('/api/activities', { headers: { 'x-pulseboard-role': currentUser.role } }),
        fetch('/api/metrics', { headers: { 'x-pulseboard-role': currentUser.role } }),
        fetch('/api/insights', { headers: { 'x-pulseboard-role': currentUser.role } }),
      ]);

      if (sessionRes.ok) {
        const sessionData = await sessionRes.json();
        if (sessionData.user) setCurrentUser(sessionData.user);
        if (sessionData.availablePersonas) setAvailablePersonas(sessionData.availablePersonas);
      }
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }
      if (activitiesRes.ok) {
        const activitiesData = await activitiesRes.json();
        setActivities(activitiesData);
      }
      if (metricsRes.ok) {
        const metricsData = await metricsRes.json();
        setMetrics(metricsData);
      }
      if (insightsRes.ok) {
        const insightsData = await insightsRes.json();
        setInsights(insightsData);
      }
    } catch (err) {
      console.error('Failed to fetch PulseBoard dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser.role]);

  useEffect(() => {
    fetchData();
  }, []);

  // Role Switcher for previewing Super Admin, Admin, Viewer
  const switchRole = async (newRole: Role) => {
    try {
      const res = await fetch('/api/session/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        addToast(
          'info',
          `Active Persona: ${data.user.name}`,
          `Previewing dashboard as ${newRole}. Permissions updated.`
        );
        // Refresh with new role header
        fetchData();
      }
    } catch (err) {
      console.error('Failed to switch role:', err);
      addToast('error', 'Failed to switch role persona');
    }
  };

  // Create / Invite User
  const createUser = async (userData: Partial<AppUser>): Promise<boolean> => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-pulseboard-role': currentUser.role,
        },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        const err = await res.json();
        addToast('error', 'Action Prohibited', err.error || 'Failed to create user');
        return false;
      }

      const data = await res.json();
      setUsers((prev) => [data.user, ...prev]);
      if (data.activity) {
        setActivities((prev) => [data.activity, ...prev]);
      }
      addToast('success', 'User Invited Successfully', `${data.user.name} has been added to ${data.user.department}`);
      // Refresh metrics
      fetch('/api/metrics', { headers: { 'x-pulseboard-role': currentUser.role } })
        .then((r) => r.json())
        .then(setMetrics);
      return true;
    } catch (err) {
      console.error('Create user error:', err);
      addToast('error', 'Network Error', 'Could not create user');
      return false;
    }
  };

  // Update User Details
  const updateUser = async (id: string, updates: Partial<AppUser>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-pulseboard-role': currentUser.role,
        },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        const err = await res.json();
        addToast('error', 'Update Failed', err.error || 'Could not update user');
        return false;
      }

      const data = await res.json();
      setUsers((prev) => prev.map((u) => (u.id === id ? data.user : u)));
      if (data.activity) {
        setActivities((prev) => [data.activity, ...prev]);
      }
      addToast('success', 'User Updated', `Changes saved for ${data.user.name}`);
      return true;
    } catch (err) {
      console.error('Update user error:', err);
      addToast('error', 'Network Error', 'Could not update user');
      return false;
    }
  };

  // Super Admin Exclusive Role Modification
  const updateUserRole = async (id: string, newRole: Role): Promise<boolean> => {
    if (currentUser.role !== 'Super Admin') {
      addToast('warning', 'Permission Denied', 'Only Super Admin can change user roles.');
      return false;
    }

    try {
      const res = await fetch(`/api/users/${id}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-pulseboard-role': currentUser.role,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) {
        const err = await res.json();
        addToast('error', 'Role Change Failed', err.error || 'Permission error');
        return false;
      }

      const data = await res.json();
      setUsers((prev) => prev.map((u) => (u.id === id ? data.user : u)));
      if (data.activity) {
        setActivities((prev) => [data.activity, ...prev]);
      }
      addToast('success', 'Role Updated', `${data.user.name} is now a ${newRole}`);
      return true;
    } catch (err) {
      console.error('Update user role error:', err);
      addToast('error', 'Network Error', 'Could not update role');
      return false;
    }
  };

  // Status Change (Active / Suspended / Invited)
  const updateUserStatus = async (id: string, newStatus: UserStatus): Promise<boolean> => {
    try {
      const res = await fetch(`/api/users/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-pulseboard-role': currentUser.role,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const err = await res.json();
        addToast('error', 'Status Change Failed', err.error || 'Permission error');
        return false;
      }

      const data = await res.json();
      setUsers((prev) => prev.map((u) => (u.id === id ? data.user : u)));
      if (data.activity) {
        setActivities((prev) => [data.activity, ...prev]);
      }
      addToast(
        newStatus === 'suspended' ? 'warning' : 'success',
        'Status Updated',
        `${data.user.name} marked as ${newStatus}`
      );
      return true;
    } catch (err) {
      console.error('Update status error:', err);
      addToast('error', 'Network Error', 'Could not update status');
      return false;
    }
  };

  // Delete User
  const deleteUser = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'x-pulseboard-role': currentUser.role,
        },
      });

      if (!res.ok) {
        const err = await res.json();
        addToast('error', 'Delete Prohibited', err.error || 'Failed to delete user');
        return false;
      }

      const data = await res.json();
      setUsers((prev) => prev.filter((u) => u.id !== id));
      if (data.activity) {
        setActivities((prev) => [data.activity, ...prev]);
      }
      addToast('info', 'User Account Deleted', 'Account removed and logged to audit trail');
      // Refresh metrics
      fetch('/api/metrics', { headers: { 'x-pulseboard-role': currentUser.role } })
        .then((r) => r.json())
        .then(setMetrics);
      return true;
    } catch (err) {
      console.error('Delete user error:', err);
      addToast('error', 'Network Error', 'Could not delete user');
      return false;
    }
  };

  // AI Insights Generation (Server Gemini + Grounded Analytics)
  const refreshInsights = async () => {
    setIsGeneratingInsights(true);
    try {
      const res = await fetch('/api/insights/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-pulseboard-role': currentUser.role,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to generate insights');
      }

      const data = await res.json();
      setInsights(data.insights);
      addToast(
        'success',
        'AI Insights Refreshed',
        `Synthesized ${data.insights.length} portfolio signals via ${data.source === 'gemini' ? 'Gemini 3.7 Flash' : 'MarqueeOps Analytics Engine'}`
      );

      // Refresh activity log to show the generation event
      fetch('/api/activities', { headers: { 'x-pulseboard-role': currentUser.role } })
        .then((r) => r.json())
        .then(setActivities);
    } catch (err) {
      console.error('Refresh insights error:', err);
      addToast('error', 'AI Generation Failed', 'Could not refresh insight cards');
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  // Reset Seed Data
  const resetSeedData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/seed/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-pulseboard-role': currentUser.role,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
        setActivities(data.activities);
        setMetrics(data.metrics);
        setInsights(data.insights);
        setCurrentUser(data.currentUser);
        addToast(
          'success',
          'Seed Data Restored',
          'Dashboard reset to initial 20 users, 12 audit logs, and AI insights.'
        );
      }
    } catch (err) {
      console.error('Reset seed error:', err);
      addToast('error', 'Reset Failed', 'Could not reset seed data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PulseBoardContext.Provider
      value={{
        currentUser,
        availablePersonas,
        users,
        activities,
        metrics,
        insights,
        activeView,
        isLoading,
        isGeneratingInsights,
        toasts,
        setActiveView,
        switchRole,
        createUser,
        updateUser,
        updateUserRole,
        updateUserStatus,
        deleteUser,
        refreshInsights,
        resetSeedData,
        addToast,
        removeToast,
        fetchData,
      }}
    >
      {children}
    </PulseBoardContext.Provider>
  );
};

export const usePulseBoard = () => {
  const context = useContext(PulseBoardContext);
  if (!context) {
    throw new Error('usePulseBoard must be used within a PulseBoardProvider');
  }
  return context;
};
