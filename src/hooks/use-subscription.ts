import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export const useHasActiveSubscription = () => {
    const { isAuthenticated } = useConvexAuth();
    const customerState = useQuery(
        api.public.subscription.getUserSubscription,
        isAuthenticated ? {} : "skip",
    );

    return {
        subscription: customerState,
        hasActiveSubscription: !!customerState?.isPro,
        isLoading: customerState === undefined,
    };
};
