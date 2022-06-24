import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import { Board, Member } from "./types";

const getMembersOfOrganizationService = (
    client: IDeskproClient,
    organizationId: Board["id"],
) => {
    return baseRequest<Member[]>(client, {
        url: `/organizations/${organizationId}/members`,
    });
};

export { getMembersOfOrganizationService };
