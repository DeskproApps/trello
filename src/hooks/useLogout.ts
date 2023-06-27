import { useState, useCallback } from "react";
import noop from "lodash/noop";
import { useNavigate } from "react-router-dom";
import { useDeskproAppClient } from "@deskpro/app-sdk";
import { removeTokenFromUserStateService } from "../services/deskpro";
import { removeTokenService } from "../services/trello";

type UseLogout = () => {
    isLoading: boolean,
    logout: () => Promise<unknown>,
};

const useLogout: UseLogout = () => {
    const navigate = useNavigate();
    const { client } = useDeskproAppClient();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const logout = useCallback(() => {
        if (!client) {
            return Promise.resolve();
        }

        setIsLoading(true);

        return Promise.all([
            removeTokenService(client),
            removeTokenFromUserStateService(client),
        ])
            .catch(noop)
            .finally(() => {
                setIsLoading(false);
                navigate("/log_in");
            });
    }, [client, navigate]);

    return { logout, isLoading };
};

export { useLogout };
