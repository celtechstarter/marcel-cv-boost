const PROJECT_URL = "https://grryxotfastfmgrrfrun.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdycnl4b3RmYXN0Zm1ncnJmcnVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNjI2MTgsImV4cCI6MjA3MjYzODYxOH0.X7JZd44NkeNbOevZQSGf-EgJyZx9iNKwWz6xH6ftE8M";

export async function callEdge(path: string, init?: RequestInit) {
  const res = await fetch(`${PROJECT_URL}/functions/v1/api${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${ANON_KEY}`,
      ...(init?.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "Request failed");
  return data;
}