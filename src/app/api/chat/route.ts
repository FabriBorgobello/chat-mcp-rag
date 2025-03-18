import { openai } from "@ai-sdk/openai";
import {
  streamText,
  experimental_createMCPClient as createMCPClient,
} from "ai";

const mcps = await createMCPClient({
  transport: {
    type: "stdio",
    command: "npx",
    args: ["tsx", "/Users/fabricioborgobello/Code/chat-mcp-rag/mcp/index.ts"],
  },
});

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: openai("gpt-4o-mini"),
      system:
        "You are a helpful, friendly AI assistant focused on giving support for Fully AI.",
      messages,
      tools: await mcps.tools(),
      maxSteps: 10,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process chat request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
