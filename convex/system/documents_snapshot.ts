import { internalMutation } from "../_generated/server";
import { v } from "convex/values";

export const updateContentWithHistory = internalMutation({
    args: {
        id: v.id("documents"),
        title: v.optional(v.string()),
        content: v.optional(v.string()),
        userId: v.string(),
        event: v.union(
            v.literal("create"),
            v.literal("update"),
            v.literal("restore"),
        ),
    },
    handler: async (ctx, args) => {
        const existingDocument = await ctx.db.get("documents", args.id);

        let message = "No change";

        if (args.event === "create") {
            message = "Create new docment";
        }

        if (args.event === "restore") {
            message = "Restore version document";
        }

        if (args.event === "update" && args.title) {
            message = "Update title document";
        }

        if (args.event === "update" && args.content) {
            message = "Update content document";
        }

        const latestVersion = await ctx.db
            .query("documentsSnapshot")
            .withIndex("by_documentId", (q) => q.eq("documentId", args.id))
            .order("desc")
            .first();

        const FIVE_MINUTES = 3 * 60 * 1000;
        const now = Date.now();

        if (
            !latestVersion ||
            latestVersion.event === "create" ||
            latestVersion.event === "restore" ||
            now - latestVersion._creationTime > FIVE_MINUTES
        ) {
            await ctx.db.insert("documentsSnapshot", {
                documentId: args.id,
                title: args.title ?? existingDocument?.title ?? "",
                content:
                    args.content ??
                    existingDocument?.content ??
                    JSON.stringify([
                        {
                            type: "paragraph",
                        },
                    ]),
                createdBy: args.userId,
                message,
                event: args.event,
            });
        } else {
            await ctx.db.patch("documentsSnapshot", latestVersion._id, {
                title: args.title ?? latestVersion.title,
                content: args.content ?? latestVersion.content,
                message,
            });
        }
    },
});
