import { useState, useMemo, FC } from "react";
import styled from "styled-components";
import { P1 } from "@deskpro/deskpro-ui";
import {
  LoadingSpinner,
  CopyToClipboardInput,
  useInitialisedDeskproAppClient,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { getQueryParams, getUrlOrigin } from "../../utils";
import { Settings } from "../../types";

const Description = styled(P1)`
  margin-top: 8px;
  /* margin-bottom: 16px; */
  color: ${({ theme }) => theme.colors.grey80};
`;

const AdminCallbackPage: FC = () => {
  const { context } = useDeskproLatestAppContext<unknown, Settings>();
  const [callbackUrl, setCallbackUrl] = useState<string|null>(null);
  const origin = useMemo(() => getUrlOrigin(callbackUrl), [callbackUrl]);

  useInitialisedDeskproAppClient(client => {
    const APIKey = context?.settings.api_key;
  
    client.startOauth2Local(({ callbackUrl }) => {
      setCallbackUrl(callbackUrl);

      return `https://trello.com/1/authorize?${getQueryParams({
        expiration: 'never',
        name: 'deskpro',
        key: APIKey ?? '',
        callback_method: 'fragment',
        return_url: callbackUrl,
        scope: ['read','write'].join(',')
      })}`
    },
    /code=(?<token>[0-9a-f]+)/,
    async () => {
      return {
        data: {
          access_token: 'unused'
        }
      }
    });
  }, [context]);

  if (!origin) {
    return (<LoadingSpinner/>);
  }

  return (
    <>
      <CopyToClipboardInput value={origin} />
      <Description>The Callback URL origin will be required during Trello app setup</Description>
    </>
  );
};

export { AdminCallbackPage };