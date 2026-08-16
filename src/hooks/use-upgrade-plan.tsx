import { useHasActiveSubscription } from "./use-subscription";
import { useUpgradeModal } from "./use-upgrade-modal";

export const useUpgradePlan = () => {
    const subscriptionModal = useUpgradeModal();
    const { hasActiveSubscription, isLoading } = useHasActiveSubscription();

    const shouldBlock = !hasActiveSubscription;

    return {
        isLoading,
        shouldBlock,
        triggerUpgradeModal: () => {
            subscriptionModal.onOpenSubscriptionModal();
        },
    };
};
