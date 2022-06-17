import {FC, useState} from "react";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Avatar } from "@deskpro/deskpro-ui";
import {H3, P5, Stack, useDeskproAppTheme, useInitialisedDeskproAppClient} from "@deskpro/app-sdk";
import { getDate } from "../../../utils/date";
import { TwoSider } from "../TwoSider";
import { OverflowText } from "../OverflowText";
import { NoFound } from "../NoFound";
import { TextBlockWithLabel } from "../TextBlockWithLabel";
import { LinkIcon } from "../LinkIcon";
import { TrelloLink } from "../TrelloLink";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Title: FC<any> = ({ name, shortUrl, onTitleClick, id  }) => {
    const { theme } = useDeskproAppTheme();

    return (
        <Stack gap={6} style={{ marginBottom: "6px" }} align="center">
            <H3>
                <a href="#" style={{ color: theme.colors.cyan100, textDecoration: "none" }} onClick={() => onTitleClick && onTitleClick(id)}>{name}</a>
            </H3>
            <TrelloLink href={shortUrl} />
        </Stack>
    );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Workspace: FC<any> = ({ board, list }) => (
    <TwoSider
        leftLabel={<>Board <LinkIcon size={10} href={board.url}/></>}
        leftText={(
            <>
                <OverflowText>{board.name}</OverflowText>
                <LinkIcon size={10} href={board.url}/>
            </>
        )}
        rightLabel="List"
        rightText={<OverflowText>{list.name}</OverflowText>}
    />
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Info: FC<any> = ({ id, due }) => {
    const [ticketCount, setTicketCount] = useState<number>(0);

    useInitialisedDeskproAppClient((client) => {
        client.entityAssociationCountEntities("linkedTrelloCards", id).then(setTicketCount);
    });

    return (
        <TwoSider
            leftLabel={<>Deskpro Tickets</>}
            leftText={ticketCount}
            rightLabel={<>Due Date</>}
            rightText={getDate(due)}
        />
    );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Members: FC<any> = ({ members }) => {
    let content = null;

    if (!Array.isArray(members)) {
        content = (<NoFound/>);
    }

    if (members.length === 0) {
        content = (<>-</>);
    }

    if (members.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        content = members.map(({ id, fullName }: any) => (
            <Stack gap={6} key={id}>
                {/* ToDo: add avatar image */}
                <Avatar size={18} name={fullName} backupIcon={faUser} />
                <P5>{fullName}</P5>
            </Stack>
        ))
    }

    return (
        <TextBlockWithLabel
            label="Members"
            text={(
                <Stack gap={6} wrap="wrap">{content}</Stack>
            )}
        />
    );
}

const CardInfo: FC = (props) => (
    <>
        <Title {...props} onTitleClick={(id) => props?.onTitleClick && props.onTitleClick(id)} />
        <Workspace {...props} />
        <Info {...props} />
        <Members {...props} />
    </>
);

export { CardInfo }
