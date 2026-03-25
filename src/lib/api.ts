const API_BASE = import.meta.env.VITE_API_URL || "";

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/api${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    console.warn("Unauthorized → redirecting to login");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href = "/auth";
    return;
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "API request failed");
  }

  return res.json();
}