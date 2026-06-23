import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, clearToken, getToken, saveToken } from "@/src/api";

export type GaiaUser = {
  user_id: string;
  email: string;
  name: string;
  picture?: string | null;
  points: number;
  level: number;
  active_pet_id?: string;
  unlocked_pets: string[];
  auth_provider: string;
};

type AuthCtx = {
  user: GaiaUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  googleSignIn: (session_id: string) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<GaiaUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const token = await getToken();
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const me = await api.me();
      setUser(me);
    } catch {
      await clearToken();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await refresh();
      setLoading(false);
    })();
  }, [refresh]);

  const finishAuth = async (resp: any) => {
    await saveToken(resp.session_token);
    setUser(resp.user);
  };

  const signIn = async (email: string, password: string) => {
    const r = await api.login(email, password);
    await finishAuth(r);
  };
  const signUp = async (email: string, password: string, name: string) => {
    const r = await api.register(email, password, name);
    await finishAuth(r);
  };
  const googleSignIn = async (session_id: string) => {
    const r = await api.google(session_id);
    await finishAuth(r);
  };
  const signOut = async () => {
    try { await api.logout(); } catch { /* ignore */ }
    await clearToken();
    setUser(null);
  };

  return (
    <Ctx.Provider value={{ user, loading, signIn, signUp, googleSignIn, signOut, refresh }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
