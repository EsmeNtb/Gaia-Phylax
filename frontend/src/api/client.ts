const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const SESSION_KEY = "gaia.session_token";

export function saveToken(token: string) {
  localStorage.setItem(SESSION_KEY, token);
}

export function getToken() {
  return localStorage.getItem(SESSION_KEY);
}

export function clearToken() {
  localStorage.removeItem(SESSION_KEY);
}

export type FireSignal = {
  id: number;
  latitude: number;
  longitude: number;
  confidence: string;
  frp: number;
  brightness: number;
  daynight: string;
  detected_at_utc: string;
  fire_intensity: "low" | "medium" | "high" | string;
};

export type CitizenReport = {
  id: string;
  title: string;
  description?: string;
  category?: string;
  latitude: number;
  longitude: number;
  country?: string;
  city?: string;
  urgency?: string;
  status?: string;
  related_species?: string;
  created_at?: string;
};

export type Species = {
  id: number;
  taxon_id?: number;
  scientific_name?: string;
  taxon_rank?: string;
  kingdom?: string;
  phylum?: string;
  class_name?: string;
  order_name?: string;
  family?: string;
  genus?: string;
  taxonomic_status?: string;
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  register: (email: string, password: string, name: string) => {
    return request<{ session_token: string | null; user: any }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });
  },

  login: (email: string, password: string) => {
    return request<{ session_token: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  me: () => {
    return request<any>("/auth/me");
  },

  logout: () => {
    return request<{ ok: boolean }>("/auth/logout", {
      method: "POST",
    });
  },

  getFires: (intensity?: string, limit = 100) => {
    const params = new URLSearchParams();

    params.set("limit", String(limit));

    if (intensity) {
      params.set("intensity", intensity);
    }

    return request<FireSignal[]>(`/fires/?${params.toString()}`);
  },

  getHighFires: (limit = 100) => {
    return request<FireSignal[]>(`/fires/high?limit=${limit}`);
  },

  getReports: (limit = 100) => {
    return request<CitizenReport[]>(`/reports/?limit=${limit}`);
  },

  createReport: (data: Omit<CitizenReport, "id" | "created_at">) => {
    return request<CitizenReport[]>("/reports/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getSpecies: (limit = 100) => {
    return request<Species[]>(`/species/?limit=${limit}`);
  },

  searchSpecies: (query: string, limit = 50) => {
    const params = new URLSearchParams();

    params.set("q", query);
    params.set("limit", String(limit));

    return request<Species[]>(`/species/search?${params.toString()}`);
  },
};