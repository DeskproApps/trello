import { FC } from "react";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Avatar } from "@deskpro/deskpro-ui";
import { H3, P5, Stack } from "@deskpro/app-sdk";
import { getDate } from "../../../utils/date";
import { TwoSider } from "../TwoSider";
import { OverflowText } from "../OverflowText";
import { NoFound } from "../NoFound";
import { TextBlockWithLabel } from "../TextBlockWithLabel";
import { LinkIcon } from "../LinkIcon";
import { TrelloLink } from "../TrelloLink";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Title: FC<any> = ({ name, shortUrl, onPageChange }) => (
    <Stack gap={6} style={{ marginBottom: 10 }}>
        <H3>
            <a
                href="#"
                {...(onPageChange ? { onClick: onPageChange } : {})}
            >{name}</a>
        </H3>
        <TrelloLink href={shortUrl} />
    </Stack>
);

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
const Info: FC<any> = ({ due }) => (
    <TextBlockWithLabel
        label="Due date"
        text={getDate(due)}
    />
);

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
        <Title {...props} />
        <Workspace {...props} />
        <Info {...props} />
        <Members {...props} />
    </>
);

export { CardInfo, Members }
