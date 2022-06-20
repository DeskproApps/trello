import { IDeskproClient } from "@deskpro/app-sdk";
import { TRELLO_ENTITY } from "./constants";

const setEntityCardService = (
    client: IDeskproClient,
    ticketId: string,
    cardId: string,
) => {
    return client
        .getEntityAssociation(TRELLO_ENTITY, ticketId)
        .set(cardId)
};

export { setEntityCardService };
