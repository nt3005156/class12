import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout.jsx";
import { SciFiBackground } from "./components/SciFiBackground.jsx";
import { StudyCopilot } from "./components/StudyCopilot.jsx";
import { useProgress } from "./hooks/useProgress.js";
import { useEffect, useState } from "react";
import { getChapters } from "./services/api.js";

const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const NoteDetail = lazy(() => import("./pages/NoteDetail.jsx"));

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
  const [total, setTotal] = useState(7);

  useEffect(() => {
    getChapters()
      .then((rows) => setTotal(rows.length || 7))
      .catch(() => {});
  }, []);

  const progressStats = stats(total);

  return (
    <>
      <SciFiBackground />
      <Layout progressStats={progressStats}>
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
        </Routes>
      </Layout>
      <StudyCopilot />
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
