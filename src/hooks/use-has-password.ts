import { authClient } from "@/lib/auth-client";
import { useCallback, useEffect, useState } from "react";

export const useHasPassword = () => {
    const [hasPassword, setHasPassword] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkPassword = useCallback(async () => {
        setIsLoading(true);

        try {
            const res = await authClient.listAccounts();
            const accounts = res.data ?? [];

            const exists = accounts.some((acc) => acc.providerId === "credential" || acc.providerId === "email");

            setHasPassword(exists);
        } catch {
            setHasPassword(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        checkPassword();
    }, [checkPassword]);

    return { hasPassword, isLoading, refetch: checkPassword };
};
