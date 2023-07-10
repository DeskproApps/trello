import { Stack } from "@deskpro/app-sdk";
import { TrelloError } from "../../services/trello";
import { UNKNOWN_ERROR } from "../../constants";
import { Container, ErrorBlock } from "../common";
import type { FC } from "react";
import type { FallbackProps } from "react-error-boundary";

type Props = Omit<FallbackProps, "error"> & {
    error: Error,
};

const ErrorFallback: FC<Props> = ({ error }) => {
  const message = UNKNOWN_ERROR;
  const button = null;

  // eslint-disable-next-line no-console
  console.error(error);

  if (error instanceof TrelloError) {
    //...
  }

  return (
    <Container>
      <ErrorBlock
        text={(
          <Stack gap={6} vertical style={{ padding: "8px" }}>
            {message}
            {button}
          </Stack>
        )}
      />
    </Container>
  );
};

export { ErrorFallback };
