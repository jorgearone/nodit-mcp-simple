export function log(message, ...args) {
    console.error(message, ...args);
}
export function createErrorResponse(message, toolName) {
    log(`Tool Error (${toolName}): ${message}`);
    return {
        content: [{
                type: "text",
                text: `Error: ${message}`
            }]
    };
}
export function normalizeDescription(description) {
    if (!description) {
        return "Sin descripción disponible.";
    }
    const lines = description.split('\n');
    const filteredLines = lines.filter(line => !line.trimStart().startsWith('>'));
    return filteredLines.join('\n').trim();
}
