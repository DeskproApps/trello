import { IDeskproClient } from "@deskpro/app-sdk";
import { removeTokenService } from "./removeTokenService";
import { placeholders } from "../../constants";

const logoutService = (client: IDeskproClient) => {
    return removeTokenService(client)
        .then(() => client.deleteUserState(placeholders.OAUTH_TOKEN_PATH));
};

export { logoutService };
