import { FC, useMemo } from "react";
import get from "lodash/get";
import { LoadingSpinner, useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
import { useStore } from "../context/StoreProvider/hooks";
import { Page } from "../context/StoreProvider/types";
import { checkIsAliveService } from "../services/trello";

const useCheckIsAuth = () => {
    const [state, dispatch] = useStore();
    const isAdmin = useMemo(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const page = queryParams.get("page") as Page|null;

        return (page || "").includes("admin")
    }, []);

    useInitialisedDeskproAppClient((client) => {
        const queryParams = new URLSearchParams(window.location.search);
        const page = queryParams.get("page") as Page|null;

        if (isAdmin) {
            dispatch({ type: "changePage", page: page as Page });
        } else {
            checkIsAliveService(client)
                .then((res) => {
                    const isAlive = get(res, ["isAlive"]);
                    if (isAlive) {
                        dispatch({ type: "setAuth", isAuth: true });
                        dispatch({ type: "changePage", page: "home" });
                    } else {
                        dispatch({ type: "changePage", page: "log_in" });
                    }
                })
                .catch(() => dispatch({ type: "changePage", page: "log_in" }) )
        }
    }, [isAdmin, state.isAuth, dispatch]);
};

const LoadingAppPage: FC = () => {
    useCheckIsAuth();

    return (
        <LoadingSpinner/>
    );
};

export { LoadingAppPage };
