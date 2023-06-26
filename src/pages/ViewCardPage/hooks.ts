import { useEffect, useState, useCallback } from "react";
import cloneDeep from "lodash/cloneDeep";
import { useDeskproAppClient } from "@deskpro/app-sdk";
import {
    getCardService,
    getCardCommentsService,
    updateChecklistItemService,
} from "../../services/trello";
import type { CardType, Comment, ChecklistItem } from "../../services/trello/types";

type UseCard = (cardId?: CardType["id"]) => {
    card?: CardType,
    comments: Comment[],
    loading: boolean,
    onChangeChecklistItem: (
        itemId: ChecklistItem["id"],
        state: ChecklistItem["state"],
    ) => void,
};

const useCard: UseCard = (cardId) => {
    const { client } = useDeskproAppClient();
    const [card, setCard] = useState<CardType|undefined>(undefined);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const onChangeChecklistItem = useCallback((itemId, state) => {
        if (!client || !card?.id) {
            return;
        }

        updateChecklistItemService(client, card.id, itemId, { state })
            .then((checklistItem: ChecklistItem) => {
                const updatedCart = cloneDeep<CardType>(card);

                updatedCart.checklists = updatedCart.checklists.map((checklist) => {
                    checklist.checkItems = checklist.checkItems.map((item) => {
                        if (item.id === itemId) {
                            item = checklistItem;
                        }

                        return item;
                    });
                    return checklist
                });

                setCard(updatedCart);
            });
    }, [client, card]);

    useEffect(() => {
        if (!client || !cardId) {
            return;
        }

        Promise.all([
            getCardService(client, cardId),
            getCardCommentsService(client, cardId),
        ])
            .then(([card, comments]) => {
                setCard(card);
                setComments(comments);
            })
            .finally(() => setLoading(false));

    }, [client, cardId]);

    return { card, comments, loading, onChangeChecklistItem };
};

export { useCard };
