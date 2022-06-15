import { FC, useState } from "react";
import styled from "styled-components";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Avatar } from "@deskpro/deskpro-ui";
import {
    H3,
    P5,
    Stack,
    Checkbox,
    HorizontalDivider,
} from "@deskpro/app-sdk";
import { OverflowText } from "../OverflowText";
import { TrelloLink } from "../TrelloLink";
import { TextBlockWithLabel } from "../TextBlockWithLabel";
import { TwoSider } from "../TwoSider";

const Title = () => (
    <Stack style={{ marginBottom: 10 }}>
        <H3>
            <a href="#">
                Can create approval using chrome title trying to revoke the issue.
            </a>
        </H3>
        <TrelloLink href="https://trello.com/c/<board_code>/<card_title>" />
    </Stack>
);

const Workspace = () => (
    <TwoSider
        leftLabel="Board"
        leftText={<OverflowText>Website: Design lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci aliquid at commodi consequatur cum cumque earum eius eum explicabo facilis ipsam libero nesciunt nobis odit quos reprehenderit sit, tenetur voluptates!</OverflowText>}
        rightLabel="List"
        rightText="Sprint Backlog"
    />
);

const Info = () => (
    <TwoSider
        leftLabel="Deskpro Tickets"
        leftText={5}
        rightLabel="Due date"
        rightText="17 Mar, 2021"
    />
);

const Members = () => (
    <TextBlockWithLabel
        label="Members"
        text={(
            <Stack gap={6}>
                <Avatar size={18} name={"E David"} backupIcon={faUser} />
                <P5>Armen Tamzarian</P5>
            </Stack>
        )}
    />
);

const CardUI = styled.div`
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    gap: 8px;
    width: 100%;
`;

const CardMedia = styled.div``;

const CardBody = styled.div`
    width: calc(100% - 12px - 8px);
`;

const Card: FC = () => {
    const [checked, setChecked] = useState(false);

    return (
        <>
            <CardUI>
                <CardMedia>
                    <Checkbox
                        size={12}
                        checked={checked}
                        onChange={() => setChecked(!checked)}
                    />
                </CardMedia>
                <CardBody>
                    <Title/>
                    <Workspace/>
                    <Info/>
                    <Members/>
                </CardBody>
            </CardUI>
            <HorizontalDivider/>
        </>
    );
}

export { Card };
