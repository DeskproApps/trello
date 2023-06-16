import { FC, useEffect, useMemo } from "react";
import { LoadingSpinner } from "@deskpro/app-sdk";
import { useStore } from "../context/StoreProvider/hooks";
import { Page } from "../context/StoreProvider/types";

const LoadingAppPage: FC = () => {
    const [state, dispatch] = useStore();
    const isAdmin = useMemo(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const page = queryParams.get("page") as Page|null;

        return (page || "").includes("admin")
    }, []);

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const page = queryParams.get("page") as Page|null;

        if (isAdmin) {
            dispatch({ type: "changePage", page: page as Page });
        } else {
            dispatch({ type: "changePage", page: !state.isAuth ? "log_in" : page || "home" });
        }
    }, [isAdmin, state.isAuth, dispatch]);

    return (
        <LoadingSpinner/>
    );
};

export { LoadingAppPage };
