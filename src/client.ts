// MCP Client — CLI
// Connects to the MCP server over stdio and demonstrates listing and calling
// all three primitives: tools, resources, and prompts.
// Run: npx tsx src/client.ts

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: "npx",
  args: ["tsx", "src/server.ts"],
});

const client = new Client({ name: "DocumentClient", version: "1.0.0" });
await client.connect(transport);

// List all tools
const tools = await client.listTools();
console.log("Tools:", JSON.stringify(tools, null, 2));

// List all resources
const resources = await client.listResources();
console.log("Resources:", JSON.stringify(resources, null, 2));

// List all prompts
const prompts = await client.listPrompts();
console.log("Prompts:", JSON.stringify(prompts, null, 2));

// Call read_doc_content tool
const toolResult = await client.callTool({
  name: "read_doc_content",
  arguments: { doc_id: "deposition.md" },
});
console.log("Tool result:", JSON.stringify(toolResult, null, 2));

// Read static resource
const resourceResult = await client.readResource({ uri: "docs://documents" });
console.log("Resource result:", JSON.stringify(resourceResult, null, 2));

// Read template resource
const templateResult = await client.readResource({ uri: "docs://documents/deposition.md" });
console.log("Template result:", JSON.stringify(templateResult, null, 2));

// Get prompt
const promptResult = await client.getPrompt({
  name: "format",
  arguments: { doc_id: "deposition.md" },
});
console.log("Prompt result:", JSON.stringify(promptResult, null, 2));

await client.close();
