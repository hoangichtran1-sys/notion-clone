import { atom } from "jotai";
import { atomFamily } from "jotai-family";
import deepEqual from "fast-deep-equal";
import { Id } from "../../convex/_generated/dataModel";

type AtomValue = {
    content: string | undefined;
    createdAt: Date;
};

export const summaryDocumentIdAtom = atomFamily(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (documentId: Id<"documents">) => atom<AtomValue | null>(null),
    deepEqual,
);
