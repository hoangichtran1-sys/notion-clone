import { useAtom } from "jotai";
import { searchModalState } from "../atoms/search-modal-state";

export const useSearchModal = () => {
    const [openSearchModal, setOpenSearchModal] = useAtom(searchModalState);

    const onOpenSearchModal = () => setOpenSearchModal(true);
    const onCloseSearchModal = () => setOpenSearchModal(false);
    const onToggleSearchModal = () => setOpenSearchModal((prev) => !prev);

    return {
        openSearchModal,
        setOpenSearchModal,
        onOpenSearchModal,
        onCloseSearchModal,
        onToggleSearchModal,
    };
};
