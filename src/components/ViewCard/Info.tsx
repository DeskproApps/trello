import get from "lodash/get";
import find from "lodash/find";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { Title, useDeskproAppTheme } from "@deskpro/app-sdk";
import { P5, Pill, Icon, Stack } from "@deskpro/deskpro-ui";
import { getDate } from "../../utils/date";
import { getLabelColor } from "../../utils";
import {
    LinkIcon,
    Markdown,
    Container,
    TrelloLogo,
    EmptyInlineBlock,
    TextBlockWithLabel,
} from "../common";
import { Members } from "../common/Cards";
import type { FC } from "react";
import type { CardType, Organization } from "../../services/trello/types";

type Props = {
    card: CardType,
    organizations: Organization[],
};

const Info: FC<Props> = ({ card, organizations }) => {
    const { theme } = useDeskproAppTheme();
    const labels = get(card, ["labels"]);
    const due = get(card, ["due"]);
    const workspace = find(organizations, {
        id: get(card, ["board", "idOrganization"]),
    });

    return (
        <Container>
            <Title
                title={get(card, ["name"], "-")}
                icon={<TrelloLogo/>}
                link={get(card, ["shortUrl"], "#")}
            />
            <TextBlockWithLabel
                label="Board"
                text={(
                    <>
                        <P5 style={{ marginRight: 4 }}>{get(workspace, ["displayName"], "-")}</P5>
                        {get(workspace, ["url"]) && (
                            <LinkIcon size={10} href={get(workspace, ["url"], "#")}/>
                        )}
                    </>
                )}
            />
            <TextBlockWithLabel
                label="Board"
                text={(
                    <>
                        <P5 style={{ marginRight: 4 }}>{get(card, ["board", "name"], "-")}</P5>
                        <LinkIcon size={10} href={get(card, ["board", "url"], "-")}/>
                    </>
                )}
            />
            <TextBlockWithLabel
                label="List"
                text={get(card, ["list", "name"], "-")}
            />
            <TextBlockWithLabel
                label="Description"
                text={(
                    <Markdown text={get(card, ["desc"], "-")} />
                )}
            />
            <TextBlockWithLabel
                label="Labels"
                text={(!labels)
                    ? "-"
                    : (
                        <Stack wrap="wrap" gap={6}>
                            {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                labels.map(({ id, name, color }: any) => (
                                    <Pill
                                        key={id}
                                        label={name ? name : <EmptyInlineBlock/>}
                                        {...getLabelColor(theme, color)}
                                    />
                                ))
                            }
                        </Stack>
                    )
                }
            />
            <TextBlockWithLabel
                label="Due date"
                text={(
                    <P5>
                        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                        {/* @ts-ignore */}
                        <Icon icon={faCalendarDays} style={{ color: theme.colors.grey40 }}/>&nbsp;
                        {!due ? "-" : getDate(due)}
                    </P5>
                )}
            />
            <Members members={get(card, ["members"])} />
        </Container>
    );
};

export { Info };
