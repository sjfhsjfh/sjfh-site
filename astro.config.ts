import { defineConfig } from "astro/config";
import typstIntegration from "./src/integrations/typst";

// https://astro.build/config
export default defineConfig({
    integrations: [typstIntegration({})],
});
