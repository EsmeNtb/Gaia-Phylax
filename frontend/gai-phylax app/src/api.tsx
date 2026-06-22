import { storage } from "@/src/utils/storage";

const BASE = process.env.EXPO_PUBLIC_BACKEND_URL || "";
const SESSION_KEY = "gaia.session_token";

async function authHeader(): Promise<Record<string, string>> {
  const token = await storage.secureGet<string>(SESSION_KEY, "");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function saveToken(token: string) {
  await storage.secureSet(SESSION_KEY, token);
}

export async function clearToken() {
  await storage.secureRemove(SESSION_KEY);
}

export async function getToken(): Promise<string | null> {
  const t = await storage.secureGet<string>(SESSION_KEY, "");
  return t || null;
}

async function request<T = any>(
  path: string,
  opts: { method?: string; body?: any; auth?: boolean } = {}
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (opts.auth !== false) Object.assign(headers, await authHeader());
  const res = await fetch(`${BASE}/api${path}`, {
    method: opts.method || "GET",
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }
  if (!res.ok) {
    const msg = data?.detail || data?.message || `HTTP ${res.status}`;
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  }
  return data as T;
}

export const api = {
  // auth
  register: (email: string, password: string, name: string) =>
    request("/auth/register", { method: "POST", body: { email, password, name }, auth: false }),
  login: (email: string, password: string) =>
    request("/auth/login", { method: "POST", body: { email, password }, auth: false }),
  google: (session_id: string) =>
    request("/auth/google", { method: "POST", body: { session_id }, auth: false }),
  me: () => request("/auth/me"),
  logout: () => request("/auth/logout", { method: "POST" }),

  // reports
  listReports: (params: { category?: string; urgency?: string } = {}) => {
    const q = new URLSearchParams();
    if (params.category) q.set("category", params.category);
    if (params.urgency) q.set("urgency", params.urgency);
    const qs = q.toString();
    return request(`/reports${qs ? `?${qs}` : ""}`);
  },
  nearMe: (lat: number, lng: number, radius_km = 25) =>
    request(`/reports/near?lat=${lat}&lng=${lng}&radius_km=${radius_km}`),
  getReport: (id: string) => request(`/reports/${id}`),
  viewReport: (id: string) => request(`/reports/${id}/view`, { method: "POST" }),
  likeReport: (id: string) => request(`/reports/${id}/like`, { method: "POST" }),
  createReport: (body: any) => request("/reports", { method: "POST", body }),

  // ai
  classify: (description: string, photo_base64?: string) =>
    request("/ai/classify", { method: "POST", body: { description, photo_base64 } }),

  // pets
  petsCatalog: () => request("/pets/catalog", { auth: false }),
  myPets: () => request("/pets/me"),
  activatePet: (pet_id: string) => request("/pets/activate", { method: "POST", body: { pet_id } }),
  feedPet: (pet_id: string) => request("/pets/feed", { method: "POST", body: { pet_id } }),
  playPet: (pet_id: string) => request("/pets/play", { method: "POST", body: { pet_id } }),
};
