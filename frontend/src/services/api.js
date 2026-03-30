const base = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";

async function fetchJson(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const res = await fetch(`${base}${path}`, {
    headers,
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || res.statusText || "Request failed");
  }
  return res.json();
}

export function getChapters(params = {}) {
  const qs = new URLSearchParams();
  if (params.category) qs.set("category", params.category);
  if (params.q) qs.set("q", params.q);
  const suffix = qs.toString() ? `?${qs}` : "";
  return fetchJson(`/api/notes${suffix}`);
}

export function getDashboardMeta() {
  return fetchJson("/api/notes/meta");
}

export function searchChapters(q) {
  const qs = new URLSearchParams({ q });
  return fetchJson(`/api/notes/search?${qs}`);
}

export function getChapter(slug) {
  return fetchJson(`/api/notes/${encodeURIComponent(slug)}`);
}

export function createAdminNote(body, token) {
  return fetchJson("/api/admin/notes", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function updateAdminNote(slug, body, token) {
  return fetchJson(`/api/admin/notes/${encodeURIComponent(slug)}`, {
    method: "PUT",
    body: JSON.stringify(body),
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function deleteAdminNote(slug, token) {
  return fetchJson(`/api/admin/notes/${encodeURIComponent(slug)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function getAdminNotes(token) {
  return fetchJson("/api/admin/notes", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function getAdminMessages(token) {
  return fetchJson("/api/admin/messages", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function getAdminStats(token) {
  return fetchJson("/api/admin/stats", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function signupUser(body) {
  return fetchJson("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function loginUser(body) {
  return fetchJson("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function getCurrentUser(token) {
  return fetchJson("/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function logoutUser(token) {
  return fetchJson("/api/auth/logout", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function sendContactMessage(body) {
  return fetchJson("/api/contact", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
