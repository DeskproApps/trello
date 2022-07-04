import { IDeskproClient } from "@deskpro/app-sdk";
import { placeholders } from "./constants";

const removeTokenService = (client: IDeskproClient) => {
    return client.deleteUserState(placeholders.OAUTH_TOKEN_PATH);
};

export { removeTokenService };
