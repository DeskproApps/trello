import { FC, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import {
    P5,
    H3,
    useDeskproAppClient,
    useDeskproOAuth2Auth,
} from "@deskpro/app-sdk";
import { useStore } from "../context/StoreProvider/hooks";
import { checkIsAliveService } from "../services/trello";
import { useSetAppTitle } from "../hooks";
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
    const { callback } = useDeskproOAuth2Auth("token", /#token=(?<token>[0-9a-f]+)$/);
    const [state, dispatch] = useStore();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const authUrl = `https://trello.com/1/authorize?expiration=never&name=Deskpro&scope=read&response_type=token&key=${state?.context?.settings.client_key}&redirect_uri=${callback?.callbackUrl}`

    if (error) {
        console.error(`Trello: ${error}`);
    }

    const onSignIn = useCallback(() => {
        callback?.poll()
            .then(() => dispatch({ type: "setAuth", isAuth: true }))
            .catch((error) => dispatch({ type: "error", error }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [callback]);

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
            .then((data) => {
                if (data?.isAlive) {
                    dispatch({ type: "setAuth", isAuth: true });
                }
            })
            .catch((error) => setError(error))
            .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [client, callback?.hasToken]);

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
