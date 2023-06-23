import get from "lodash/get";
import { IDeskproClient } from "@deskpro/app-sdk";
import { getCurrentMemberService } from "./getCurrentMember";
import { CustomError } from "./types";

const checkIsAliveService = (
    client: IDeskproClient,
): Promise<CustomError | { isAlive: true }> => {
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
