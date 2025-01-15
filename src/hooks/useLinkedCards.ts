import get from "lodash/get";
import size from "lodash/size";
import {
    useQueryWithClient,
    useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { getEntityListService } from "../services/deskpro";
import { getCardService } from "../services/trello";
import { useQueriesWithClient } from "./useQueriesWithClient";
import { QueryKey } from "../query";
import type { TicketContext } from "../types";
import type { CardType } from "../services/trello/types";

type UseLinkedCards = () => {
    isLoading: boolean,
    cards: CardType[],
};

const useLinkedCards: UseLinkedCards = () => {
    const { context } = useDeskproLatestAppContext() as { context: TicketContext };
    const ticketId = get(context, ['data', 'ticket', 'id']);

    if (!ticketId) {
        console.error('no ticketID');

        return {
            isLoading: false,
            cards: []
        };
    };

    const linkedIds = useQueryWithClient(
        [QueryKey.LINKED_CARDS],
        (client) => getEntityListService(client, ticketId),
        { enabled: Boolean(ticketId) },
    );

    const cards = useQueriesWithClient((get(linkedIds, ["data"], []) || []).map((cardId) => ({
        queryKey: [QueryKey.CARD, cardId],
        queryFn: (client) => getCardService(client, cardId),
        enabled: Boolean(size(linkedIds)),
        useErrorBoundary: false,
    })));

    return {
        isLoading: [linkedIds, ...cards].some(({ isLoading }) => isLoading),
        cards: cards.map(({ data }) => data).filter(Boolean) as CardType[] || [],
    }
};

export { useLinkedCards };
