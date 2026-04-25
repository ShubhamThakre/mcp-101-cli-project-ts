# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

A TypeScript learning project for MCP (Model Context Protocol). Implements an MCP server with tools, resources, and prompts over stdio transport, and a CLI client that connects to it. The Python equivalent lives at `../mcp-101-cli-project`.

## Commands

```bash
# Install dependencies
pnpm install

# Run the MCP server
pnpm server                  # or: npx tsx src/server.ts

# Run the CLI client
pnpm client                  # or: npx tsx src/client.ts

# Inspect the server in MCP Inspector
npx @modelcontextprotocol/inspector tsx src/server.ts
```

No lint, type checks, or test suite are configured.

## Architecture

```
src/server.ts   ← MCP server (stdio transport)
src/client.ts   ← CLI client that spawns server as subprocess and connects over stdio
```

**`src/server.ts`** — Built with `McpServer` from `@modelcontextprotocol/sdk`. Holds an in-memory `docs` map and exposes:
- Tools: `read_doc_content`, `edit_document`
- Resources: static `docs://documents`, template `docs://documents/{doc_id}`
- Prompts: `format`

**`src/client.ts`** — Connects to the server via `StdioClientTransport`. Demonstrates listing and calling all three MCP primitives from a client.

## Key Libraries

- `@modelcontextprotocol/sdk` — official MCP TypeScript SDK
- `zod` — schema validation for tool/prompt inputs (used by the SDK)
- `tsx` — runs TypeScript files directly without compiling

## Context7 — Up-to-date Docs via MCP

This project uses **Context7** to pull live, version-accurate documentation directly into the coding context. When working on MCP or SDK-related code, always resolve docs via Context7 before implementing.

### How to use Context7

When you need documentation for a library, add `use context7` to your prompt:

```
How do I register a resource template in @modelcontextprotocol/sdk? use context7
```

Context7 will resolve the correct library ID and inject the current docs into context — avoiding outdated or hallucinated API references.

### Key library IDs for this project

| Library | Context7 ID |
|---|---|
| MCP TypeScript SDK | `/modelcontextprotocol/typescript-sdk` |
| Zod | `/colinhacks/zod` |
| Node.js | `/nodejs/node` |

### When to use it

- Registering tools, resources, or prompts — SDK API changes between versions
- Zod schema patterns — v3 vs v4 have breaking differences
- Anything where you're unsure of the exact method signature

## TypeScript / SDK Conventions

- Use `zod` schemas for all tool and prompt input definitions
- Transport is always `StdioServerTransport` for the server
- Client uses `StdioClientTransport` spawning the server as a subprocess
- No compilation step needed — `tsx` handles it at runtime
