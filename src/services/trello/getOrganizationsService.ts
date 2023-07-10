import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import { Organization } from "./types";

const getOrganizationsService = (client: IDeskproClient) => {
    return baseRequest<Organization[]>(client, {
        url: "/members/me/organizations",
        queryParams: {
            fields: "id,name,displayName,url",
        },
    });
};

export { getOrganizationsService };
