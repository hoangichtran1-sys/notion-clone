import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { authComponent, createAuth } from "../betterAuth/auth";

export const getCurrentUser = query({
    args: {},
    handler: async (ctx) => {
        const { auth, headers } = await authComponent.getAuth(createAuth, ctx);

        const session = await auth.api.getSession({ headers });

        if (!session) {
            return null;
        }

        return session.user;
    },
});

export const setPassword = mutation({
    args: {
        password: v.string(),
    },
    handler: async (ctx, args) => {
        const { auth, headers } = await authComponent.getAuth(createAuth, ctx);

        const session = await auth.api.getSession({ headers });

        if (!session) {
            throw new ConvexError({
                message: "Unauthorized",
                code: "UNAUTHORIZED",
            });
        }

        await auth.api.setPassword({
            body: {
                newPassword: args.password,
            },
            headers,
        });

        return { success: true };
    },
});
