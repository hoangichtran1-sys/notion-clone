import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { capitalizeFirst } from "@/lib/utils";

export const ListProviderSocial = () => {
    const [listProvider, setListProvider] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        authClient
            .listAccounts()
            .then(({ data, error }) => {
                if (error) {
                    throw error;
                }
                const providers = (data ?? []).map((account) => account.providerId);
                setListProvider(providers);
            })
            .catch((error) => console.error(error))
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Label htmlFor="bio">Social Provider</Label>
                <div className="flex items-center gap-x-2">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <Skeleton key={index} className="h-4 w-12" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <Label htmlFor="bio">Social Provider</Label>
            {listProvider.map((provider, index) => (
                <Badge variant="default" key={index} className="mr-2">
                    {capitalizeFirst(provider)}
                </Badge>
            ))}
        </div>
    );
};
