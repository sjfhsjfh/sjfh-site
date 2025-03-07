import { type AstroIntegration } from "astro";
import vitePluginTypst from "@myriaddreamin/vite-plugin-typst";
import { onResolveParts } from "../posts/model";

interface TypstIntegrationConfig {}

const typstIntegration = (config: TypstIntegrationConfig): AstroIntegration => {
    return {
        name: "typst",
        hooks: {
            "astro:config:setup": (opts) => {
                opts.updateConfig({
                    vite: {
                        // @ts-ignore
                        plugins: [vitePluginTypst({ onResolveParts })],
                    },
                });
            },
        },
    };
};

export default typstIntegration;
