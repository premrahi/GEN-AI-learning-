import { useEffect, useRef, useState } from "react";
import { sendChat, summarizeTicket } from "./api.js";

export default function App() {
  // ---- summarizer state ----
  const [ticket, setTicket] = useState("");
  const [summary, setSummary] = useState("");
  const [summarizing, setSummarizing] = useState(false);
  const [summarizeError, setSummarizeError] = useState("");
  const [copied, setCopied] = useState(false);

  // ---- chat state ----
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I'm your support assistant. Ask me anything about refunds, orders or policies.",
    },
  ]);
  const [input, setInput] = useState("");
  const [replying, setReplying] = useState(false);
  const [chatError, setChatError] = useState("");
  const threadRef = useRef(null);

  useEffect(() => {
    threadRef.current?.scrollTo({
      top: threadRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, replying]);

  async function handleSummarize() {
    const text = ticket.trim();
    if (!text || summarizing) return;

    setSummarizing(true);
    setSummarizeError("");
    setSummary("");
    try {
      const result = await summarizeTicket(text);
      setSummary(result);
    } catch (err) {
      setSummarizeError(err.message);
    } finally {
      setSummarizing(false);
    }
  }

  async function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || replying) return;

    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setReplying(true);
    setChatError("");
    try {
      const reply = await sendChat(text);
      setMessages((m) => [...m, { role: "assistant", text: reply }]);
    } catch (err) {
      setChatError(err.message);
    } finally {
      setReplying(false);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard blocked — no-op
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Customer Service Executive</h1>
          <p>Summarize support tickets &amp; answer customer questions</p>
        </div>
      </header>

      <main className="panels">
        {/* ---------- summarizer ---------- */}
        <section className="card">
          <h2>Ticket Summarizer</h2>
          <p className="hint">Paste a long support ticket and get a short summary.</p>

          <textarea
            value={ticket}
            onChange={(e) => setTicket(e.target.value)}
            placeholder="e.g. Customer ordered a blue hoodie on 3rd Oct, received a green one. Wants a refund and is upset about the 7-day window ending soon…"
            rows={9}
            disabled={summarizing}
          />
          <div className="row">
            <span className="count">{ticket.trim().length} chars</span>
            <button onClick={handleSummarize} disabled={summarizing || !ticket.trim()}>
              {summarizing ? "Summarizing…" : "Summarize"}
            </button>
          </div>

          {summarizeError && (
            <div className="error" role="alert">{summarizeError}</div>
          )}

          {summary && (
            <div className="result">
              <div className="row result-head">
                <strong>Summary</strong>
                <button className="ghost" onClick={handleCopy}>
                  {copied ? "Copied ✓" : "Copy"}
                </button>
              </div>
              <p className="summary-text">{summary}</p>
            </div>
          )}
        </section>

        {/* ---------- chat ---------- */}
        <section className="card chat-card">
          <h2>Support Assistant</h2>
          <p className="hint">Ask a question as if you were a customer.</p>

          <div className="thread" ref={threadRef}>
            {messages.map((m, i) => (
              <div key={i} className={`bubble ${m.role}`}>
                {m.text}
              </div>
            ))}
            {replying && (
              <div className="bubble assistant typing">
                <span /><span /><span />
              </div>
            )}
          </div>

          {chatError && (
            <div className="error" role="alert">{chatError}</div>
          )}

          <form className="composer" onSubmit={handleSend}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message…"
              disabled={replying}
              autoFocus
            />
            <button type="submit" disabled={replying || !input.trim()}>
              Send
            </button>
          </form>
        </section>
      </main>

      <footer className="app-footer">
        Backend endpoints: <code>POST /api/summarize</code> · <code>POST /api/chat</code>
      </footer>
    </div>
  );
}
