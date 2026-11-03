import express from "express";

export function createApp(summarizeService) {
  if (!summarizeService?.summarize) {
    throw new TypeError("A summarize service is required!");
  }

  const app = express();

  app.use(express.text({ type: "*/*", limit: "100kb" }));

  app.post("/api/summarize", async (req, res) => {
    const ticket = typeof req.body === "string" ? req.body : "";

    if (!ticket) {
      return res
        .status(400)
        .type("text/plain")
        .send("Ticket text is required!");
    }

    try {
      const summary = await summarizeService.summarize(ticket);
      return res.type("text/plain").send(summary);
    } catch (e) {
      console.error("Failed to summarize the Ticket", e);
      return res
        .status(500)
        .type("text/plain")
        .send("Failed to summarize the ticket");
    }
  });

  return app;
}
