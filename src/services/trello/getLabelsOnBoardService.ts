import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import { Board, Labels } from "./types";

const getLabelsOnBoardService = (
    client: IDeskproClient,
    boardId: Board["id"],
) => {
    return baseRequest<Labels>(client, {
        url: `/boards/${boardId}/labels`,
        queryParams: {},
    });
};

export { getLabelsOnBoardService };
