import { atom } from "jotai";

export const searchModalState = atom(false);

export const toggleModalState = atom(
    (get) => get(searchModalState),
    (get, set) => set(searchModalState, !get(searchModalState)),
);
