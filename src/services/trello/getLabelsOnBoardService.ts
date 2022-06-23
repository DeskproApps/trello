import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import { Board } from "./types";

const getLabelsOnBoardService = (
    client: IDeskproClient,
    boardId: Board["id"],
) => {
    return baseRequest(client, {
        url: `/boards/${boardId}/labels`,
        queryParams: {},
    });
};

export { getLabelsOnBoardService };
