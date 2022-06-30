import {FC, useEffect, useState} from "react";
import cloneDeep from "lodash/cloneDeep";
import { useDeskproAppClient } from "@deskpro/app-sdk";
import { useStore } from "../context/StoreProvider/hooks";
import {
    getCardService,
    updateChecklistItemService,
} from "../services/trello";
import { CardType, ChecklistItem } from "../services/trello/types";
import { ViewCard } from "../components/ViewCard";
import { Loading, NoFound } from "../components/common";

const ViewCardPage: FC = () => {
    const [state] = useStore();
    const { client } = useDeskproAppClient();
    const [card, setCard] = useState<CardType | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!client) {
            return;
        }

        client?.deregisterElement("trelloPlusButton");
        client?.deregisterElement("trelloMenu");
        client?.deregisterElement("trelloEditButton");

        client?.registerElement("trelloHomeButton", {
            type: "home_button",
            payload: { type: "changePage", page: "home" }
        });
    }, [client]);

    useEffect(() => {
        if (!client || !card?.shortLink) {
            return;
        }

        client.setTitle(card.shortLink)
    }, [client, card?.shortLink]);

    useEffect(() => {
        if (!client || !state?.pageParams?.cardId) {
            return;
        }

        client?.registerElement("trelloEditButton", {
            type: "edit_button",
            payload: {
                type: "changePage",
                page: "edit_card",
                params: { cardId: state.pageParams.cardId }
            },
        });
    }, [client, state?.pageParams?.cardId]);

    useEffect(() => {
        if (!client || !state?.pageParams?.cardId || !state.context?.data.ticket.id) {
            return;
        }

        client?.registerElement("trelloMenu", {
            type: "menu",
            items: [{
                title: "Unlink Ticket",
                payload: {
                    type: "unlinkTicket",
                    cardId: state.pageParams.cardId,
                    ticketId: state.context.data.ticket.id,
                },
            }],
        });
    }, [client, state?.pageParams?.cardId, state.context?.data.ticket.id]);

    useEffect(() => {
        if (!client) {
            return;
        }

        if (card?.shortUrl) {
            client?.registerElement("trelloExternalCtaLink", {
                type: "cta_external_link",
                url: card.shortUrl,
                hasIcon: true,
            });
        }
    }, [client, card?.shortUrl]);

    useEffect(() => {
        if (!client || !state?.pageParams?.cardId) {
            return;
        }

        getCardService(client, state.pageParams.cardId)
            .then((card) => setCard(card))
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

    if (!loading && !card) {
        return (<NoFound/>);
    }

    return loading
        ? (<Loading/>)
        : (
            <ViewCard
                {...card as CardType}
                onChangeChecklistItem={onChangeChecklistItem}
            />
        );
};

export { ViewCardPage };
