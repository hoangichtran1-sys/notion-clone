import { isAuthenticated } from "@/lib/auth-server";
import { initEdgeStore } from "@edgestore/server";
import { createEdgeStoreNextHandler } from "@edgestore/server/adapters/next/app";
const es = initEdgeStore.create();
/**
 * This is the main router for the EdgeStore buckets.
 */
const edgeStoreRouter = es.router({
    publicFiles: es
        .fileBucket()
        .beforeUpload(async ({ ctx, input, fileInfo }) => {
            const isAuth = await isAuthenticated();
            if (!isAuth) {
                throw new Error("Unauthorized");
            }
            console.log("beforeUpload", ctx, input, fileInfo);
            return true; // allow upload
        })
        .beforeDelete(async ({ ctx, fileInfo }) => {
            const isAuth = await isAuthenticated();
            if (!isAuth) {
                throw new Error("Unauthorized");
            }
            console.log("beforeDelete", ctx, fileInfo);
            return true; // allow delete
        }),
});
const handler = createEdgeStoreNextHandler({
    router: edgeStoreRouter,
});
export { handler as GET, handler as POST };
/**
 * This type is used to create the type-safe client for the frontend.
 */
export type EdgeStoreRouter = typeof edgeStoreRouter;
