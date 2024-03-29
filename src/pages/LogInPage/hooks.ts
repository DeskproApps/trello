import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import get from "lodash/get";
import {
    OAuth2CallbackUrl,
    useDeskproAppClient,
    useDeskproLatestAppContext,
    useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { checkIsAliveService } from "../../services/trello";
import { getQueryParams } from "../../utils";
import { useAsyncError } from "../../hooks";

const useLogIn = () => {
    const navigate = useNavigate();
    const [callback, setCallback] = useState<OAuth2CallbackUrl|null>(null);
    const [authUrl, setAuthUrl] = useState<string|null>(null);
    const [isAuthing, setIsAuthing] = useState(false);
    const { context } = useDeskproLatestAppContext();
    const { client } = useDeskproAppClient();
    const { asyncErrorHandler } = useAsyncError();
    const apiKey = useMemo(() => get(context, ["settings", "api_key"]), [context])

    useInitialisedDeskproAppClient(
        (client) => {
            (async () => {
                const callback: OAuth2CallbackUrl = await client
                    .oauth2()
                    .getCallbackUrl("token", /#token=(?<token>.*)&?/, {
                        pollInterval: 2000,
                    });

                setCallback(() => callback);
            })();
        },
        [setCallback]
    );

    useEffect(() => {
        if (callback?.callbackUrl && apiKey) {
            setAuthUrl(`https://trello.com/1/authorize?${getQueryParams({
                expiration: "never",
                name: "deskpro",
                key: apiKey,
                callback_method: "fragment",
                return_url: callback?.callbackUrl,
                scope: ["read","write"].join(","),
            })}`);
        }
    }, [callback, apiKey]);

    const poll = useCallback(() => {
        if (!client || !callback?.poll) {
            return;
        }

        setTimeout(() => setIsAuthing(true), 1000);

        client.deleteUserState("oauth2/token")
            .then(callback.poll)
            .then(() => checkIsAliveService(client))
            .then((res) => {
                if (get(res, ["isAlive"])) {
                    setIsAuthing(false);
                    navigate("/home");
                } else {
                    throw new Error(get(res, ["error"], "Unknown error"));
                }
            })
            .catch(asyncErrorHandler);
    }, [client, callback, navigate, asyncErrorHandler]);

    return { authUrl, poll, isAuthing };
};

export { useLogIn };
