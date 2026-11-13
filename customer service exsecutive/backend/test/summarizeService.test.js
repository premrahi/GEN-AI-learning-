import assert from "node:assert/strict";
import test from "node:test";

import { summarizeService } from "../src/summarizeService.js";

test("summarize sends the expected prompt and model to Groq", async () => {
  let request;
  const client = {
    chat: {
      completions: {
        create: async (input) => {
          request = input;
          return {
            choices: [{ message: { content: "Line one.\nLine two." } }],
          };
        },
      },
    },
  };
  const service = summarizeService({ client, model: "test-model" });

  const result = await service.summarize("Printer is offline.");

  assert.equal(result, "Line one.\nLine two.");
  assert.deepEqual(request, {
    model: "test-model",
    messages: [
      {
        role: "user",
        content:
          "summarize this support ticket in 2 lines : \n\n Printer is offline.",
      },
    ],
  });
});

test("summarize throws when Groq returns an empty summary", async () => {
  const client = {
    chat: {
      completions: {
        create: async () => ({ choices: [{ message: { content: "" } }] }),
      },
    },
  };
  const service = summarizeService({ client, model: "test-model" });

  await assert.rejects(
    () => service.summarize("Printer is offline."),
    /Groq returned an empty summary/,
  );
});