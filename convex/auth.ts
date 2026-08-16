import { ConvexError } from "convex/values";
import { MutationCtx, QueryCtx } from "./_generated/server";
import { MAX_FREE_DOCUMENTS } from "./constants";

export const verifyAuth = async (ctx: QueryCtx | MutationCtx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
        throw new ConvexError({
            message: "Unauthorized",
            code: "UNAUTHORIZED",
        });
    }

    return identity;
};

export const verifySubscription = async (ctx: QueryCtx | MutationCtx) => {
    const identity = await verifyAuth(ctx);

    const userId = identity.subject;

    const documents = await ctx.db.query("documents").collect();

    const totalDocument = documents.length;

    const customer = await ctx.db
        .query("subscriptions")
        .withIndex("by_customer_id", (q) => q.eq("customerId", userId))
        .unique();

    const isPro = customer && customer.isPro;
    const isFreeDocumentsLimitReached = totalDocument >= MAX_FREE_DOCUMENTS;

    const shouldThrowDocumentError = isFreeDocumentsLimitReached && !isPro;

    if (shouldThrowDocumentError) {
        throw new ConvexError({
            code: "PAYMENT_REQUIRED",
            message: "Active subscription required",
        });
    }

    return userId;
};
