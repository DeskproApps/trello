import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import { CardType } from "./types";

const searchByCardService = (client: IDeskproClient, query: string) => {
    return baseRequest<{ cards: CardType[] }>(client, {
        url: "/search",
        queryParams: {
            modelTypes: "cards",
            card_board: `${true}`,
            board_fields: "idOrganization,name,shortUrl,url",
            card_list: `${true}`,
            card_members: `${true}`,
            cards_limit: "1000",
            query,
        }
    })
};

export { searchByCardService };
