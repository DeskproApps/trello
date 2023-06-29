import { useCallback } from "react";
import get from "lodash/get";
import { useDeskproAppClient, useQueryWithClient } from "@deskpro/app-sdk";
import {
    getCardService,
    getCardCommentsService,
    getOrganizationsService,
    updateChecklistItemService,
} from "../../services/trello";
import { useAsyncError } from "../../hooks";
import { QueryKey, queryClient } from "../../query";
import type { Maybe } from "../../types";
import type {
    Comment,
    CardType,
    Organization,
    ChecklistItem,
} from "../../services/trello/types";

type UseCard = (cardId?: CardType["id"]) => {
    card: Maybe<CardType>,
    comments: Maybe<Comment[]>,
    loading: boolean,
    organizations: Organization[],
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

    const organizations = useQueryWithClient(
        [QueryKey.ORGANIZATIONS],
        (client) => getOrganizationsService(client),
    );

    const onChangeChecklistItem = useCallback((itemId: ChecklistItem["id"], state: ChecklistItem["state"]) => {
        if (!client || !cardId) {
            return;
        }

        updateChecklistItemService(client, cardId, itemId, { state })
            .then(() => queryClient.invalidateQueries())
            .catch(asyncErrorHandler);
    }, [client, cardId, asyncErrorHandler]);

    return {
        loading: [card, comments, organizations].some(({ isLoading }) => isLoading),
        card: get(card, ["data"]),
        comments: get(comments, ["data"]),
        organizations: get(organizations, ["data"], []) || [],
        onChangeChecklistItem,
    };
};

export { useCard };
