import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import { Member } from "./types";
import { TrelloError } from "./TrelloError";

const getCurrentMemberService = (client: IDeskproClient) => {
    return baseRequest<Member & TrelloError>(client, {
        url:  "/members/me",
        queryParams: {
            boards: "all",
            board_lists: "all",
            organizations: "all",
        },
    });
};

export { getCurrentMemberService };
