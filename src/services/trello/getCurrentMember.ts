import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import { CustomError, Member } from "./types";

const getCurrentMemberService = (client: IDeskproClient) => {
    return baseRequest<Member & CustomError>(client, {
        url:  "/members/me",
        queryParams: {
            boards: "all",
            board_lists: "all",
            organizations: "all",
        },
    });
};

export { getCurrentMemberService };
