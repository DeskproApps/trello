import { IDeskproClient } from "@deskpro/app-sdk";
import { TRELLO_ENTITY } from "../../constants";
import { CardType } from "../trello/types";

const deleteEntityCardService = (
    client: IDeskproClient,
    ticketId: string,
    cardId: CardType["id"],
) => {
    return client
        .getEntityAssociation(TRELLO_ENTITY, ticketId)
        .delete(cardId);
};

export { deleteEntityCardService };
