import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
    server: {
        EDGE_STORE_ACCESS_KEY: z.string().min(1),
        EDGE_STORE_SECRET_KEY: z.string().min(1),
        
    },
    experimental__runtimeEnv: {},
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
