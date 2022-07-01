import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import { placeholders } from "./constants";

const removeTokenService = (client: IDeskproClient) => {
    return baseRequest<Comment[]>(client, {
        url: `/tokens/${placeholders.TOKEN}/`,
        method: "DELETE",
    });
};

export { removeTokenService };
