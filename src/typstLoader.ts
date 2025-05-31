import {
    NodeCompiler,
    NodeTypstDocument,
} from "@myriaddreamin/typst-ts-node-compiler";
import type { AstroIntegrationLogger } from "astro";
import type { Loader } from "astro/loaders";
import { z, type RenderedContent } from "astro:content";
import fg from "fast-glob";
import { readFileSync } from "fs";
import path from "path";

const POSTS_DIR = "src/blog/posts";

/**
 *  Generates a unique identifier for a Typst file based on its relative path.
 * @param p - The path to the Typst file
 * @param root - The root directory to resolve the path against
 * @returns A unique identifier for the Typst file based on its relative path
 */
const idOfPath = (p: string, root: string) => {
    const relPath = path.relative(root, p);
    return path.join(path.dirname(relPath), path.basename(relPath, ".typ"));
};

/**
 * Retrieves all Typst post file paths relative to `post_dir` with `.typ` extension removed.
 *
 * @param post_dir - The directory containing Typst posts
 * @returns Promise resolving to an array of relative file paths without the `.typ` extension
 */
const postPaths = async (post_dir: string) => {
    let absPaths = await fg(path.join(post_dir, "**/*.typ"), {
        onlyFiles: true,
    });
    return absPaths.map((p) => idOfPath(p, post_dir));
};

export type TypstFrontMatter = {
    abstract: string | null;
    created: string | null;
    updated: string | null;
};

const getFrontMatter = async (file: NodeTypstDocument) => {
    const res = await compiler.query(file, {
        selector: "<front-matter>",
        field: "value",
    });
    if (res.length != 1) {
        throw new Error(`Expected 1 front-matter, got ${res.length}`);
    }
    return res[0] as TypstFrontMatter;
};

const compiler = NodeCompiler.create();

const updateSrc = (compiler: NodeCompiler, file: string) => {
    compiler.mapShadow(file, readFileSync(file));
};

(await fg("src/blog/**/*")).forEach((file) => {
    updateSrc(compiler, file);
});

export const typstLoader: () => Loader = () => {
    return {
        name: "typst-loader",
        load: async ({
            config,
            store,
            logger,
            parseData,
            generateDigest,
            watcher,
        }): Promise<void> => {
            let ids = await postPaths(POSTS_DIR);

            logger.info(`Found ${ids.length} Typst posts.`);
            store.clear();

            const compileBlogPost = async (
                root: string,
                id: string,
                logger: AstroIntegrationLogger,
            ): Promise<{
                id: string;
                rendered: RenderedContent;
                digest: string;
                data: any;
            }> => {
                logger.info(`Compiling Typst file: ${id}`);
                const filePath = path.join(root, `${id}.typ`);
                compiler.unmapShadow(filePath);
                updateSrc(compiler, filePath);
                const compileResult = compiler.compileHtml({
                    mainFilePath: path.join(root, `${id}.typ`),
                });
                const res = compileResult.result;
                if (res === null) {
                    for (const diagnostic of compileResult.takeDiagnostics()
                        ?.shortDiagnostics ?? []) {
                        logger.error(
                            `Error in Typst file ${id}: ${diagnostic.message}`,
                        );
                    }
                    throw new Error(
                        `Failed to compile Typst file ${id}. See above for details.`,
                    );
                }
                for (const warning of compileResult.takeWarnings()
                    ?.shortDiagnostics ?? []) {
                    logger.warn(
                        `Warning in Typst file ${id}: ${warning.message}`,
                    );
                }
                const data = await parseData({
                    id,
                    data: {
                        html: compiler.html(res) ?? "",
                        ...{
                            title: res.title,
                            ...(await getFrontMatter(res)),
                        },
                    },
                });
                const digest = generateDigest(data);
                return {
                    id,
                    data,
                    rendered: { html: compiler.html(res) ?? "" },
                    digest,
                };
            };

            for (const id of ids) {
                store.set(await compileBlogPost(POSTS_DIR, id, logger));
            }

            watcher?.on("change", async (filePath) => {
                if (
                    // glob is experimental
                    path
                        .dirname(filePath)
                        .startsWith(path.join(config.root.pathname, POSTS_DIR))
                ) {
                    const id = idOfPath(filePath, POSTS_DIR);
                    logger.info(`File changed: ${filePath}`);

                    try {
                        const { rendered, data, digest } =
                            await compileBlogPost(POSTS_DIR, id, logger);
                        if (
                            store.set({
                                id,
                                rendered,
                                data,
                                digest,
                            })
                        ) {
                            logger.info(`Recompiled Typst post: ${id}`);
                        }
                    } catch (error) {
                        logger.error(`Failed to recompile Typst post: ${id}`);
                    }
                }
            });
        },
        schema: z.object({
            title: z.string(),
            html: z.string(),
            abstract: z.string().nullable(),
            created: z.string().nullable(),
            updated: z.string().nullable(),
        }),
    };
};
