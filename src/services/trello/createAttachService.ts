import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import { CardType } from "./types";

const createAttachService = async (
    client: IDeskproClient,
    cardId: CardType["id"],
    data: FormData,
) => {
    return baseRequest(client, {
        url: `/cards/${cardId}/attachments`,
        method: "POST",
        data,
        queryParams: {
            setCover: `${false}`,
        }
    });
};

export { createAttachService };
