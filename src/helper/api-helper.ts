export function log(message: string, ...args: any[]) {
  console.error(message, ...args);
}

export function createErrorResponse(message: string, toolName: string) {
  log(`Tool Error (${toolName}): ${message}`);
  return { 
    content: [{ 
      type: "text" as const, 
      text: `Error: ${message}` 
    }] 
  };
}

export function normalizeDescription(description: string | undefined): string {
  if (!description) {
    return "Sin descripción disponible.";
  }
  
  const lines = description.split('\n');
  const filteredLines = lines.filter(line => !line.trimStart().startsWith('>'));
  
  return filteredLines.join('\n').trim();
}

// Tipos de datos para tu API específica
export interface ApiSpec {
  operationId: string;
  description: string;
  parameters: any[];
  requestBody?: any;
  responses?: any;
}

export interface ApiCategory {
  name: string;
  description: string;
  supportedProtocols: string[];
}