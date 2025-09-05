const PROJECT_URL = "https://grryxotfastfmgrrfrun.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdycnl4b3RmYXN0Zm1ncnJmcnVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNjI2MTgsImV4cCI6MjA3MjYzODYxOH0.X7JZd44NkeNbOevZQSGf-EgJyZx9iNKwWz6xH6ftE8M";

export async function callEdge(path: string, init?: RequestInit) {
  // Auto-detect method based on body presence
  let method = init?.method;
  if (!method && init?.body) {
    method = 'POST';
  }
  
  // Guard against GET/HEAD with body
  if ((method === 'GET' || method === 'HEAD') && init?.body) {
    throw new Error('Interner Fehler: GET/HEAD dürfen keinen Request-Body haben.');
  }

  const res = await fetch(`${PROJECT_URL}/functions/v1/api${path}`, {
    ...init,
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${ANON_KEY}`,
      ...(init?.headers || {}),
    },
  });
  
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || data?.message || 'Unerwarteter Fehler.');
  return data;
}

// Helper for JSON POST requests
export async function callEdgeJson(path: string, payload: unknown) {
  return callEdge(path, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}