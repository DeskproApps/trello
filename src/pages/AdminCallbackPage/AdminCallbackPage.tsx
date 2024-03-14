import { useState, useMemo, FC } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import { P1 } from "@deskpro/deskpro-ui";
import {
  LoadingSpinner,
  CopyToClipboardInput,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { getUrlOrigin } from "../../utils";

const Description = styled(P1)`
  margin-top: 8px;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.grey80};
`;

const AdminCallbackPage: FC = () => {
  const [callbackUrl, setCallbackUrl] = useState<string|null>(null);
  const key = useMemo(() => uuidv4(), []);
  const origin = useMemo(() => getUrlOrigin(callbackUrl), [callbackUrl]);

  useInitialisedDeskproAppClient((client) => {
    client.oauth2()
      .getAdminGenericCallbackUrl(key, /code=(?<token>[0-9a-f]+)/, /state=(?<key>.+)/)
      .then(({ callbackUrl }) => setCallbackUrl(callbackUrl));
  }, [key]);

  if (!origin) {
    return (<LoadingSpinner/>);
  }

  return (
    <>
      <CopyToClipboardInput value={origin} />
      <Description>The callback URL origin will be required during Trello app setup</Description>
    </>
  );
};

export { AdminCallbackPage };
