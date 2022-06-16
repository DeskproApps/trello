import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";

const searchByCardService = (client: IDeskproClient, query: string) => {
    return baseRequest<{ cards: any }>(client, {
        url: "/search",
        queryParams: {
            modelTypes: "cards",
            card_board: true,
            card_list: true,
            card_members: true,
            cards_limit: 1000,
            query,
        }
    })
};

export { searchByCardService };
