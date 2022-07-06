import { FC, useEffect, useState } from "react";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
import styled from "styled-components";
import {
    P5,
    H3,
    OAuth2CallbackUrl,
    useDeskproAppClient,
    useDeskproOAuth2Auth,
} from "@deskpro/app-sdk";
import { useStore } from "../context/StoreProvider/hooks";
import { OAuthCallback } from "../context/StoreProvider/types";
import { checkIsAliveService } from "../services/trello";
import { CustomError } from "../services/trello/types";
import { useSetAppTitle } from "../hooks";
import { getQueryParams } from "../utils";
import {
    Loading,
    AnchorButton,
} from "../components/common";

const LogInError = styled(P5)`
    margin-bottom: 8px;
    color: ${({ theme }) => theme.colors.scarlett100};
`;

const LogInPage: FC = () => {
    const { client } = useDeskproAppClient();
    const { callback: callbackInit } = useDeskproOAuth2Auth("token", /#token=(?<token>[0-9a-f]+)$/);
    const [state, dispatch] = useStore();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [authUrl, setAuthUrl] = useState("");
    const [callback, setCallback] = useState<OAuthCallback>(callbackInit);

    if (error) {
        console.error(`Trello: ${error}`);
    }

    useEffect(() => {
        if (!isEmpty(callback) && !isEqual(callbackInit, callback)) {
            setCallback(callbackInit);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [callbackInit]);

    useEffect(() => {
        if (state?.context?.settings.client_key && callback?.callbackUrl) {
            setAuthUrl(`https://trello.com/1/authorize?${getQueryParams({
                expiration: "never",
                name: "Deskpro",
                scope: "read,write",
                response_type: "token",
                key: state?.context?.settings.client_key,
                return_url: callback?.callbackUrl,
            })}`);

            setLoading(false);
        }
    }, [state?.context?.settings.client_key, callback?.callbackUrl]);

    useEffect(() => {
        if (!client) {
            return;
        }

        client?.deregisterElement("trelloPlusButton");
        client?.deregisterElement("trelloHomeButton");
        client?.deregisterElement("trelloExternalCtaLink");
        client?.deregisterElement("trelloMenu");
        client?.deregisterElement("trelloEditButton");
    }, [client]);

    const onSignIn = () => {
        if (!callback) {
            return;
        }

        setLoading(true);

        callback?.poll()
            .then(() => dispatch({ type: "setAuth", isAuth: true }))
            .catch((error) => dispatch({ type: "error", error }))
            .finally(() => setLoading(false));
    };

    useSetAppTitle("Trello");

    useEffect(() => {
        if (!client || !callback?.hasToken) {
            return;
        }

        setLoading(true);
        setError(null);

        callback?.hasToken()
            .then((hasToken) => {
                if (hasToken) {
                    return checkIsAliveService(client);
                }
            })
            .then((data: CustomError | { isAlive: boolean } | undefined) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                if (data?.isAlive) {
                    dispatch({ type: "setAuth", isAuth: true });
                }
            })
            .catch((error) => setError(error))
            .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [client, callback?.hasToken]);

    useEffect(() => {
        if (!client) {
            return;
        }

        setLoading(true);

        client.oauth2()
            .getCallbackUrl("token", /#token=(?<token>[0-9a-f]+)$/)
            .then((callback: OAuth2CallbackUrl) => {
                setAuthUrl(`https://trello.com/1/authorize?${getQueryParams({
                    expiration: "never",
                    name: "Deskpro",
                    scope: "read,write",
                    response_type: "token",
                    key: state?.context?.settings.client_key,
                    return_url: callback?.callbackUrl
                })}`);
                setCallback(callback);
            })
            .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [client, state.isAuth]);

    return loading
        ? (<Loading/>)
        : (
            <>
                <H3 style={{ marginBottom: !error ? 14 : 2 }}>Log into your Trello Account</H3>
                {error && (<LogInError>An error occurred, please try again.</LogInError>)}
                <AnchorButton text="Sign In" href={authUrl} target="_blank" onClick={onSignIn}/>
            </>
        );
}

export { LogInPage };
