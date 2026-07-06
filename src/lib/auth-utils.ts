import { redirect } from "next/navigation";
import { fetchAuthQuery, isAuthenticated } from "./auth-server";
import { api } from "../../convex/_generated/api";

export const requireAuth = async () => {
    const hasToken = await isAuthenticated();

    if (!hasToken) {
        redirect("/sign-in");
    }

    return hasToken;
};

export const requireUnauth = async () => {
    const hasToken = await isAuthenticated();

    if (hasToken) {
        redirect("/");
    }
};

export const getCurrentUser = async () => {
    const user = await fetchAuthQuery(api.public.user.getCurrentUser);

    return user;
};
