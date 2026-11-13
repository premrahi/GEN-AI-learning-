import express from "express";
import cors from "cors";

export function createApp(summarizeService) {
  if (!summarizeService?.summarize) {
    throw new TypeError("A summarize service is required!");
  }
  if (!summarizeService?.chat) {
    throw new TypeError("A chat service is required!");
  }

  const app = express();
    app.use(cors({ origin: /^http:\/\/localhost:\d+$/ }));

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

  app.post('/api/chat' , async(req , res) => {

    const message = typeof req.body === 'string' ?  req.body : "" ;

    if(!message) {
      return res.status(400).type("text/plain").send("Message is required!");
    }

    try{
      const reply = await summarizeService.chat(message) ;
      return res.type("text/plain").send(reply);
    }
    catch(e){
      console.error("Failed to get a chat reply ",e) 
      return res.status(500).type("text/plain").send("Failed to get a reply!") ;
    }
  })

  return app;
}
