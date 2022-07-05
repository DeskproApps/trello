import { IDeskproClient } from "@deskpro/app-sdk";
import { TRELLO_ENTITY } from "./constants";
import { EntityMetadata } from "../../context/StoreProvider/types";

const setEntityCardService = (
    client: IDeskproClient,
    ticketId: string,
    cardId: string,
    metaData?: EntityMetadata,
) => {
    return client
        .getEntityAssociation(TRELLO_ENTITY, ticketId)
        .set(cardId, metaData)
};

export { setEntityCardService };
