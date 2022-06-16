import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";

const getCurrentMemberService = (client: IDeskproClient) => {
    return baseRequest(client, { url:  "/members/me" });
};

export { getCurrentMemberService };
