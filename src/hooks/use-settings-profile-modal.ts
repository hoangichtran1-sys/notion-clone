import { settingsProfileModalState } from "@/atoms/settings-profile-modal";
import { useAtom } from "jotai";

export const useSettingsProfileModal = () => {
    const [openSettingsProfileModal, setOpenSettingsProfileModal] = useAtom(
        settingsProfileModalState,
    );

    const onOpenSettingsProfileModal = () => setOpenSettingsProfileModal(true);
    const onCloseSettingsProfileModal = () =>
        setOpenSettingsProfileModal(false);

    return {
        openSettingsProfileModal,
        setOpenSettingsProfileModal,
        onOpenSettingsProfileModal,
        onCloseSettingsProfileModal,
    };
};
