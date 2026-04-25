// MCP Server — DocumentMCP
// Exposes in-memory documents via tools, resources, and prompts over stdio transport.
// Run: npx tsx src/server.ts
// Inspect: npx @modelcontextprotocol/inspector tsx src/server.ts

// TODO: import McpServer and StdioServerTransport from @modelcontextprotocol/sdk
// TODO: import zod for tool/prompt input validation

// TODO: define in-memory docs map (doc_id -> content)

// TODO: initialise McpServer with a name and version

// TODO: register read_doc_content tool
// TODO: register edit_document tool

// TODO: register docs://documents static resource (returns list of doc IDs as JSON)
// TODO: register docs://documents/{doc_id} template resource (returns doc content as plain text)

// TODO: register format prompt (rewrites a doc in markdown using edit_document tool)

// TODO: connect server to StdioServerTransport and start listening
