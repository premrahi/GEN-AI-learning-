// The backend returns plain text for both endpoints, so we send the raw
// body as text/plain and read the response as text.
async function post(path, body) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body,
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(text || `Request failed (${res.status})`);
  }
  return text;
}

export const summarizeTicket = (ticket) => post("/api/summarize", ticket);
export const sendChat = (message) => post("/api/chat", message);
