"use client";

import { Loader2Icon, MailIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { format } from "date-fns";
import { useConfirm } from "@/hooks/use-confirm";
import { ResponsiveModal } from "../responsive-modal";
import { useSettingsProfileModal } from "@/hooks/use-settings-profile-modal";
import { VerifyEmail } from "./verify-email";
import { AvatarUpload } from "./avatar-upload";
import { toast } from "sonner";
import { ChangePassword } from "./change-password";
import { UpdateName } from "./update-name";
import { UpdateBio } from "./update-bio";
import { ListProviderSocial } from "./list-provider-social";

interface SettingsProfileProps {
    className?: string;
}

export const SettingsProfile = ({ className }: SettingsProfileProps) => {
    const { data, isPending } = authClient.useSession();
    const user = data?.user;

    const { onCloseSettingsProfileModal, openSettingsProfileModal } = useSettingsProfileModal();

    const [RemoveConfirmation, confirmRemove] = useConfirm("Are you sure?", "The following action will permanently remove your account");

    const onDeleteUser = async () => {
        const ok = await confirmRemove();
        if (!ok) return;

        await authClient.deleteUser({
            callbackURL: "/goodbye",
        });
        toast.success("Check your email for instructions on how to delete your account.");
    };

    if (!user) {
        return null;
    }

    return (
        <ResponsiveModal
            title={`Account Profile (Created at ${format(user.createdAt, "MMMM do, yyyy")})`}
            description="Update your personal information and profile picture"
            isOpen={openSettingsProfileModal}
            onClose={onCloseSettingsProfileModal}
            isSeparator={true}
            className={className}
        >
            <RemoveConfirmation />
            {isPending && (
                <div className="flex h-full justify-center items-center">
                    <Loader2Icon className="size-6 animate-spin text-primary" />
                </div>
            )}
            <Card className="w-full">
                <CardContent className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <AvatarUpload user={user} />
                        <VerifyEmail user={user} />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <InputGroup>
                                <InputGroupInput type="email" defaultValue={user.email} disabled />
                                <InputGroupAddon>
                                    <MailIcon />
                                </InputGroupAddon>
                            </InputGroup>
                        </div>
                        <UpdateName user={user} />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <ChangePassword />
                        <ListProviderSocial />
                    </div>

                    <UpdateBio user={user} />
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button onClick={onCloseSettingsProfileModal} variant="outline">
                        Cancel
                    </Button>
                    <Button onClick={onDeleteUser} variant="destructive">
                        Delete Account
                    </Button>
                </CardFooter>
            </Card>
        </ResponsiveModal>
    );
};
