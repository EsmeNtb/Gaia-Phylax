import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "./api/supabaseClient";

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
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

function normalizeUser(user: any): GaiaUser {
  const metadata = user.user_metadata || {};

  return {
    user_id: user.id,
    email: user.email || "",
    name: metadata.name || metadata.full_name || user.email || "Gaia Guardian",
    picture: metadata.picture || null,
    points: 0,
    level: 1,
    active_pet_id: undefined,
    unlocked_pets: [],
    auth_provider: "supabase",
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<GaiaUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      setUser(null);
      return;
    }

    setUser(normalizeUser(user));
  }, []);

  useEffect(() => {
    async function bootAuth() {
      await refresh();
      setLoading(false);
    }

    bootAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(normalizeUser(session.user));
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [refresh]);

   async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Supabase login error:", error);
      throw error;
    }

    if (data.user) {
      setUser(normalizeUser(data.user));
    }
  }

  async function signUp(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      console.error("Supabase signup error:", error);
      throw error;
    }

    if (data.user) {
      setUser(normalizeUser(data.user));
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <Ctx.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        refresh,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);

  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return ctx;
}