import { IDeskproClient } from "@deskpro/app-sdk";
import { getCurrentMemberService } from "./getCurrentMember";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const checkIsAliveService = (client: IDeskproClient): Promise<{ isAlive: true } | any> => {
    return getCurrentMemberService(client)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((data: any) => {
            if (data?.error) {
                return data;
            } else {
                return { isAlive: true };
            }
        });
};

export { checkIsAliveService };
