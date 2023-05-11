import {
  H3,
  OAuth2CallbackUrl,
  useDeskproAppClient,
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { AnchorButton } from "../components/common";
import { useEffect, useState } from "react";

const LogInPage = () => {
  const [callback, setCallback] = useState<OAuth2CallbackUrl | null>(null);
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const [isAuthing, setIsAuthing] = useState(false);

  const { context } = useDeskproLatestAppContext();
  const { client } = useDeskproAppClient();

  useInitialisedDeskproAppClient(
    (client) => {
      (async () => {
        const callback: OAuth2CallbackUrl = await client
          .oauth2()
          .getCallbackUrl("auth", /#token=(?<token>.*)&?/, {
            pollInterval: 2000,
          });

        setCallback(() => callback);
      })();
    },
    [setCallback]
  );

  useEffect(() => {
    if (callback?.callbackUrl && context?.settings.api_key) {
      setAuthUrl(
        `https://trello.com/1/authorize?expiration=never&name=deskpro&scope=read&key=${context?.settings.api_key}&callback_method=fragment&return_url=${callback?.callbackUrl}`
      );
    }
  }, [callback, context?.settings]);

  const poll = () => {
    (async () => {
      setIsAuthing(true);

      if (callback?.poll) {
        // let's remove any previous tokens
        await client?.deleteUserState("oauth2/auth");

        await callback.poll();

        setIsAuthing(false);
      }
    })();
  };

  return (
    <>
      <H3>Log into your Trello Account</H3>
      {authUrl && (
        <AnchorButton
          text="Sign In"
          href={authUrl}
          target="_blank"
          loading={isAuthing}
          onClick={poll}
        />
      )}
    </>
  );
};

export { LogInPage };
