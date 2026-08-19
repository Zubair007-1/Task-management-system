<<<<<<< HEAD
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AppRouter from './routes/AppRouter';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <AppRouter />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#ffffff',
                color: '#1e293b',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                fontSize: '14px',
              },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
=======
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateTask from "./pages/CreateTask";
import EditTask from "./pages/EditTask";

function App() {
    return (
        <BrowserRouter>
            <Routes>

              <Route
                  path="/"
                  element={<Login />}
              />

              <Route
                  path="/register"
                  element={<Register />}
              />

              <Route
                  path="/dashboard"
                  element={<Dashboard />}
              />

              <Route
                  path="/tasks/create"
                  element={<CreateTask />}
              />
              
              <Route
                path="/tasks/edit/:id"
                element={<EditTask />}
               />

          </Routes>
                  </BrowserRouter>
              );
          }

export default App;
>>>>>>> e05702623da63c35a8dabec1659cac1ea9b63097
