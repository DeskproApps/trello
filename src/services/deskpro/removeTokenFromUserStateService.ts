import type { IDeskproClient } from "@deskpro/app-sdk";
import { placeholders } from "../../constants";

const removeTokenFromUserStateService = (client: IDeskproClient) => {
    return client.deleteUserState(placeholders.OAUTH_TOKEN_PATH)
};

export { removeTokenFromUserStateService };
