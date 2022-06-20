import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import { CardType } from "./types";

const getCardService = (
    client: IDeskproClient,
    cardId: CardType["id"],
) => {
    return baseRequest<CardType>(client, {
        url: `/cards/${cardId}`,
        queryParams: {
            members: true,
            board: true,
            list: true,
            checklists: "all",
            fields: "all",
        },
    });
};

export { getCardService };
