import { defineCollection, z } from "astro:content";
import {
    NodeCompiler,
    NodeTypstCompileResult,
    NodeTypstDocument,
} from "@myriaddreamin/typst-ts-node-compiler";
import fg from "fast-glob";
import { readFileSync } from "fs";
import { basename, dirname, join } from "path";

type TypstFrontMatter = {
    title: string;
    created: string | null;
    updated: string | null;
};

const compiler = NodeCompiler.create();

(await fg("src/blog/**/*.typ")).forEach(async (file) => {
    compiler.addSource(file, readFileSync(file, "utf-8"));
});

const getFrontMatter = async (file: NodeTypstDocument) => {
    const res = await compiler.query(file, {
        selector: "<front-matter>",
        field: "value",
    });
    if (res.length != 1) {
        throw new Error(`Expected 1 front-matter, got ${res.length}`);
    }
    return res[0];
};

const typstBlogs = defineCollection({
    loader: async () => {
        const files = await fg("src/blog/posts/**/*.typ");
        const postsMeta = [];

        for (const pair of files.map((fname) => [
            fname,
            compiler.compileHtml({ mainFilePath: fname }),
        ])) {
            const [fname, f] = pair as [string, NodeTypstCompileResult];
            const res = f.result;
            if (res !== null) {
                postsMeta.push({
                    id: basename(fname, ".typ"),
                    html: compiler.html(res),
                    ...({
                        title: res.title,
                        ...(await getFrontMatter(res)),
                    } as TypstFrontMatter),
                });
            } else {
                console.error(f.takeDiagnostics()?.shortDiagnostics);
            }
        }
        return postsMeta;
    },
    schema: z.object({
        title: z.string(),
        html: z.string(),
        created: z.string().nullable(),
        updated: z.string().nullable(),
    }),
});

export const collections = { blog: typstBlogs };
