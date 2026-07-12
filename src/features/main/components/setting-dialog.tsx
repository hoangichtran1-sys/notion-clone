"use client";

import { ToggleMode } from "@/components/toggle-mode";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useSettingDialog } from "@/hooks/use-setting-dialog";

export const SettingDialog = () => {
    const { openSettingDialog, setOpenSettingDialog } = useSettingDialog();

    return (
        <Dialog open={openSettingDialog} onOpenChange={setOpenSettingDialog}>
            <DialogContent>
                <DialogHeader className="border-b pb-3">
                    <h2 className="text-lg font-medium">My settings</h2>
                </DialogHeader>
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-1">
                        <Label>Appearance</Label>
                        <span className="text-[0.8rem] text-muted-foreground">
                            Customize how Notion looks on your device
                        </span>
                    </div>
                    <ToggleMode />
                </div>
            </DialogContent>
        </Dialog>
    );
};
