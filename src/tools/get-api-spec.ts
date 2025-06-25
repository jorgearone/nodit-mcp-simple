import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createErrorResponse } from "../helper/api-helper.js";

export function registerGetApiSpecTool(server: McpServer) {
  server.tool(
    "get_api_specification",
    "Obtiene la especificación completa de una operación específica.",
    {
      operationId: z.string().describe("ID de la operación (ej: 'eth_getBalance')")
    },
    async ({ operationId }) => {
      const toolName = "get_api_specification";
      
      try {
        // Define especificaciones detalladas aquí
        const detailedSpecs: Record<string, any> = {
          "eth_getBalance": {
            operationId: "eth_getBalance",
            description: "Retorna el balance de una cuenta en una dirección dada",
            parameters: [
              {
                name: "address",
                type: "string",
                required: true,
                description: "Dirección de la cuenta a consultar"
              },
              {
                name: "blockTag", 
                type: "string",
                required: false,
                default: "latest",
                description: "Número de bloque o tag (latest, earliest, pending)"
              }
            ],
            returns: {
              type: "string",
              description: "Balance en wei (hexadecimal)"
            },
            example: {
              request: {
                address: "0x742d35Cc6634C0532925a3b8D5c9C364e2E2f1c5",
                blockTag: "latest"
              },
              response: "0x1b1ae4d6e2ef500000"
            }
          }
        };

        const spec = detailedSpecs[operationId];
        if (!spec) {
          return createErrorResponse(`Especificación para '${operationId}' no encontrada`, toolName);
        }

        return { 
          content: [{ 
            type: "text", 
            text: JSON.stringify(spec, null, 2) 
          }] 
        };
        
      } catch (error) {
        return createErrorResponse(`Error al obtener especificación: ${(error as Error).message}`, toolName);
      }
    }
  );
}