# MCP 101 — TypeScript

A hands-on learning project for the Model Context Protocol (MCP) built in TypeScript. The goal is to get practical experience with MCP's three core primitives — **tools**, **resources**, and **prompts** — by building a document server and a CLI client that communicates with it over stdio.

This is the TypeScript port of the [Python version](../mcp-101-cli-project).

---

## What You'll Learn

- How to build an MCP server in TypeScript using `@modelcontextprotocol/sdk`
- How to define tools, resources (static + template), and prompts
- How to inspect a running server with MCP Inspector
- How to build an MCP client that connects over stdio and calls all three primitives

---

## Project Structure

```
mcp-101-cli-project-ts/
├── src/
│   ├── server.ts       ← MCP server: tools, resources, prompts
│   └── client.ts       ← CLI MCP client over stdio
├── package.json
├── tsconfig.json
├── pnpm-lock.yaml
├── CLAUDE.md
└── README.md
```

---

## Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)

---

## Setup

```bash
# Install dependencies
pnpm install
```

No `.env` file needed for the server/client. The server uses in-memory documents only.

---

## Running Locally

### Run the MCP server directly
```bash
pnpm server
# or
npx tsx src/server.ts
```

### Run the CLI client
```bash
pnpm client
# or
npx tsx src/client.ts
```

### Inspect the server with MCP Inspector
```bash
npx @modelcontextprotocol/inspector tsx src/server.ts
```

Opens the MCP Inspector UI in your browser. Use it to:
- Browse all registered tools, resources, and prompts
- Call tools with custom arguments
- Read resources by URI
- Execute prompts with parameters

---

## MCP Primitives Implemented

### Tools
| Name | Description | Arguments |
|---|---|---|
| `read_doc_content` | Returns the content of a document | `doc_id: string` |
| `edit_document` | Replaces a string inside a document | `doc_id, old_string, new_string: string` |

### Resources
| URI | Type | Description |
|---|---|---|
| `docs://documents` | Static | Returns a list of all document IDs |
| `docs://documents/{doc_id}` | Template | Returns the content of a specific document |

### Prompts
| Name | Description | Arguments |
|---|---|---|
| `format` | Rewrites a document in markdown format | `doc_id: string` |

---

## Key Differences From Python Version

| Python | TypeScript |
|---|---|
| `FastMCP` | `McpServer` from `@modelcontextprotocol/sdk` |
| `@mcp.tool()` decorator | `server.tool()` method |
| `@mcp.resource()` decorator | `server.resource()` / `server.resourceTemplate()` |
| `@mcp.prompt()` decorator | `server.prompt()` method |
| Pydantic for validation | Zod for validation |
| `uv run server.py` | `tsx src/server.ts` |
| `mcp dev server.py` | `npx @modelcontextprotocol/inspector tsx src/server.ts` |
