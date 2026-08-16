import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
    server: {
        EDGE_STORE_ACCESS_KEY: z.string().min(1),
        EDGE_STORE_SECRET_KEY: z.string().min(1),
        POLAR_ACCESS_TOKEN: z.string().min(1),
        MAIL_HOST: z.string().min(1),
        MAIL_PORT: z.coerce.number(),
        MAIL_SECURE: z
            .preprocess((val) => val === "true" || val === "1", z.boolean())
            .default(false),
        MAIL_USERNAME: z.string().min(1),
        MAIL_PASSWORD: z.string().min(1),
        MAIL_FROM_ADDRESS: z.string().min(1),
        EMAIL_API_KEY: z.string().min(1),
    },
    experimental__runtimeEnv: {},
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
