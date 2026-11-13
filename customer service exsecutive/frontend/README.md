# Customer Service Executive — Frontend

React (Vite) UI for the ticket summarizer backend.
Two tools in one screen: **Ticket Summarizer** (`POST /api/summarize`) and
**Support Assistant chat** (`POST /api/chat`).

## Run

Terminal 1 — backend (port **4000**):

```
cd ../backend
npm run dev
```

Terminal 2 — frontend (port **8080**):

```
npm install
npm run dev
```

Open **http://localhost:8080**

## How the connection works

The Vite dev server proxies every `/api/*` request to `http://localhost:4000`
(see `vite.config.js`), so the browser only ever talks to port 8080 and there
are no CORS issues.

If you change the backend port, update the `proxy.target` in `vite.config.js`.
