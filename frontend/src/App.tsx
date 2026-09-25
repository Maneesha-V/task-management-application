import { Toaster } from "react-hot-toast";
import TaskList from "./pages/tasks/TaskList";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { logoutUser, refreshToken } from "./features/auth/authSlice";
import { useEffect } from "react";
import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import Register from "./pages/auth/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/auth/Login";
import { useTaskSocket } from "./hooks/useTaskSocket";
import Dashboard from "./pages/stats/Dashboard";
import NotFoundPage from "./pages/NotFoundPage";

const TasksPage = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  useTaskSocket();

  return (
    <div className="min-h-screen bg-base text-ink">
      <div className="mx-auto max-w-xl px-6 py-12">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
            <p className="mt-1 text-sm text-slate-400">
              {user ? `Signed in as ${user.name}` : ""}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/dashboard"
              className="rounded-md border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800"
            >
              Dashboard
            </Link>
            <button
              onClick={() => dispatch(logoutUser())}
              className="rounded-md border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800"
            >
              Log out
            </button>
          </div>
        </header>
        <main>
          <TaskList />
        </main>
      </div>
    </div>
  );
};

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(refreshToken());
  }, []);

  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <TasksPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
