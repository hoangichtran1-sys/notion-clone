/* eslint-disable @typescript-eslint/no-unused-vars */
import { createClient } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import type { GenericCtx } from "@convex-dev/better-auth/utils";
import type { BetterAuthOptions } from "better-auth";
import { betterAuth } from "better-auth";
import { components, internal } from "../_generated/api";
import type { DataModel } from "../_generated/dataModel";
import authConfig from "../auth.config";
import schema from "./schema";
import { polar, checkout, portal } from "@polar-sh/better-auth";
import { polarClient } from "../lib/polar";
import { emailOTP } from "better-auth/plugins";
import { sendEmail } from "../lib/resend";
import { ActionCtx, MutationCtx } from "../_generated/server";

// Better Auth Component
export const authComponent = createClient<DataModel, typeof schema>(components.betterAuth, {
    local: { schema },
    verbose: false,
});

// Better Auth Options
export const createAuthOptions = (ctx: GenericCtx<DataModel>) => {
    return {
        appName: "Notion Clone",
        baseURL: process.env.SITE_URL,
        secret: process.env.BETTER_AUTH_SECRET,
        database: authComponent.adapter(ctx),
        emailAndPassword: {
            enabled: true,
            minPasswordLength: 8,
            maxPasswordLength: 100,
            autoSignIn: true,
            requireEmailVerification: false,
        },
        emailVerification: {
            sendVerificationEmail: async ({ user, url, token }, request) => {
                await sendEmail({
                    to: user.email,
                    subject: "Verify your email address",
                    html: `Click the link to verify your email: ${url}`,
                });
            },
            sendOnSignUp: false, // true if on sign up
        },
        socialProviders: {
            github: {
                clientId: process.env.GITHUB_CLIENT_ID!,
                clientSecret: process.env.GITHUB_CLIENT_SECRET!,
            },
            google: {
                clientId: process.env.GOOGLE_CLIENT_ID!,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            },
        },
        user: {
            deleteUser: {
                enabled: true,
                sendDeleteAccountVerification: async ({ user, url, token }, request) => {
                    await sendEmail({
                        to: user.email,
                        subject: "Verify Deletion Account",
                        html: `
                            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ec3c10;">
                                <p>Click the link to delete account (<strong>This action cannot be undone</strong>)</p>:
                                <a href="${url}" 
                                        style="display: inline-block; background: #f21322; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                                        Delete Now
                                </a>
                            </div>    
                        `,
                    });
                },
                beforeDelete: async (user, request) => {
                    try {
                        const userSubscriptions = await polarClient.subscriptions.list({
                            externalCustomerId: user.id,
                            active: true,
                        });
                        for (const sub of userSubscriptions.result.items) {
                            // await polarClient.subscriptions.update({
                            //     id: sub.id,
                            //     subscriptionUpdate: {
                            //         cancelAtPeriodEnd: true,
                            //         customerCancellationReason: "customer_service",
                            //     },
                            // });
                            await polarClient.subscriptions.revoke({
                                id: sub.id,
                            });
                        }
                    } catch (error) {
                        console.log(error);
                        throw error;
                    }
                    await (ctx as MutationCtx).runMutation(internal.system.document.cleanUpData, {
                        userId: user.id,
                    });
                },
            },
            additionalFields: {
                bio: {
                    type: "string",
                    required: false,
                },
            },
        },
        databaseHooks: {
            user: {
                create: {
                    after: async (user, ctx) => {
                        const customer = await polarClient.customers.getStateExternal({
                            externalId: user.id,
                        });

                        const isSubscription = customer.activeSubscriptions && customer.activeSubscriptions.length > 0;

                        console.log(isSubscription);
                    },
                },
            },
        },
        account: {
            accountLinking: {
                enabled: true,
                allowDifferentEmails: false, // Recommend
                trustedProviders: ["google", "email-password", "github"],
            },
        },
        advanced: {
            cookiePrefix: "notion-clone",
        },
        plugins: [
            convex({ authConfig }),
            polar({
                client: polarClient,
                createCustomerOnSignUp: true,
                use: [
                    checkout({
                        products: [
                            {
                                productId: "2fd2112f-d627-405b-bfe7-f2b1fdf49243",
                                slug: "Notion-Pro",
                            },
                        ],
                        successUrl: process.env.POLAR_SUCCESS_URL,
                        authenticatedUsersOnly: true,
                    }),
                    portal(),
                ],
            }),
            emailOTP({
                async sendVerificationOTP({ email, otp, type }) {
                    const html = `
                            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #cccccc;">
                                <p style="margin: 5px 0;">Your OTP authentication code is: 
                                    <strong style="font-size: 12px;">${otp}</strong>
                                </p>
                            </div>
                        `;
                    if (type === "email-verification") {
                        await sendEmail({
                            to: email,
                            subject: "Email verification code",
                            html,
                        });
                    } else if (type === "forget-password") {
                        await sendEmail({
                            to: email,
                            subject: "Password reset verification code",
                            html,
                        });
                    }
                },
            }),
        ],
    } satisfies BetterAuthOptions;
};

// For `auth` CLI
export const options = createAuthOptions({} as GenericCtx<DataModel>);

// Better Auth Instance
export const createAuth = (ctx: GenericCtx<DataModel>) => {
    return betterAuth(createAuthOptions(ctx));
};
