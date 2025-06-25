import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createErrorResponse, ApiCategory } from "../helper/api-helper.js";

export function registerApiCategoriesTools(server: McpServer) {
  server.tool(
    "list_api_categories",
    "Lista todas las categorías de APIs disponibles en tu servidor MCP personalizado.",
    {},
    async () => {
      const toolName = "list_api_categories";
      
      try {
        // Define tus categorías personalizadas aquí
        const categories: ApiCategory[] = [
          {
            name: "Node APIs",
            description: "APIs de nodos blockchain para consultas directas",
            supportedProtocols: ["ethereum", "polygon", "arbitrum"]
          },
          {
            name: "Data APIs", 
            description: "APIs de datos indexados y procesados",
            supportedProtocols: ["ethereum", "polygon", "base"]
          },
          {
            name: "Analytics APIs",
            description: "APIs de análisis y métricas personalizadas",
            supportedProtocols: ["ethereum", "polygon"]
          }
        ];

        const formattedList = categories.map(category => 
          `- ${category.name}: ${category.description}\n  Protocolos: ${category.supportedProtocols.join(', ')}`
        ).join('\n');

        const content = `Categorías de APIs Disponibles:\n\n${formattedList}`;
        
        return { content: [{ type: "text", text: content }] };
        
      } catch (error) {
        return createErrorResponse(`Error al listar categorías: ${(error as Error).message}`, toolName);
      }
    }
  );
}