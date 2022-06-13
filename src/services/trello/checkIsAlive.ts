import { IDeskproClient } from "@deskpro/app-sdk";
import { getCurrentMemberService } from "./getCurrentMember";

const checkIsAliveService = (client: IDeskproClient) => {
    return getCurrentMemberService(client)
        .then((data) => {
            if (data?.error) {
                return data;
            } else {
                return { isAlive: true };
            }
        });
};

export { checkIsAliveService };
