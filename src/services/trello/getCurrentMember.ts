import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";

const getCurrentMemberService = (client: IDeskproClient) => {
    return baseRequest(client, 'https://api.trello.com/1/members/me/?key=__client_key__&token=[user[oauth2/token]]');
};

export { getCurrentMemberService };
