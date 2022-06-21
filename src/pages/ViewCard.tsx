import {FC, useEffect, useState} from "react";
import { useDeskproAppClient } from "@deskpro/app-sdk";
import { useStore } from "../context/StoreProvider/hooks";
import { getCardService } from "../services/trello";
import { findEntityById } from "../utils";
import { ViewCard } from "../components/ViewCard";
import { Loading, NoFound } from "../components/common";

const ViewCardPage: FC = () => {
    const [state] = useStore();
    const { client } = useDeskproAppClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [card, setCard] = useState<any | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!client || !card?.shortLink) {
            return;
        }

        client.setTitle(card.shortLink)
    }, [client, card?.shortLink]);

    useEffect(() => {
        if (!client) {
            return;
        }

        client.deregisterElement("trelloPlusButton");
        client?.deregisterElement("trelloMenu");
        client?.registerElement("trelloHomeButton", {
            type: "home_button",
            payload: { type: "changePage", page: "home" }
        });
    }, [client]);

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

        const card = findEntityById(state.cards, state.pageParams.cardId);

        if (card) {
            setCard(card);
            setLoading(false);
        } else {
            getCardService(client, state.pageParams.cardId)
                .then((card) => setCard(card))
                .finally(() => setLoading(false));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [client, state?.pageParams?.cardId]);

    if (!loading && !card) {
        return (<NoFound/>);
    }

    return loading
        ? (<Loading/>)
        : (<ViewCard {...card} />);
};

export { ViewCardPage };
