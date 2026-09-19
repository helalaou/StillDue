import {lazy,Suspense} from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { WorkspaceProvider, useWorkspace } from './context/WorkspaceContext';
import { useTheme } from './hooks/useTheme';
import { AuthPage } from './pages/AuthPage';
import { Layout } from './components/Layout';
import { OverviewPage } from './pages/OverviewPage';
const BoardsPage = lazy(() => import('./pages/BoardsPage').then(m => ({default:m.BoardsPage})));
const CalendarPage = lazy(() => import('./pages/CalendarPage').then(m => ({default:m.CalendarPage})));
const TemplatesPage = lazy(() => import('./pages/TemplatesPage').then(m => ({default:m.TemplatesPage})));
const DiscoverPage = lazy(() => import('./pages/DiscoverPage').then(m => ({default:m.DiscoverPage})));
const DisplayPage = lazy(() => import('./pages/DisplayPage').then(m => ({default:m.DisplayPage})));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({default:m.SettingsPage})));
import { ErrorBoundary } from './components/ErrorBoundary';
import { UpdatePrompt } from './components/UpdatePrompt';
import { Brand } from './components/Brand';
const client = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 10000 } } });
function Workspace() {
  const { data, loading, error, refresh } = useWorkspace();
  useTheme(data.preferences);
  if (loading)
    return (
      <div className="loading-screen">
        <Brand />
        <p>Making a little room…</p>
      </div>
    );
  if (error)
    return (
      <div className="loading-screen">
        <Brand />
        <p role="alert">{error}</p>
        <button className="button primary" onClick={refresh}>
          Try again
        </button>
      </div>
    );
  return (
    <>
      <Suspense fallback={<div className="loading-state">Opening your view…</div>}><Routes>
        <Route path="/display" element={<DisplayPage />} />
        <Route element={<Layout />}>
          <Route index element={<OverviewPage />} />
          <Route path="boards" element={<BoardsPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="focus" element={<OverviewPage focus />} />
          <Route path="inactive" element={<OverviewPage status="inactive" />} />
          <Route path="completed" element={<OverviewPage status="completed" />} />
          <Route path="trash" element={<OverviewPage status="trash" />} />
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="discover" element={<DiscoverPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes></Suspense>
      <UpdatePrompt />
    </>
  );
}
function Gate() {
  const { session, demo, loading, recovery } = useAuth();
  if (loading)
    return (
      <div className="loading-screen">
        <Brand />
        <p>Opening your workspace…</p>
      </div>
    );
  if (recovery || (!session && !demo)) return <AuthPage />;
  return (
    <WorkspaceProvider>
      <Workspace />
    </WorkspaceProvider>
  );
}
export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={client}>
        <ToastProvider>
          <AuthProvider>
            <Gate />
          </AuthProvider>
        </ToastProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
