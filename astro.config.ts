import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";
import { resolve } from "path";

// https://astro.build/config
export default defineConfig({
    // experimental: {
    //     fonts: [
    //         {
    //             provider: fontProviders.google(),
    //             name: "Montserrat",
    //             cssVariable: "--font-montserrat",
    //             fallbacks: ["sans"],
    //         }
    //     ]
    // },
    vite: {
        plugins: [tailwindcss() as any],
        resolve: {
            alias: {
                "@layouts": resolve("./src/layouts"),
                "@components": resolve("./src/components"),
                "@assets": resolve("./src/assets"),
            },
        },
    },
});
