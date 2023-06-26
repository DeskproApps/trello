import { useCallback } from "react";
import get from "lodash/get";
import { useDeskproAppClient, useQueryWithClient } from "@deskpro/app-sdk";
import {
    getCardService,
    getCardCommentsService,
    updateChecklistItemService,
} from "../../services/trello";
import { useAsyncError } from "../../hooks";
import { QueryKey, queryClient } from "../../query";
import type { Maybe } from "../../types";
import type { CardType, ChecklistItem, Comment } from "../../services/trello/types";

type UseCard = (cardId?: CardType["id"]) => {
    card: Maybe<CardType>,
    comments: Maybe<Comment[]>,
    loading: boolean,
    onChangeChecklistItem: (
        itemId: ChecklistItem["id"],
        state: ChecklistItem["state"],
    ) => void,
};

const useCard: UseCard = (cardId) => {
    const { client } = useDeskproAppClient();
    const { asyncErrorHandler } = useAsyncError();

    const card = useQueryWithClient(
        [QueryKey.CARD, cardId as CardType["id"]],
        (client) => getCardService(client, cardId as CardType["id"]),
        { enabled: Boolean(cardId) },
    );

    const comments = useQueryWithClient(
        [QueryKey.CARD, cardId as CardType["id"], QueryKey.COMMENTS],
        (client) => getCardCommentsService(client, cardId as CardType["id"]),
        { enabled: Boolean(cardId) },
    );

    const onChangeChecklistItem = useCallback((itemId, state) => {
        if (!client || !cardId) {
            return;
        }

        updateChecklistItemService(client, cardId, itemId, { state })
            .then(() => queryClient.invalidateQueries())
            .catch(asyncErrorHandler);
    }, [client, cardId, asyncErrorHandler]);

    return {
        loading: [card, comments].some(({ isLoading }) => isLoading),
        card: get(card, ["data"]),
        comments: get(comments, ["data"]),
        onChangeChecklistItem,
    };
};

export { useCard };
