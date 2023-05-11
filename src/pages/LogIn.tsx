import { FC, useEffect, useState } from "react";
import styled from "styled-components";
import {
  P5,
  H3,
  useDeskproAppClient,
  OAuth2StaticCallbackUrl,
  IDeskproClient,
} from "@deskpro/app-sdk";
import { useStore } from "../context/StoreProvider/hooks";
import { useSetAppTitle } from "../hooks";
import { getQueryParams } from "../utils";
import { Loading, AnchorButton } from "../components/common";
import { checkIsAliveService } from "../services/trello";

const LogInError = styled(P5)`
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.scarlett100};
`;

const LogInPage: FC = () => {
  const { client } = useDeskproAppClient();
  const [state, dispatch] = useStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [authUrl, setAuthUrl] = useState("");
  const [callback, setCallback] = useState<OAuth2StaticCallbackUrl | null>(
    null
  );

  if (error) {
    console.error(`Trello: ${error}`);
  }

  useEffect(() => {
    if (state?.context?.settings.api_key && callback?.callbackUrl) {
      setAuthUrl(
        `https://trello.com/1/authorize?${getQueryParams({
          expiration: "never",
          scope: "read,write",
          response_type: "token",
          key: state?.context?.settings.api_key,
          return_url: callback?.callbackUrl,
        })}`
      );

      setLoading(false);
    }
  }, [state?.context?.settings.api_key, callback?.callbackUrl]);

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

    callback
      ?.poll()
      .then(() => {
        return checkIsAliveService(client as IDeskproClient);
      })
      .then((data) => {
        if ((data as { isAlive: boolean }).isAlive) {
          dispatch({ type: "setAuth", isAuth: true });
        }
      })
      .catch((error) => dispatch({ type: "error", error }))
      .finally(() => setLoading(false));
  };

  useSetAppTitle("Trello");

  useEffect(() => {
    if (!client || callback) {
      return;
    }

    setLoading(true);

    client
      .oauth2()
      .getGenericCallbackUrl("http", /#token=(?<token>.*)&?/, /(?<key>http)/)
      .then((callback) => {
        setCallback(callback);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, state.isAuth]);

  return loading ? (
    <Loading />
  ) : (
    <>
      <H3 style={{ marginBottom: !error ? 14 : 2 }}>
        Log into your Trello Account
      </H3>
      {error && <LogInError>An error occurred, please try again.</LogInError>}
      <AnchorButton
        text="Sign In"
        href={authUrl}
        target="_blank"
        onClick={onSignIn}
      />
    </>
  );
};

export { LogInPage };
