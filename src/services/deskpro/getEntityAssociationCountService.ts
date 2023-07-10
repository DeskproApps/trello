import { TRELLO_ENTITY } from "../../constants";
import type { IDeskproClient } from "@deskpro/app-sdk";

const getEntityAssociationCountService = (client: IDeskproClient, id: string) => {
  return client.entityAssociationCountEntities(TRELLO_ENTITY, id);
};

export { getEntityAssociationCountService };
