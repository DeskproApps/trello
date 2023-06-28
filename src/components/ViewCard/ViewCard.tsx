import { useMemo } from "react";
import get from "lodash/get";
import size from "lodash/size";
import { HorizontalDivider } from "@deskpro/app-sdk";
import { CardType, ChecklistItem, Comment } from "../../services/trello/types";
import { NoFound } from "../common";
import { Info } from "./Info";
import { CheckLists } from "./CheckLists";
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

const ViewCard: FC<Props> = ({
    card,
    comments,
    onNavigateToAddNewComment,
    onChangeChecklistItem,
}) => {
    const checklists = get(card, ["checklists"]);
    const isChecklists = useMemo(() => {
        return Array.isArray(checklists) && size(checklists)
    }, [checklists]);

    if (!card) {
        return (<NoFound/>);
    }

    return (
        <>
            <Info card={card} />
            {isChecklists && (<HorizontalDivider style={{ marginBottom: 10 }} />)}
            <CheckLists checklists={checklists} onChangeChecklistItem={onChangeChecklistItem} />
            <HorizontalDivider style={{ marginBottom: 10 }} />
            <Comments comments={comments} onClickTitleAction={onNavigateToAddNewComment} />
        </>
    );
};

export { ViewCard };
