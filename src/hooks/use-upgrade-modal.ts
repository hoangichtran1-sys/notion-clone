import { subscriptionModalState } from "@/atoms/subscription-modal-state";
import { useAtom } from "jotai";

export const useUpgradeModal = () => {
    const [openSubscriptionModal, setOpenSubscriptionModal] = useAtom(
        subscriptionModalState,
    );

    const onOpenSubscriptionModal = () => setOpenSubscriptionModal(true);
    const onCloseSubscriptionModal = () => setOpenSubscriptionModal(false);

    return {
        openSubscriptionModal,
        setOpenSubscriptionModal,
        onOpenSubscriptionModal,
        onCloseSubscriptionModal,
    };
};
