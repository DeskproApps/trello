import { FC, useCallback, useEffect, useState } from "react";
import {
    H3,
    useDeskproAppClient,
    useDeskproOAuth2Auth,
} from "@deskpro/app-sdk";
import { useStore } from "../context/StoreProvider/hooks";
import { checkIsAliveService } from "../services/trello";
import { Loading, AnchorButton } from "../components/common";

const LogIn: FC = () => {
    const { client } = useDeskproAppClient();
    const { callback } = useDeskproOAuth2Auth("token", /#token=(?<token>[0-9a-f]+)$/);
    const [state, dispatch] = useStore();
    const [loading, setLoading] = useState<boolean>(false);
    const authUrl = `https://trello.com/1/authorize?expiration=1day&name=MyPersonalToken&scope=read&response_type=token&key=${state?.context?.settings.client_key}&redirect_uri=${callback?.callbackUrl}`

    const onSignIn = useCallback(() => {
        if (!client) {
            return;
        }

        callback?.poll()
            .then(() => dispatch({ type: "setAuth", isAuth: true }))
            .catch((error) => dispatch({ type: "error", error }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [client, callback]);

    useEffect(() => {
        if (!client) {
            return;
        }

        setLoading(true)

        checkIsAliveService(client)
            .then((data) => {
                if (data?.isAlive) {
                    dispatch({ type: "setAuth", isAuth: true });
                    dispatch({ type: "changePage", page: "home" })
                }
            })
            .catch((error) => dispatch({ type: "error", error }))
            .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [client]);

    return loading
        ? (<Loading/>)
        : (
            <>
                <H3 style={{ marginBottom: 14 }}>Log into your Trello Account</H3>
                <AnchorButton text="Sign In" href={authUrl} target="_blank" onClick={onSignIn}/>
            </>
        );
}

export { LogIn };
