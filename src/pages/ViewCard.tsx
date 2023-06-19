import { FC, useEffect, useState } from "react";
import get from "lodash/get";
import cloneDeep from "lodash/cloneDeep";
import {
    LoadingSpinner,
    useDeskproElements,
    useDeskproAppClient,
} from "@deskpro/app-sdk";
import { useSetAppTitle } from "../hooks";
import { useStore } from "../context/StoreProvider/hooks";
import {
    getCardService,
    getCardCommentsService,
    updateChecklistItemService,
} from "../services/trello";
import { CardType, Comment, ChecklistItem } from "../services/trello/types";
import { ViewCard } from "../components/ViewCard";
import { Container, NoFound } from "../components/common";

const ViewCardPage: FC = () => {
    const [state, dispatch] = useStore();
    const { client } = useDeskproAppClient();
    const [card, setCard] = useState<CardType | undefined>(undefined);
    const [comments, setComments] = useState<Comment[]>();
    const [loading, setLoading] = useState<boolean>(true);
    const cardId = get(state, ["pageParams", "cardId"]);
    const ticketId = get(state, ["context", "data", "ticket", "id"]);
    const shortUrl = get(card, ["shortUrl"]);

    useSetAppTitle("View Card");

    useDeskproElements(({ clearElements, registerElement }) => {
        clearElements();
        registerElement("trelloRefreshButton", { type: "refresh_button" });
        registerElement("trelloHomeButton", {
            type: "home_button",
            payload: { type: "changePage", page: "home" }
        });

        if (cardId) {
            registerElement("trelloEditButton", {
                type: "edit_button",
                payload: {
                    type: "changePage",
                    page: "edit_card",
                    params: { cardId }
                },
            });
        }
        if (cardId && ticketId) {
            registerElement("trelloMenu", {
                type: "menu",
                items: [{
                    title: "Unlink Ticket",
                    payload: { type: "unlinkTicket", cardId, ticketId },
                }],
            });
        }
        if (shortUrl) {
            registerElement("trelloExternalCtaLink", {
                type: "cta_external_link",
                url: shortUrl,
                hasIcon: true,
            });
        }
    }, [cardId, ticketId, shortUrl]);

    useEffect(() => {
        if (!client || !state?.pageParams?.cardId) {
            return;
        }

        Promise.all([
            getCardService(client, state.pageParams.cardId),
            getCardCommentsService(client, state.pageParams.cardId),
        ])
            .then(([card, comments]) => {
                setCard(card);
                setComments(comments);
            })
            .finally(() => setLoading(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [client, state?.pageParams?.cardId]);

    const onChangeChecklistItem = (
        itemId: ChecklistItem["id"],
        state: ChecklistItem["state"],
    ) => {
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
    };

    const onAddNewCommentPage = (cardId: CardType["id"]) => {
        dispatch({
            type: "changePage",
            page: "add_comment",
            params: { cardId },
        });
    };

    if (!loading && !card) {
        return (<NoFound/>);
    }

    if (loading) {
        return (
            <LoadingSpinner/>
        );
    }

    return (
        <Container>
            <ViewCard
                {...card as CardType}
                comments={comments}
                onAddNewCommentPage={onAddNewCommentPage}
                onChangeChecklistItem={onChangeChecklistItem}
            />
        </Container>
    );
};

export { ViewCardPage };
