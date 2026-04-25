// MCP Server — DocumentMCP
// Exposes in-memory documents via tools, resources, and prompts over stdio transport.
// Run: npx tsx src/server.ts
// Inspect: npx @modelcontextprotocol/inspector tsx src/server.ts

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const docs: Record<string, string> = {
  "deposition.md": "This deposition covers the testimony of John Doe, P.E.",
  "complaint.md": "This complaint was filed by the plaintiff on January 1, 2020.",
  "contract.md": "This contract is between John Doe and Jane Doe.",
};

const server = new McpServer({
  name: "DocumentMCP",
  version: "1.0.0",
});

server.registerTool(
  "read_doc_content",
  {
    description: "Return the content of the document by its ID",
    inputSchema: {
      doc_id: z.string().describe("The ID of the document to read"),
    },
  },
  async ({ doc_id }) => {
    if (!(doc_id in docs)) {
      return {
        content: [{ type: "text", text: `The document with ${doc_id} does not exist` }],
        isError: true,
      };
    }

    return { content: [{ type: "text", text: docs[doc_id] }] };
  }
);

server.registerTool(
  "edit_document",
  {
    description: "Replace a string inside a document",
    inputSchema: {
      doc_id: z.string().describe("The ID of the document to edit"),
      old_string: z.string().describe("The string to replace"),
      new_string: z.string().describe("The string to replace with"),
    },
  },
  async ({ doc_id, old_string, new_string }) => {
    if (!(doc_id in docs)) {
      return {
        content: [{ type: "text", text: `Document with ID: ${doc_id} not found` }],
        isError: true,
      };
    }

    if (!docs[doc_id].includes(old_string)) {
      return {
        content: [{ type: "text", text: `${old_string} is not found in ${doc_id}` }],
        isError: true,
      };
    }

    docs[doc_id] = docs[doc_id].replace(old_string, new_string);
    return { content: [{ type: "text", text: docs[doc_id] }] };
  }
);

// TODO: register docs://documents static resource (returns list of doc IDs as JSON)
// TODO: register docs://documents/{doc_id} template resource (returns doc content as plain text)

// TODO: register format prompt (rewrites a doc in markdown using edit_document tool)

const transport = new StdioServerTransport();
await server.connect(transport);
