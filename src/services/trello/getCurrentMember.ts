import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import { CustomError, Member } from "./types";

const getCurrentMemberService = (client: IDeskproClient) => {
    return baseRequest<Member & CustomError>(client, { url:  "/members/me" });
};

export { getCurrentMemberService };
