import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import { CardType, Comment } from "./types";

const getCardCommentsService = (
    client: IDeskproClient,
    cardId: CardType["id"],
) => {
    return baseRequest<Comment[]>(client, {
        url: `/cards/${cardId}/actions`,
        queryParams: {
            filter: "commentCard",
        },
    });
};

export { getCardCommentsService };
