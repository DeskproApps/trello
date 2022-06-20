import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import { CardType } from "./types";

const getCardService = (
    client: IDeskproClient,
    cardId: CardType["id"],
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return baseRequest<Record<string, any>>(client, {
        url: `/cards/${cardId}/actions`,
        queryParams: {
            filter: "commentCard",
        },
    });
};

export { getCardService };
