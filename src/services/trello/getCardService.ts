import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import { getQueryParams } from "../../utils";

const getCardService = (client: IDeskproClient, cardId: string) => {
    return baseRequest(client, `https://api.trello.com/1/cards/${cardId}/?${getQueryParams({
        key: "__client_key__",
        token: "[user[oauth2/token]]",
        members: true,
        board: true,
        list: true,
    })}`);
};

export { getCardService };
