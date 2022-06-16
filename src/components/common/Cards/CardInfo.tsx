import { FC } from "react";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Avatar } from "@deskpro/deskpro-ui";
import { H3, P5, Stack } from "@deskpro/app-sdk";
import { getDate } from "../../../utils/date";
import { TrelloLink } from "../TrelloLink";
import { TwoSider } from "../TwoSider";
import { OverflowText } from "../OverflowText";
import { NoFound } from "../NoFound";
import { TextBlockWithLabel } from "../TextBlockWithLabel";
import { LinkIcon } from "../LinkIcon";

const Title: FC<any> = ({ name, shortUrl }) => (
    <Stack gap={6} style={{ marginBottom: 10 }}>
        <H3>
            <a href="#">{name}</a>
        </H3>
        <TrelloLink href={shortUrl} />
    </Stack>
);

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
        rightText={list.name}
    />
);

const Info: FC<any> = ({ due }) => (
    <TwoSider
        leftLabel="Deskpro Tickets"
        leftText={5}
        rightLabel="Due date"
        rightText={getDate(due)}
    />
);

const Members: FC<any> = ({ members }) => {
    let content = null;

    if (!Array.isArray(members)) {
        content = (<NoFound/>);
    }

    if (members.length === 0) {
        content = (<>-</>);
    }

    if (members.length > 0) {
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
            text={(<>{content}</>)}
        />
    );
}

const CardInfo: FC = (props) => (
    <>
        <Title {...props} />
        <Workspace {...props} />
        <Info {...props} />
        <Members {...props} />
    </>
);

export { CardInfo }
