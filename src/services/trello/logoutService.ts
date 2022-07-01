import { IDeskproClient } from "@deskpro/app-sdk";
import { removeTokenService } from "./removeTokenService";

const logoutService = (client: IDeskproClient) => {
    return removeTokenService(client);
};

export { logoutService };
