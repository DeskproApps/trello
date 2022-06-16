import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";

const searchByCardService = (client: IDeskproClient, query: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
