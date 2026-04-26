// MCP Server — DocumentMCP
// Exposes in-memory documents via tools, resources, and prompts over stdio transport.
// Run: npx tsx src/server.ts
// Inspect: npx @modelcontextprotocol/inspector tsx src/server.ts

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";

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

server.registerResource(
  "documents",
  "docs://documents",
  { description: "returns all the documents" },
  async (uri) => {
    return {
      contents: [
        { text: JSON.stringify(Object.keys(docs)), uri: uri.href, mimeType: "application/json" },
      ],
    };
  }
);

server.registerResource(
  "document-content",
  new ResourceTemplate("docs://documents/{doc_id}", { list: undefined }),
  { description: "returns the document content by the ID" },
  async (uri) => {
    const doc_id = uri.href.split("/").pop()!;
    if (!(doc_id in docs)) {
      return { contents: [{ uri: uri.href, text: "doc id not found" }] };
    }
    return { contents: [{ uri: uri.href, mimeType: "text/plain", text: docs[doc_id] }] };
  }
);

server.registerPrompt(
  "format",
  {
    description: "Rewrites a document in clearn markdown",
    argsSchema: {
      doc_id: z.string().describe("The ID of the document to format"),
    },
  },
  async ({ doc_id }) => {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Your goal is to reformat the document to be written with markdown syntax.
            
            Add in headers, bullet points, tables, etc as necessary. Feel free to add in structure.
            Use the 'edit_document' tool to edit the document.
            
            Document ID: ${doc_id}
            Content: ${docs[doc_id]}`,
          },
        },
      ],
    };
  }
);
const transport = new StdioServerTransport();
await server.connect(transport);
