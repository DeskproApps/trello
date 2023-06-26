import get from "lodash/get";
import size from "lodash/size";
import styled from "styled-components";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import {
    Title,
    HorizontalDivider,
    useDeskproAppTheme,
} from "@deskpro/app-sdk";
import { H1, H3, P5, Pill, Icon, Stack, Checkbox } from "@deskpro/deskpro-ui";
import { CardType, ChecklistItem, Comment } from "../../services/trello/types";
import { getDate } from "../../utils/date";
import { getLabelColor } from "../../utils";
import {
    NoFound,
    LinkIcon,
    EmptyInlineBlock,
    TextBlockWithLabel,
} from "../common";
import { Members } from "../common/Cards";
import { Comments } from "./Comments";
import type { FC } from "react";
import type { Maybe } from "../../types";

type Props =  {
    card: Maybe<CardType>,
    comments: Maybe<Comment[]>,
    onNavigateToAddNewComment: () => void,
    onChangeChecklistItem: (
        itemId: ChecklistItem["id"],
        state: ChecklistItem["state"],
    ) => void,
};

const Description = styled(P5)`
    white-space: pre-wrap
`;

const ViewCard: FC<Props> = ({
    card,
    comments,
    onNavigateToAddNewComment,
    onChangeChecklistItem,
}) => {
    const { theme } = useDeskproAppTheme();
    const labels = get(card, ["labels"]);
    const due = get(card, ["due"]);
    const checklists = get(card, ["checklists"]);

    if (!card) {
        return (<NoFound/>);
    }

    return (
        <>
            <Title title={get(card, ["name"], "-")} />
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
                text={<Description>{get(card, ["desc"], "-")}</Description>}
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

            {(Array.isArray(checklists) && size(checklists)) && (
                <>
                    <HorizontalDivider style={{ marginBottom: 10 }} />
                    <H1 style={{ marginBottom: 14 }}>Checklist</H1>

                    {checklists.map(({ id, name, checkItems }) => (
                        <Stack key={id} vertical style={{ marginBottom: 10 }}>
                            <H3 style={{ marginBottom: 10 }}>{name}</H3>
                            {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                checkItems.map(({ id, name, state }: any) => (
                                    <Checkbox
                                        id={id}
                                        key={id}
                                        checked={state === "complete"}
                                        label={name}
                                        onChange={() => {
                                            onChangeChecklistItem(id, state === "complete" ? "incomplete" : "complete")
                                        }}
                                        labelProps={{ style: { alignItems: "baseline" }}}
                                    />
                                ))
                            }
                        </Stack>
                    ))}
                </>
            )}

            <HorizontalDivider style={{ marginBottom: 10 }} />

            <Comments comments={comments} onClickTitleAction={onNavigateToAddNewComment} />
        </>
    );
};

export { ViewCard };
