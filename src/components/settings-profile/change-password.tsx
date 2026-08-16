import { useState } from "react";
import { Label } from "../ui/label";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import { LockIcon, PencilIcon, PencilOffIcon } from "lucide-react";
import { useHasPassword } from "@/hooks/use-has-password";
import { Skeleton } from "../ui/skeleton";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const passwordSchema = z.string().min(8, "Password too short");

export const ChangePassword = () => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const { hasPassword, isLoading, refetch } = useHasPassword();

    const [password, setPassword] = useState<string | null>(null);
    const [oldPassword, setOldPassword] = useState<string>("");

    const toggleEdit = () => setIsEditing((current) => !current);

    const setPass = useMutation(api.public.user.setPassword);

    const onSetPassword = () => {
        const result = passwordSchema.safeParse(password);
        if (result.success) {
            setPass({ password: result.data })
                .then(() => {
                    toast.success("Password set successfully");
                    setPassword(null);
                    setIsEditing(false);
                    refetch();
                })
                .catch(() => toast.error("Failed to set password"))
                .finally(() => setIsEditing(false));
        } else {
            toast.error("Password validate failed");
        }
    };

    const onChangePassword = async () => {
        const result = passwordSchema.safeParse(password);
        if (result.success) {
            try {
                await authClient.changePassword({
                    newPassword: result.data,
                    currentPassword: oldPassword,
                    revokeOtherSessions: true,
                });

                toast.success("Change password successfully.");
                setPassword(null);
                setOldPassword("");
                setIsEditing(false);
                router.refresh();
            } catch (error) {
                console.error(error);
                toast.error("Failed to change password");
            }
        } else {
            toast.error("Password validate failed");
        }
    };

    if (isLoading) {
        return <Skeleton className="h-8 w-[50%]" />;
    }

    return (
        <div className="space-y-2 flex flex-col gap-x-2">
            <div className="flex items-center gap-x-2">
                <Label htmlFor="email">Password</Label>
                <Button type="button" title="toggle-editting" size="icon-xs" className="shadow-sm border rounded-full" onClick={toggleEdit} variant="outline">
                    {isEditing ? (
                        <>
                            <PencilOffIcon className="size-3" />
                        </>
                    ) : (
                        <>
                            <PencilIcon className="size-3" />
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <div className={cn("text-sm mt-2", !hasPassword && "text-slate-500 italic")}>
                    {!hasPassword && "No set password"}
                    {hasPassword && "************"}
                </div>
            )}

            {isEditing &&
                (hasPassword ? (
                    <div className="flex flex-col items-start gap-y-2">
                        <div className="grid lg:grid-cols-2 grid-cols-1 gap-2">
                            <InputGroup>
                                <InputGroupInput
                                    aria-label="old-password"
                                    placeholder="Old password"
                                    type="text"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                />
                                <InputGroupAddon>
                                    <LockIcon />
                                </InputGroupAddon>
                            </InputGroup>
                            <InputGroup>
                                <InputGroupInput
                                    aria-label="new-password"
                                    placeholder="New password"
                                    type="text"
                                    value={password || ""}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <InputGroupAddon>
                                    <LockIcon />
                                </InputGroupAddon>
                            </InputGroup>
                        </div>
                        <Button onClick={onChangePassword} title="change-password" variant="default" size="sm">
                            Change
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center gap-x-2 max-w-[50%]">
                        <InputGroup>
                            <InputGroupInput
                                aria-label="new-password"
                                placeholder="Set password"
                                type="text"
                                value={password || ""}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <InputGroupAddon>
                                <LockIcon />
                            </InputGroupAddon>
                        </InputGroup>
                        <Button onClick={onSetPassword} title="set-password" variant="default" size="sm">
                            Set
                        </Button>
                    </div>
                ))}
        </div>
    );
};
