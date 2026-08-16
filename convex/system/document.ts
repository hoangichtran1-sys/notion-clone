import { v } from "convex/values";
import { internalMutation } from "../_generated/server";

// export const createSubscription = internalMutation({
//     args: {
//         userId: v.string()
//     },
//     handler: async (ctx, args) => {
//         const subscription = await ctx.db.query("subscriptions")
//             .withIndex("by_customer_id", (q) => q.eq("customerId", args.userId)).unique();

//         if (subscription?.isPro) {
//             await ctx.db.patch("subscriptions", subscription._id, {

//             })
//         }
//     }
// })

export const cleanUpData = internalMutation({
    args: {
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        const [documents, subscription] = await Promise.all([
            ctx.db
                .query("documents")
                .withIndex("by_user", (q) => q.eq("userId", args.userId))
                .collect(),
            ctx.db
                .query("subscriptions")
                .withIndex("by_customer_id", (q) => q.eq("customerId", args.userId))
                .unique(),
        ]);

        await Promise.all(
            documents.map(async (doc) => {
                // Lấy tất cả snapshots của doc này
                const snapshots = await ctx.db
                    .query("documentsSnapshot")
                    .withIndex("by_documentId", (q) => q.eq("documentId", doc._id))
                    .collect();

                // Xóa song song tất cả snapshots
                await Promise.all(snapshots.map((s) => ctx.db.delete(s._id)));

                // Xóa document
                await ctx.db.delete(doc._id);
            }),
        );

        if (subscription) {
            await ctx.db.delete("subscriptions", subscription._id);
        }

        return { success: true };
    },
});
