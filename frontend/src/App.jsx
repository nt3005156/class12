import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout.jsx";
import { SciFiBackground } from "./components/SciFiBackground.jsx";
import { StudyCopilot } from "./components/StudyCopilot.jsx";
import { useProgress } from "./hooks/useProgress.js";
import { getDashboardMeta } from "./services/api.js";
import { AuthModal } from "./components/AuthModal.jsx";
import { useAuth } from "./hooks/useAuth.jsx";
import { RequireAdmin } from "./components/RequireAdmin.jsx";

const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const NoteDetail = lazy(() => import("./pages/NoteDetail.jsx"));
const AdminPage = lazy(() => import("./pages/AdminPage.jsx"));
const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage.jsx"));

function Shell({ children }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-slate-500">
          Initializing interface…
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

function AppInner() {
  const { stats } = useProgress();
  const { login, signup, loading } = useAuth();
  const [total, setTotal] = useState(7);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    getDashboardMeta()
      .then((data) => setTotal(data.total || 7))
      .catch(() => {});
  }, []);

  const progressStats = stats(total);

  async function handleAuthSubmit(payload) {
    setAuthLoading(true);
    try {
      if (authMode === "login") {
        await login(payload);
      } else {
        await signup(payload);
      }
    } finally {
      setAuthLoading(false);
    }
  }

  return (
    <>
      <SciFiBackground />
      <Layout
        progressStats={progressStats}
        onAuthOpen={(mode) => {
          setAuthMode(mode);
          setAuthOpen(true);
        }}
      >
        <Routes>
          <Route
            path="/"
            element={
              <Shell>
                <Dashboard />
              </Shell>
            }
          />
          <Route
            path="/notes/:slug"
            element={
              <Shell>
                <NoteDetail />
              </Shell>
            }
          />
          <Route
            path="/admin"
            element={
              <Shell>
                <RequireAdmin fallback={<AdminLoginPage />}>
                  <AdminPage />
                </RequireAdmin>
              </Shell>
            }
          />
        </Routes>
      </Layout>
      <StudyCopilot />
      <AuthModal
        open={authOpen}
        mode={authMode}
        onClose={() => setAuthOpen(false)}
        onModeChange={setAuthMode}
        onSubmit={handleAuthSubmit}
        loading={authLoading || loading}
      />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}
