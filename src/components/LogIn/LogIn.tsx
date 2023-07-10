import { H3, Title } from "@deskpro/app-sdk";
import { Container, AnchorButton } from "../common";
import type { FC } from "react";

type Props = {
    authUrl: string|null,
    poll: () => void,
    isAuthing: boolean,
};

const LogIn: FC<Props> = ({ authUrl, poll, isAuthing }) => {
    return (
        <Container>
            <Title as={H3} title="Log into your Trello Account" />
            <AnchorButton
                intent="secondary"
                text="Sign In"
                target="_blank"
                href={authUrl || "#"}
                onClick={poll}
                loading={isAuthing}
                disabled={!authUrl || isAuthing}
            />
        </Container>
    );
}

export { LogIn };
