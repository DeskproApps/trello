import { useEffect, useState, useCallback, useMemo } from "react";
import get from "lodash/get";
import {
  H3,
  Title,
  OAuth2CallbackUrl,
  useDeskproAppClient,
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { AnchorButton, Container } from "../components/common";
import { useStore } from "../context/StoreProvider/hooks";
import { getQueryParams } from "../utils";

const LogInPage = () => {
  const [, dispatch] = useStore();

  const [callback, setCallback] = useState<OAuth2CallbackUrl | null>(null);
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const [isAuthing, setIsAuthing] = useState(false);
  const { context } = useDeskproLatestAppContext();
  const { client } = useDeskproAppClient();
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
        .then(() => {
            setIsAuthing(false);
            dispatch({ type: "setAuth", isAuth: true });
            dispatch({ type: "changePage", page: "home" });
        })
        .catch((error) => dispatch({ type: "error", error }));
  }, [client, callback, dispatch]);

  return (
    <Container>
      <Title as={H3} title="Log into your Trello Account" />
      {authUrl && (
        <AnchorButton
          intent="secondary"
          text="Sign In"
          target="_blank"
          href={authUrl}
          onClick={poll}
          loading={isAuthing}
          disabled={isAuthing}
        />
      )}
    </Container>
  );
};

export { LogInPage };
