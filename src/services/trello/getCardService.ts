import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";

const getCardService = (client: IDeskproClient, cardId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return baseRequest<Record<string, any>>(client, {
        url: `/cards/${cardId}`,
        queryParams: {
            members: true,
            board: true,
            list: true,
        },
    });
};

export { getCardService };
