import { FC } from "react";
import get from "lodash/get";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner, useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
import { useStore } from "../context/StoreProvider/hooks";
// import { Page } from "../context/StoreProvider/types";
import { checkIsAliveService } from "../services/trello";

const useCheckIsAuth = () => {
    const navigate = useNavigate();
    const [state, dispatch] = useStore();

    useInitialisedDeskproAppClient((client) => {
        checkIsAliveService(client)
            .then((res) => {
                const isAlive = get(res, ["isAlive"]);
                if (isAlive) {
                    dispatch({ type: "setAuth", isAuth: true });
                    navigate("/home");
                } else {
                    navigate("/log_in");
                }
            })
            .catch(() => navigate("/log_in") )
    }, [state.isAuth, dispatch]);
};

const LoadingAppPage: FC = () => {
    useCheckIsAuth();

    return (
        <LoadingSpinner/>
    );
};

export { LoadingAppPage };
