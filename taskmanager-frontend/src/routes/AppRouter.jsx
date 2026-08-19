import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { ProtectedRoute, PublicRoute, AdminRoute } from './ProtectedRoute';

// Lazy load pages for code splitting & optimization
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage'));
const TasksPage = lazy(() => import('../pages/tasks/TasksPage'));
const KanbanPage = lazy(() => import('../pages/kanban/KanbanPage'));
const CalendarPage = lazy(() => import('../pages/calendar/CalendarPage'));
const AnalyticsPage = lazy(() => import('../pages/analytics/AnalyticsPage'));
const TeamPage = lazy(() => import('../pages/team/TeamPage'));
const ProfilePage = lazy(() => import('../pages/profile/ProfilePage'));
const SettingsPage = lazy(() => import('../pages/settings/SettingsPage'));

// Error pages
const ForbiddenPage = lazy(() => import('../pages/errors/ForbiddenPage'));
const NotFoundPage = lazy(() => import('../pages/errors/NotFoundPage'));
const InternalErrorPage = lazy(() => import('../pages/errors/InternalErrorPage'));

function PageLoader() {
  return (
    <div className="w-full h-[calc(100vh-160px)] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
    </div>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-slate-900">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
        }
      >
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />

          {/* Protected Main Layout routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <Suspense fallback={<PageLoader />}>
                  <DashboardPage />
                </Suspense>
              }
            />
            <Route
              path="tasks"
              element={
                <Suspense fallback={<PageLoader />}>
                  <TasksPage />
                </Suspense>
              }
            />
            <Route
              path="kanban"
              element={
                <Suspense fallback={<PageLoader />}>
                  <KanbanPage />
                </Suspense>
              }
            />
            <Route
              path="calendar"
              element={
                <Suspense fallback={<PageLoader />}>
                  <CalendarPage />
                </Suspense>
              }
            />
            <Route
              path="analytics"
              element={
                <AdminRoute>
                  <Suspense fallback={<PageLoader />}>
                    <AnalyticsPage />
                  </Suspense>
                </AdminRoute>
              }
            />
            <Route
              path="team"
              element={
                <Suspense fallback={<PageLoader />}>
                  <TeamPage />
                </Suspense>
              }
            />
            <Route
              path="profile"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ProfilePage />
                </Suspense>
              }
            />
            <Route
              path="settings"
              element={
                <Suspense fallback={<PageLoader />}>
                  <SettingsPage />
                </Suspense>
              }
            />
          </Route>

          {/* Error & Fallbacks */}
          <Route
            path="/403"
            element={
              <Suspense fallback={<PageLoader />}>
                <ForbiddenPage />
              </Suspense>
            }
          />
          <Route
            path="/500"
            element={
              <Suspense fallback={<PageLoader />}>
                <InternalErrorPage />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <Suspense fallback={<PageLoader />}>
                <NotFoundPage />
              </Suspense>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
