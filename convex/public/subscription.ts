import { query } from "../_generated/server";
import { verifyAuth } from "../auth";

export const getUserSubscription = query({
    handler: async (ctx) => {
        const identity = await verifyAuth(ctx);

        const userId = identity.subject;

        // Query theo customerId hoặc userId
        return await ctx.db
            .query("subscriptions")
            .withIndex("by_customer_id", (q) => q.eq("customerId", userId))
            .unique();
    },
});
