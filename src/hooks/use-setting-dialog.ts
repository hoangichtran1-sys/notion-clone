import { settingDialogState } from "@/atoms/setting-dialog-state";
import { useAtom } from "jotai";

export const useSettingDialog = () => {
    const [openSettingDialog, setOpenSettingDialog] =
        useAtom(settingDialogState);

    const onOpenSettingDialog = () => setOpenSettingDialog(true);
    const onCloseSettingDialog = () => setOpenSettingDialog(false);

    return {
        openSettingDialog,
        setOpenSettingDialog,
        onOpenSettingDialog,
        onCloseSettingDialog,
    };
};
