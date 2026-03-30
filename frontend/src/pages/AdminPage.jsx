import { useEffect, useState } from "react";
import {
  createAdminNote,
  deleteAdminNote,
  getAdminMessages,
  getAdminNotes,
  getAdminStats,
  updateAdminNote,
} from "../services/api.js";
import { useAuth } from "../hooks/useAuth.jsx";
import { AdminSidebar } from "../components/admin/AdminSidebar.jsx";
import { AdminStatsGrid } from "../components/admin/AdminStatsGrid.jsx";
import { MessagesPanel } from "../components/admin/MessagesPanel.jsx";
import { NoteEditor } from "../components/admin/NoteEditor.jsx";
import { NotesManager } from "../components/admin/NotesManager.jsx";

function OverviewPanel({ stats }) {
  return (
    <section className="app-panel rounded-[28px] p-6">
      <p className="eyebrow">Dashboard</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-[var(--text-strong)]">
        Admin control center
      </h1>
      <p className="mt-3 max-w-2xl text-[var(--muted)]">
        Manage chapters, review contact messages, and monitor the learning portal from one place.
      </p>
      <div className="mt-6">
        <AdminStatsGrid stats={stats} />
      </div>
    </section>
  );
}

export default function AdminPage() {
  const { token, user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({ notes: 0, messages: 0, users: 0, admins: 0 });
  const [notes, setNotes] = useState([]);
  const [messages, setMessages] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [statsData, notesData, messagesData] = await Promise.all([
        getAdminStats(token),
        getAdminNotes(token),
        getAdminMessages(token),
      ]);
      setStats(statsData);
      setNotes(notesData);
      setMessages(messagesData);
    } catch (loadError) {
      setError(loadError.message || "Could not load admin data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    document.title = "NITEX | Admin Panel";
  }, []);

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  async function handleSaveNote(payload) {
    setSaving(true);
    setError("");
    try {
      if (editingNote) {
        await updateAdminNote(editingNote.slug, payload, token);
      } else {
        await createAdminNote(payload, token);
      }
      setEditingNote(null);
      await loadData();
      setActiveTab("notes");
    } catch (saveError) {
      setError(saveError.message || "Could not save note");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteNote(slug) {
    if (!window.confirm(`Delete the note "${slug}"?`)) {
      return;
    }

    setError("");
    try {
      await deleteAdminNote(slug, token);
      if (editingNote?.slug === slug) {
        setEditingNote(null);
      }
      await loadData();
    } catch (deleteError) {
      setError(deleteError.message || "Could not delete note");
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[260px_1fr]">
      <AdminSidebar activeTab={activeTab} onChange={setActiveTab} />

      <div className="space-y-6">
        <section className="app-subtle-card rounded-[28px] p-5">
          <p className="text-sm text-[var(--muted)]">Logged in as</p>
          <p className="mt-1 font-display text-2xl text-[var(--text-strong)]">
            {user?.name} ({user?.role})
          </p>
        </section>

        {error && <p className="rounded-2xl bg-rose-500/12 px-4 py-3 text-sm text-rose-300">{error}</p>}

        {loading ? (
          <section className="app-panel rounded-[28px] p-10 text-center">
            Loading admin dashboard...
          </section>
        ) : (
          <>
            {activeTab === "overview" && <OverviewPanel stats={stats} />}

            {activeTab === "notes" && (
              <div className="space-y-6">
                <NoteEditor
                  initialNote={editingNote}
                  onCancel={() => setEditingNote(null)}
                  onSubmit={handleSaveNote}
                  saving={saving}
                />
                <NotesManager
                  notes={notes}
                  onEdit={(note) => setEditingNote(note)}
                  onDelete={handleDeleteNote}
                />
              </div>
            )}

            {activeTab === "messages" && <MessagesPanel messages={messages} />}
          </>
        )}
      </div>
    </div>
  );
}
