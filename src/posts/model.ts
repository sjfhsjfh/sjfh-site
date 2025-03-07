import type { OnCompileCallback } from "@myriaddreamin/vite-plugin-typst/dist/compiler";
import type { NodeCompileProvider } from "@myriaddreamin/vite-plugin-typst/dist/compiler/node";

export interface BlogPostMeta {
    title: string;
}

export const onResolveParts: OnCompileCallback<
    NodeCompileProvider,
    BlogPostMeta
> = (mainFilePath, project, ctx) => {
    return {
        title: project.query(mainFilePath, {
            selector: "<frontmatter>",
            field: "value",
        })[0],
    };
};
