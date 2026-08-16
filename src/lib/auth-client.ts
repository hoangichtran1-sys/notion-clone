import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { polarClient } from "@polar-sh/better-auth";
import { emailOTPClient } from "better-auth/client/plugins";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    plugins: [
        convexClient(),
        polarClient(),
        emailOTPClient(),
        inferAdditionalFields({
            user: {
                bio: {
                    type: "string",
                    required: false,
                },
            },
        }),
    ],
});
