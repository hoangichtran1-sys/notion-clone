import { User } from "@/types";
import { Label } from "../ui/label";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea, InputGroupText } from "../ui/input-group";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { z } from "zod";

interface UpdateBioProps {
    user: User;
}

const bioSchema = z.string().max(200).nullish();

export const UpdateBio = ({ user }: UpdateBioProps) => {
    const [bio, setBio] = useState(user.bio || "");

    const onEditBio = async () => {
        const result = bioSchema.safeParse(bio);
        if (result.success) {
            await authClient.updateUser({
                bio: result.data,
            });
            toast.success("Bio updated!");
        } else {
            toast.error("Failed to validate bio");
        }
    };

    return (
        <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <InputGroup>
                <InputGroupTextarea id="block-end-textarea" placeholder="Write a Bio..." value={bio} onChange={(e) => setBio(e.target.value)} />
                <InputGroupAddon align="block-end">
                    <InputGroupText>{bio.length}/200</InputGroupText>
                    <InputGroupButton variant="secondary" size="sm" className="ml-auto" onClick={onEditBio}>
                        Save
                    </InputGroupButton>
                </InputGroupAddon>
            </InputGroup>
        </div>
    );
};
