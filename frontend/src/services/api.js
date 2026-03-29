const base =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";

async function fetchJson(path, options = {}) {
  const res = await fetch(`${base}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
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

export function searchChapters(q) {
  const qs = new URLSearchParams({ q });
  return fetchJson(`/api/notes/search?${qs}`);
}

export function getChapter(slug) {
  return fetchJson(`/api/notes/${encodeURIComponent(slug)}`);
}

/** Admin: create or update chapter — pass ADMIN_API_KEY in env for local tools */
export function adminCreateNote(body, adminKey) {
  return fetchJson("/api/admin/notes", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "x-admin-key": adminKey },
  });
}

export function adminUpdateNote(slug, body, adminKey) {
  return fetchJson(`/api/admin/notes/${encodeURIComponent(slug)}`, {
    method: "PUT",
    body: JSON.stringify(body),
    headers: { "x-admin-key": adminKey },
  });
}
