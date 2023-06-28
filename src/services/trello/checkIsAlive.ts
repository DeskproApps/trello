import get from "lodash/get";
import { IDeskproClient } from "@deskpro/app-sdk";
import { getCurrentMemberService } from "./getCurrentMember";
import { TrelloError } from "./TrelloError";

const checkIsAliveService = (
    client: IDeskproClient,
): Promise<TrelloError | { isAlive: true }> => {
    return getCurrentMemberService(client)
        .then((data) => {
            if (get(data, ["error"])) {
                return data;
            } else {
                return { isAlive: true };
            }
        });
};

export { checkIsAliveService };
