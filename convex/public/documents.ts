import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { verifyAuth } from "../auth";
import { Doc, Id } from "../_generated/dataModel";
import { internal } from "../_generated/api";

export const getDocuments = query({
    handler: async (ctx) => {
        const identity = await verifyAuth(ctx);
        const userId = identity.subject;

        const documents = ctx.db
            .query("documents")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .order("desc")
            .collect();

        return documents;
    },
});

export const getSearch = query({
    handler: async (ctx) => {
        const identity = await verifyAuth(ctx);
        const userId = identity.subject;

        const documents = ctx.db
            .query("documents")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .filter((q) => q.eq(q.field("isArchived"), false))
            .order("desc")
            .collect();

        return documents;
    },
});

export const getPrivateDocument = query({
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
        const identity = await verifyAuth(ctx);
        const userId = identity.subject;

        const document = await ctx.db.get("documents", args.id);

        if (!document) {
            throw new ConvexError({
                message: "Not found",
                code: "NOT_FOUND",
            });
        }

        if (document.userId !== userId) {
            throw new ConvexError({
                message: "Forbidden",
                code: "FORBIDDEN",
            });
        }

        return document;
    },
});

export const getPublishedDocument = query({
    args: { id: v.id("documents") },
    handler: async (ctx, args) => {
        const document = await ctx.db.get("documents", args.id);

        if (!document || !document.isPublished || document.isArchived) {
            throw new ConvexError({
                message: "Not found",
                code: "NOT_FOUND",
            });
        }

        return document;
    },
});

export const update = mutation({
    args: {
        id: v.id("documents"),
        title: v.optional(v.string()),
        content: v.optional(v.string()),
        coverImage: v.optional(v.string()),
        icon: v.optional(v.string()),
        isPublished: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const identity = await verifyAuth(ctx);
        const userId = identity.subject;

        const { id, ...rest } = args;

        const existingDocument = await ctx.db.get("documents", id);

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

        await ctx.db.patch("documents", id, {
            ...rest,
        });

        if (args.title || args.content) {
            await ctx.runMutation(
                internal.system.documents_snapshot.updateContentWithHistory,
                {
                    id: args.id,
                    userId,
                    title: args.title,
                    content: args.content,
                    event: "update",
                },
            );
        }

        const documentUpdated = await ctx.db.get("documents", id);

        return documentUpdated;
    },
});

export const archive = mutation({
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

        const recursiveArchive = async (documentId: Id<"documents">) => {
            const children = await ctx.db
                .query("documents")
                .withIndex("by_user_parent", (q) =>
                    q.eq("userId", userId).eq("parentDocument", documentId),
                )
                .collect();

            for (const child of children) {
                await ctx.db.patch("documents", child._id, {
                    isArchived: true,
                });

                await recursiveArchive(child._id);
            }
        };

        await ctx.db.patch("documents", args.id, {
            isArchived: true,
        });

        await recursiveArchive(args.id);

        const updatedDocument = await ctx.db.get("documents", args.id);

        return updatedDocument;
    },
});

export const create = mutation({
    args: {
        title: v.string(),
        parentDocument: v.optional(v.id("documents")),
    },
    handler: async (ctx, args) => {
        const identity = await verifyAuth(ctx);

        const userId = identity.subject;
        const documentId = await ctx.db.insert("documents", {
            title: args.title,
            parentDocument: args.parentDocument,
            userId,
            isArchived: false,
            isPublished: false,
        });

        await ctx.runMutation(
            internal.system.documents_snapshot.updateContentWithHistory,
            {
                id: documentId,
                userId,
                title: args.title,
                content: undefined,
                event: "create",
            },
        );

        return documentId;
    },
});

export const getTreeMany = query({
    args: {
        parentDocument: v.optional(v.id("documents")),
    },
    handler: async (ctx, args) => {
        const identity = await verifyAuth(ctx);

        const userId = identity.subject;

        const documents = await ctx.db
            .query("documents")
            .withIndex("by_user_parent", (q) =>
                q
                    .eq("userId", userId)
                    .eq("parentDocument", args.parentDocument),
            )
            .filter((q) => q.eq(q.field("isArchived"), false))
            .order("desc")
            .collect();

        return documents;
    },
});

export const getTrash = query({
    handler: async (ctx) => {
        const identity = await verifyAuth(ctx);

        const userId = identity.subject;

        const documents = await ctx.db
            .query("documents")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .filter((q) => q.eq(q.field("isArchived"), true))
            .order("desc")
            .collect();

        return documents;
    },
});

export const restore = mutation({
    args: { id: v.id("documents") },
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

        const recursiveRestore = async (documentId: Id<"documents">) => {
            const children = await ctx.db
                .query("documents")
                .withIndex("by_user_parent", (q) =>
                    q.eq("userId", userId).eq("parentDocument", documentId),
                )
                .collect();

            for (const child of children) {
                await ctx.db.patch("documents", child._id, {
                    isArchived: false,
                });

                await recursiveRestore(child._id);
            }
        };

        const options: Partial<Doc<"documents">> = {
            isArchived: false,
        };

        if (existingDocument.parentDocument) {
            const parent = await ctx.db.get(
                "documents",
                existingDocument.parentDocument,
            );
            if (parent?.isArchived) {
                options.parentDocument = undefined;
            }
        }

        await ctx.db.patch("documents", args.id, options);

        await recursiveRestore(args.id);

        const updatedDocument = await ctx.db.get("documents", args.id);

        return updatedDocument;
    },
});

export const destroy = mutation({
    args: { id: v.id("documents") },
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
            .collect();

        for (const version of documentsVersion) {
            await ctx.db.delete("documentsSnapshot", version._id);
        }

        await ctx.db.delete("documents", args.id);

        return existingDocument;
    },
});

export const removeIcon = mutation({
    args: { id: v.id("documents") },
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

        await ctx.db.patch("documents", args.id, {
            icon: undefined,
        });

        const documentUpdated = await ctx.db.get("documents", args.id);

        return documentUpdated;
    },
});

export const removeCover = mutation({
    args: { id: v.id("documents") },
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

        await ctx.db.patch("documents", args.id, {
            coverImage: undefined,
        });

        const documentUpdated = await ctx.db.get("documents", args.id);

        return documentUpdated;
    },
});
