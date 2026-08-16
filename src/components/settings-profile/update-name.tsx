import { User } from "@/types";
import { Label } from "../ui/label";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "../ui/input-group";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { z } from "zod";

interface UpdateNameProps {
    user: User;
}

const nameSchema = z.string().max(100).optional();

export const UpdateName = ({ user }: UpdateNameProps) => {
    const [name, setName] = useState(user.name);

    const onEditUsername = async () => {
        const result = nameSchema.safeParse(name);
        if (result.success) {
            await authClient.updateUser({
                name: result.data,
            });
            toast.success("Username updated!");
        } else {
            toast.error("Faile to validate name");
        }
    };

    return (
        <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <InputGroup>
                <InputGroupInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter username..." />
                <InputGroupAddon align="inline-end">
                    <InputGroupButton onClick={onEditUsername} variant="secondary">
                        Save
                    </InputGroupButton>
                </InputGroupAddon>
            </InputGroup>
        </div>
    );
};
