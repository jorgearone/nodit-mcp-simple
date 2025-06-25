import { registerApiCategoriesTools } from "./api-categories.js";
import { registerListApisTools } from "./list-apis.js";
import { registerGetApiSpecTool } from "./get-api-spec.js";
import { registerCallApiTool } from "./call-api.js";
export function registerAllTools(server) {
    registerApiCategoriesTools(server);
    registerListApisTools(server);
    registerGetApiSpecTool(server);
    registerCallApiTool(server);
}
