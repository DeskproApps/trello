import {useEffect, useState} from "react";
import {
    Context,
    proxyFetch,
    useDeskproAppClient,
    useDeskproAppEvents,
    useDeskproOAuth2Auth,
} from "@deskpro/app-sdk";

export const Main = () => {
    const { client } = useDeskproAppClient();
    const [context, setContext] = useState<Context|null>(null);

    // Store the app context in state so we can access settings
    useDeskproAppEvents({
        onChange: setContext,
    });

    useEffect(() => {
        if (!client) {
            return;
        }

        client?.deregisterElement("trelloRefreshButton");

        client?.registerElement("trelloRefreshButton", {
            type: "refresh_button"
        });
    }, [client]);

    // Get a callback URL using the name of the eventual state var used to store
    // the access token and the regular expression used to acquire it
    const { callback } = useDeskproOAuth2Auth("token", /#token=(?<token>[0-9a-f]+)$/);

    // When the user clicks the "sign-in" button, we'll need to poll for the access token
    const onSignIn = () => {
        callback?.poll()
            .then((props) => {
                console.log(">>> Success! We have an access token in state accessible as:", props);

                // @ts-ignore
                proxyFetch(client)
                    // .then((fetch) => fetch("https://example.com/token?secret=__secret__&access_code=[user[oauth2/token]]"))
                    .then((fetch) => fetch(`https://api.trello.com/1/members/me/?key=${context?.settings.client_key}&token=[user[oauth2/token]]`))
                    .then((response) => response.json())
                    .then((data) => {
                        console.log(">>> Success! We now have an auth token:", data);
                    })
                    .catch((err) => {
                        console.log('>>> catch:', err)
                    });
            });
    };

    // href={`https://example.com/authorize?client_key=${context.settings.client_key}&redirect_uri=${callback.callbackUrl}`}
    const authUrl = `https://trello.com/1/authorize?expiration=1day&name=MyPersonalToken&scope=read&response_type=token&key=${context?.settings.client_key}&redirect_uri=${callback?.callbackUrl}`;

    return (
        <>
            {callback && context && (
                <a
                    href={authUrl}
                    target="_blank"
                    onClick={onSignIn}>
                    Sign-In
                </a>
            )}
        </>
    );
};
