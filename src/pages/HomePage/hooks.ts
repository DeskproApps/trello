import { useEffect, useState } from "react";
import get from "lodash/get";
import { useNavigate } from "react-router-dom";
import {
    useDeskproAppClient,
    useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { useStore } from "../../context/StoreProvider/hooks";
import { getEntityCardListService } from "../../services/deskpro";
import { getCardService } from "../../services/trello";
import type { TicketContext } from "../../types";
import type { CardType } from "../../services/trello/types";

type UseCards = () => {
    loading: boolean,
    cards: CardType[],
};

const useCards: UseCards = () => {
    const navigate = useNavigate();
    const { context } = useDeskproLatestAppContext() as { context: TicketContext };
    const { client } = useDeskproAppClient();
    const [state, dispatch] = useStore();
    const [loading, setLoading] = useState<boolean>(true);

    const ticketId = get(context, ["data", "ticket", "id"]);

    useEffect(() => {
        if (!client || !ticketId) {
            return;
        }

        setLoading(true);

        getEntityCardListService(client, ticketId)
            .then((cardIds) => {
                if (Array.isArray(cardIds)) {
                    if (cardIds.length > 0) {
                        // ToDo: fix fetch in array
                        return Promise.all(cardIds.map((cardId) => {
                            return getCardService(client, cardId);
                        }))
                    } else {
                        navigate("/link_card");
                    }
                } else {
                    return Promise.reject(false);
                }
            })
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            .then((cards) => dispatch({ type: "linkedTrelloCards", cards }))
            .catch((error) => dispatch({ type: "error", error }))
            .finally(() => setLoading(false));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [client, ticketId]);

    return { loading, cards: state.cards };
};

export { useCards };
