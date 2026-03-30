import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "./useLocalStorage.js";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  signupUser,
} from "../services/api.js";

const AuthContext = createContext(null);
const KEY = "class12_auth_token_v1";

export function AuthProvider({ children }) {
  const [token, setToken] = useLocalStorage(KEY, "");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    let cancelled = false;

    // Restore the last session from localStorage so beginners can see how auth state persists.
    async function restoreSession() {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await getCurrentUser(token);
        if (!cancelled) setUser(data.user);
      } catch (_error) {
        if (!cancelled) {
          setToken("");
          setUser(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    restoreSession();
    return () => {
      cancelled = true;
    };
  }, [token, setToken]);

  async function handleAuthRequest(action, payload) {
    const data = action === "login" ? await loginUser(payload) : await signupUser(payload);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  async function handleLogout() {
    if (token) {
      try {
        await logoutUser(token);
      } catch (_error) {
        // If the server session is already gone, clearing local state is still safe.
      }
    }
    setToken("");
    setUser(null);
  }

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(user),
      login: (payload) => handleAuthRequest("login", payload),
      signup: (payload) => handleAuthRequest("signup", payload),
      logout: handleLogout,
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
