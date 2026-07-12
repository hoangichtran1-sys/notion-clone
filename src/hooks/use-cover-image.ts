import { coverImageState } from "@/atoms/cover-image-state";
import { useAtom } from "jotai";

export const useCoverImage = () => {
    const [openCoverImage, setOpenCoverImage] = useAtom(coverImageState);

    const onOpenCoverImage = () => setOpenCoverImage(true);
    const onCloseCoverImage = () => setOpenCoverImage(false);

    return {
        openCoverImage,
        setOpenCoverImage,
        onOpenCoverImage,
        onCloseCoverImage,
    };
};
