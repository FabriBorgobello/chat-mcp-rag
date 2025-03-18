import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { groundX } from "./groundx";

const server = new McpServer({
  name: "fully-mcp",
  version: "1.0.0",
});

server.tool(
  "getInformationFromDocumentation",
  { query: z.string() },
  async ({ query }) => {
    const FULLY_BUCKET = 16546;
    const response = await groundX.search.content(FULLY_BUCKET, { query });
    return { content: [{ type: "text", text: JSON.stringify(response) }] };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("GroundX MCP running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
