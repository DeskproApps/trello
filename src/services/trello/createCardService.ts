import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import { CardType } from "./types";

const createCardService = (
    client: IDeskproClient,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any,
) => {
    return baseRequest<CardType>(client, {
        url: `/cards`,
        method: "POST",
        data,
    });
};

export { createCardService };
