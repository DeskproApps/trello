import { IDeskproClient } from "@deskpro/app-sdk";
import { TRELLO_ENTITY } from "../../constants";

const getEntityListService = (
    client: IDeskproClient,
    ticketId: string,
): Promise<string[]> => {
    return client
        .getEntityAssociation(TRELLO_ENTITY, ticketId)
        .list();
};

export { getEntityListService };
