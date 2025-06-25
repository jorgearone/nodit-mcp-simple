import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { log } from "./helper/api-helper.js";
import { registerAllTools } from "./tools/index.js";
async function main() {
    const server = new McpServer({
        name: "mi-mcp-server",
        version: "1.0.0",
        capabilities: {
            resources: {},
            tools: {},
        },
    });
    // Registrar todas las herramientas
    registerAllTools(server);
    // Configurar transporte
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
main().then(() => {
    log("Mi MCP Server iniciado exitosamente.");
}).catch((error) => {
    log("Error fatal en main():", error);
    process.exit(1);
});
