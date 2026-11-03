import Groq from "groq-sdk";
import "dotenv/config";

const Default_model = "openai/gpt-oss-120b";

export function summarizeService({
  client = new Groq({ apiKey: process.env.GROQ_API_KEY }),
  model = process.env.GROQ_MODEL || Default_model,
} = {}) {
  return {
    async summarize(ticket) {
      const response = await client.chat.completions.create({
        model,
        messages: [
          {
            role: "user",
            content: `summarize this support ticket in 2 lines : \n\n ${ticket}`,
          },
        ],
      });

      const summary = response.choices?.[0]?.message?.content ;

      if(!summary){
        throw new Error("Groq returned an empty summary") ;
      }

      return summary ;
    },
  };
}
