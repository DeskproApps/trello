import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import { CardType, Comment } from "./types";

const createCardCommentService = (
    client: IDeskproClient,
    cardId: CardType["id"],
    comment: Comment["data"]["text"],
) => {
    return baseRequest<Comment>(client, {
        url: `/cards/${cardId}/actions/comments`,
        method: "POST",
        queryParams: {
            text: comment,
        },
    });
};

export { createCardCommentService };
