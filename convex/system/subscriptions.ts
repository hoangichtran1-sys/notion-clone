import { v } from "convex/values";
import { internalMutation } from "../_generated/server";

export const syncSubscription = internalMutation({
    args: {
        customerId: v.string(),
        status: v.string(),
        activeSubscriptions: v.number(),
    },

    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("subscriptions")
            .withIndex("by_customer_id", (q) =>
                q.eq("customerId", args.customerId),
            )
            .unique();

        if (existing) {
            await ctx.db.patch(existing._id, {
                status: args.status,
                activeSubscriptions: args.activeSubscriptions,
                isPro: args.activeSubscriptions > 0,
            });

            return;
        }

        await ctx.db.insert("subscriptions", {
            customerId: args.customerId,
            status: args.status,
            activeSubscriptions: args.activeSubscriptions,
            isPro: args.activeSubscriptions > 0,
        });
    },
});
