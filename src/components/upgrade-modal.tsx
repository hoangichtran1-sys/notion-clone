"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { authClient } from "@/lib/auth-client";

export const UpgradeModal = () => {
    const { openSubscriptionModal, setOpenSubscriptionModal } =
        useUpgradeModal();

    return (
        <AlertDialog
            open={openSubscriptionModal}
            onOpenChange={setOpenSubscriptionModal}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Upgrade to Pro</AlertDialogTitle>
                    <AlertDialogDescription>
                        You need an active subscription to perform this action.
                        Upgrade to Pro to unlock all features.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() =>
                            authClient.checkout({ slug: "Notion-Pro" })
                        }
                    >
                        Upgrade Now
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
