import get from "lodash/get";
import find from "lodash/find";
import size from "lodash/size";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { P5, Avatar, Stack } from "@deskpro/deskpro-ui";
import { Title } from "@deskpro/app-sdk";
import { getDate } from "../../../utils/date";
import { TwoSider } from "../TwoSider";
import { OverflowText } from "../OverflowText";
import { NoFound } from "../NoFound";
import { TextBlockWithLabel } from "../TextBlockWithLabel";
import { LinkIcon } from "../LinkIcon";
import { Link } from "../Link";
import { TrelloLogo } from "../TrelloLink";
import { DeskproTickets } from "../DeskproTickets";
import type { FC } from "react";
import type { CardType, Organization } from "../../../services/trello/types";

type Props = {
    card: CardType,
    onTitleClick?: () => void,
    organizations: Organization[],
};

const Members: FC<{ members: CardType["members"] }> = ({ members }) => {
    let content = null;

    if (!Array.isArray(members)) {
        content = (<NoFound/>);
    }

    if (!size(members)) {
        content = (<>-</>);
    }

    if (size(members)) {
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

const CardInfo: FC<Props> = ({ card, organizations, onTitleClick }) => {
    const workspace = find(organizations, {
        id: get(card, ["board", "idOrganization"]),
    });

    return (
        <>
            <Title
                title={(
                    <Link href="#" onClick={(e) => {e.preventDefault(); onTitleClick && onTitleClick()}}>
                        {get(card, ["name"], "-")}
                    </Link>
                )}
                icon={<TrelloLogo/>}
                link={get(card, ["shortUrl"], "#")}
            />
            <TwoSider
                leftLabel="Workspace"
                leftText={(
                    <>
                        <OverflowText>{get(workspace, ["displayName"], "-")}</OverflowText>
                        {get(workspace, ["url"]) && (
                            <LinkIcon size={10} href={get(workspace, ["url"], "#")}/>
                        )}
                    </>
                )}
                rightLabel="Board"
                rightText={(
                    <>
                        <OverflowText>{get(card, ["board", "name"], "-")}</OverflowText>
                        {get(card, ["board", "url"]) && (
                            <LinkIcon size={10} href={get(card, ["board", "url"], "#")}/>
                        )}
                    </>
                )}
            />
            <TwoSider
                leftLabel="List"
                leftText={<OverflowText>{get(card, ["list", "name"], "-")}</OverflowText>}
                rightLabel="Due Date"
                rightText={getDate(get(card, ["due"]))}
            />
            <TextBlockWithLabel
                label="Deskpro Tickets"
                text={<DeskproTickets entityId={get(card, ["id"], "")} />}
            />
            <Members {...card} />
        </>
    );
}

export { CardInfo, Members }
