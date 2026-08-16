import { Buffer } from "buffer";
if (typeof globalThis.Buffer === "undefined") {
    globalThis.Buffer = Buffer;
}

import { httpRouter } from "convex/server";
import { authComponent, createAuth } from "./betterAuth/auth";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import {
    validateEvent,
    WebhookVerificationError,
} from "@polar-sh/sdk/webhooks";

const http = httpRouter();
authComponent.registerRoutes(http, createAuth);

http.route({
    path: "/polar-webhook",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        const rawBody = await request.text();

        const headers: Record<string, string> = {
            "webhook-id": request.headers.get("webhook-id") || "",
            "webhook-timestamp": request.headers.get("webhook-timestamp") || "",
            "webhook-signature": request.headers.get("webhook-signature") || "",
        };

        const secret = process.env.POLAR_WEBHOOK_SECRET || "";

        if (!secret) {
            console.error("POLAR_WEBHOOK_SECRET is missing!");
            return new Response("Webhook secret not configured", {
                status: 500,
            });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let event: any;

        try {
            event = validateEvent(
                rawBody,
                headers,
                process.env.POLAR_WEBHOOK_SECRET!,
            );
        } catch (err) {
            console.error("Polar Webhook Verification Failed:", err);
            if (err instanceof WebhookVerificationError) {
                return new Response("Invalid signature", { status: 400 });
            }
            return new Response("Webhook verification error", { status: 400 });
        }

        // 2. Xử lý Event
        if (event.type === "customer.state_changed") {
            const payload = event.data;
            const customerId = payload.externalId;

            if (!customerId) {
                return new Response("Customer ID is required", { status: 404 });
            }

            const rawSubscriptions = payload.activeSubscriptions ?? [];
            const activeCount = Array.isArray(rawSubscriptions)
                ? rawSubscriptions.length
                : 0;

            const status = activeCount > 0 ? "active" : "inactive";

            try {
                await ctx.runMutation(
                    internal.system.subscriptions.syncSubscription,
                    {
                        customerId,
                        status,
                        activeSubscriptions: activeCount,
                    },
                );
            } catch (mutationError) {
                console.error("Convex Mutation Failed:", mutationError);
                return new Response("Mutation error", { status: 500 });
            }
        }

        return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }),
});

export default http;
