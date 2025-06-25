import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createErrorResponse } from "../helper/api-helper.js";
import { createTimeoutSignal } from "../helper/timeout-helper.js";

const TIMEOUT_MS = 30_000;

export function registerCallApiTool(server: McpServer) {
  server.tool(
    "execute_api_call",
    "Ejecuta una llamada a la API especificada con los parámetros dados.",
    {
      operationId: z.string().describe("ID de la operación a ejecutar"),
      parameters: z.record(z.any()).describe("Parámetros para la llamada"),
      protocol: z.string().optional().describe("Protocolo blockchain (ethereum, polygon, etc.)"),
      network: z.string().optional().describe("Red (mainnet, testnet, etc.)")
    },
    async ({ operationId, parameters, protocol = "ethereum", network = "mainnet" }) => {
      const toolName = "execute_api_call";
      
      // Verificar API Key (ajusta según tu proveedor)
      const apiKey = process.env.YOUR_API_KEY;
      if (!apiKey) {
        return createErrorResponse("API Key no configurada", toolName);
      }

      const { signal, cleanup } = createTimeoutSignal(TIMEOUT_MS);

      try {
        // Construir URL de API (ajusta según tu proveedor)
        const apiUrl = `https://tu-proveedor.com/v1/${protocol}/${network}`;
        
        // Preparar request body según el operationId
        let requestBody: any;
        
        switch (operationId) {
          case "eth_getBalance":
            requestBody = {
              jsonrpc: "2.0",
              method: "eth_getBalance",
              params: [parameters.address, parameters.blockTag || "latest"],
              id: 1
            };
            break;
            
          case "getTokensByAccount":
            requestBody = {
              accountAddress: parameters.accountAddress,
              chainId: parameters.chainId || 1
            };
            break;
            
          default:
            return createErrorResponse(`Operación '${operationId}' no soportada`, toolName);
        }

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'User-Agent': 'mi-mcp-server'
          },
          body: JSON.stringify(requestBody),
          signal
        });

        if (!response.ok) {
          return createErrorResponse(`Error HTTP ${response.status}: ${response.statusText}`, toolName);
        }

        const responseData = await response.text();
        
        try {
          JSON.parse(responseData); // Validar que es JSON válido
          return { content: [{ type: "text", text: responseData }] };
        } catch {
          return createErrorResponse("Respuesta no es JSON válido", toolName);
        }

      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return createErrorResponse("Timeout en la petición", toolName);
        }
        return createErrorResponse(`Error de red: ${(error as Error).message}`, toolName);
      } finally {
        cleanup();
      }
    }
  );
}