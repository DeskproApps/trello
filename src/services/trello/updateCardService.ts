import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import { CardType } from "./types";

const updateCardService = (
    client: IDeskproClient,
    cardId: CardType["id"],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queryParams: any,
) => {
    return baseRequest<CardType>(client, {
        url: `/cards/${cardId}`,
        method: "PUT",
        queryParams,
    });
};

export { updateCardService };
