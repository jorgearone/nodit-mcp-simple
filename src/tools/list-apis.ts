import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createErrorResponse, ApiSpec } from "../helper/api-helper.js";

export function registerListApisTools(server: McpServer) {
  server.tool(
    "list_available_apis",
    "Lista todas las operaciones disponibles para una categoría específica.",
    {
      category: z.string().describe("Categoría de APIs (ej: 'Node APIs', 'Data APIs')")
    },
    async ({ category }) => {
      const toolName = "list_available_apis";
      
      try {
        // Define tus APIs específicas aquí
        const apiSpecs: Record<string, ApiSpec[]> = {
          "Node APIs": [
            {
              operationId: "eth_getBalance",
              description: "Obtiene el balance de una dirección",
              parameters: ["address", "blockTag"]
            },
            {
              operationId: "eth_getTransactionByHash", 
              description: "Obtiene detalles de una transacción por hash",
              parameters: ["transactionHash"]
            }
          ],
          "Data APIs": [
            {
              operationId: "getTokensByAccount",
              description: "Obtiene todos los tokens de una cuenta",
              parameters: ["accountAddress", "chainId"]
            },
            {
              operationId: "getNFTsByAccount",
              description: "Obtiene NFTs de una cuenta específica", 
              parameters: ["accountAddress", "limit", "offset"]
            }
          ]
        };

        const apis = apiSpecs[category];
        if (!apis) {
          return createErrorResponse(`Categoría '${category}' no encontrada`, toolName);
        }

        const formattedList = apis.map(api => 
          `- ${api.operationId}: ${api.description}\n  Parámetros: ${api.parameters.join(', ')}`
        ).join('\n');

        const content = `APIs disponibles en ${category}:\n\n${formattedList}`;
        
        return { content: [{ type: "text", text: content }] };
        
      } catch (error) {
        return createErrorResponse(`Error al listar APIs: ${(error as Error).message}`, toolName);
      }
    }
  );
}