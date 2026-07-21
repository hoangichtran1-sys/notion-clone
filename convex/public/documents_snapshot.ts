import { mutation, query } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { verifyAuth } from "../auth";
import { internal } from "../_generated/api";

export const restoreVersion = mutation({
    args: {
        versionId: v.id("documentsSnapshot"),
        documentId: v.id("documents"),
    },
    handler: async (ctx, args) => {
        const identity = await verifyAuth(ctx);
        const userId = identity.subject;

        const existingDocument = await ctx.db.get("documents", args.documentId);
        const existingVersion = await ctx.db.get(
            "documentsSnapshot",
            args.versionId,
        );

        if (!existingDocument || !existingVersion) {
            throw new ConvexError({
                message: "Not found",
                code: "NOT_FOUND",
            });
        }

        if (
            existingDocument.userId !== userId ||
            existingVersion.createdBy !== userId
        ) {
            throw new ConvexError({
                message: "Forbidden",
                code: "FORBIDDEN",
            });
        }

        await ctx.db.patch("documents", args.documentId, {
            title: existingVersion.title,
            content: existingVersion.content,
        });

        const documentUpdated = await ctx.db.get("documents", args.documentId);

        if (documentUpdated) {
            await ctx.runMutation(
                internal.system.documents_snapshot.updateContentWithHistory,
                {
                    id: args.documentId,
                    userId,
                    title: existingVersion.title,
                    content: existingVersion.content,
                    event: "restore",
                },
            );
            // await ctx.db.delete("documentsSnapshot", args.versionId);
        }

        return documentUpdated;
    },
});

export const removeVersion = mutation({
    args: {
        versionId: v.id("documentsSnapshot"),
        documentId: v.id("documents"),
    },
    handler: async (ctx, args) => {
        const identity = await verifyAuth(ctx);
        const userId = identity.subject;

        const existingVersion = await ctx.db.get(
            "documentsSnapshot",
            args.versionId,
        );

        if (!existingVersion) {
            throw new ConvexError({
                message: "Not found",
                code: "NOT_FOUND",
            });
        }

        if (existingVersion.createdBy !== userId) {
            throw new ConvexError({
                message: "Forbidden",
                code: "FORBIDDEN",
            });
        }

        await ctx.db.delete("documentsSnapshot", args.versionId);

        return existingVersion;
    },
});

export const getDocumentsHistory = query({
    args: {
        id: v.id("documents"),
    },
    handler: async (ctx, args) => {
        const identity = await verifyAuth(ctx);
        const userId = identity.subject;

        const existingDocument = await ctx.db.get("documents", args.id);

        if (!existingDocument) {
            throw new ConvexError({
                message: "Not found",
                code: "NOT_FOUND",
            });
        }

        if (existingDocument.userId !== userId) {
            throw new ConvexError({
                message: "Forbidden",
                code: "FORBIDDEN",
            });
        }

        const documentsVersion = await ctx.db
            .query("documentsSnapshot")
            .withIndex("by_documentId", (q) => q.eq("documentId", args.id))
            .order("desc")
            .collect();

        return documentsVersion;
    },
});
