import { FC } from "react";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import {
    H1,
    H3,
    P5,
    Pill,
    Icon,
    Stack,
    Checkbox,
    HorizontalDivider,
    useDeskproAppTheme
} from "@deskpro/app-sdk";
import { CardType } from "../../services/trello/types";
import { getDate } from "../../utils/date";
import { getLabelColor } from "../../utils";
import {
    LinkIcon,
    EmptyInlineBlock,
    TextBlockWithLabel,
} from "../common";
import { Members } from "../common/Cards";

const ViewCard: FC<CardType> = ({
    name, desc, board, list, labels, due, members, checklists
}) => {
    const { theme } = useDeskproAppTheme();

    return (
        <>
            <H3 style={{ marginBottom: 10 }}>{name}</H3>
            <TextBlockWithLabel
                label="Board"
                text={(
                    <>
                        <P5 style={{ marginRight: 4 }}>{board.name}</P5>
                        <LinkIcon size={10} href={board.url}/>
                    </>
                )}
            />
            <TextBlockWithLabel
                label="List"
                text={list.name}
            />
            <TextBlockWithLabel
                label="Description"
                text={desc}
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

            <Members members={members} />

            {(Array.isArray(checklists) && checklists.length > 0) && (
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
                                        onChange={() => {}}
                                        labelProps={{ style: { alignItems: "baseline" }}}
                                    />
                                ))
                            }
                        </Stack>
                    ))}
                </>
            )}

            <HorizontalDivider style={{ marginBottom: 10 }} />
        </>
    );
};

export { ViewCard };
