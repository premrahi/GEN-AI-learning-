import Groq from "groq-sdk";
import "dotenv/config";

const Default_model = "openai/gpt-oss-120b";
const MAX_HISTORY = 20;

export function summarizeService({
  client = new Groq({ apiKey: process.env.GROQ_API_KEY }),
  model = process.env.GROQ_MODEL || Default_model,
  chatPrompt = `You are a smart customer service assistant who resolves customer queries. Remember what the customer tells you during the conversation.

  
  if the customer is angry or frustrated , use words like i understand your frustration , i am really sorry , etc to ease out the customer.


  never respond to messages that are not related to any order ,  product query , company policy or any harmful question unless it's there name or some thing related to them.
  if the customer ask irrelevant questions then just return something like : i don't know about that.

  
  never return more than 2 lines in response.
  `,
  context = "",
} = {}) {
  const history = [];

  const withContext = (prompt) =>
    context
      ? `${prompt}\n\nUse this background context when relevant:\n${context}`
      : prompt;

  async function ask(messages) {
    const response = await client.chat.completions.create({ model, messages });
    const text = response.choices?.[0]?.message?.content;

    if (!text) {
      throw new Error("Groq returned an empty response.");
    }
    return text;
  }

  return {
    async chat(message) {
      history.push({ role: "user", content: message });

      try {
        const reply = await ask([
          { role: "system", content: withContext(chatPrompt) },
          ...history.slice(-MAX_HISTORY),
        ]);

        history.push({ role: "assistant", content: reply });
        return reply;
      } catch (err) {
        history.pop();
        throw err;
      }
    },

    async summarize(ticket) {
      return ask([
        {
          role: "system",
          content: `you are a smart customer service assistant who resolves customer queries, summarize the customer query. 
          
          use professional language
          `,
        },
        {
          role: "user",
          content: `Summarize this customer query:\n\n${ticket}`,
        },
      ]);
    },
  };
}
