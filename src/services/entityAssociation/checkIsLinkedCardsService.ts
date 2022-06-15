import { IDeskproClient } from "@deskpro/app-sdk";
import {
    getEntityCardListService,
} from "./getEntityCardListService";

const checkIsLinkedCardsService = (
    client: IDeskproClient,
    ticketId: string
): Promise<boolean> => {
    return getEntityCardListService(client, ticketId)
        .then((cardIds) => {
            if (Array.isArray(cardIds)) {
                return cardIds.length > 0;
            } else {
                return Promise.reject(false);
            }
        });
};

export { checkIsLinkedCardsService };
