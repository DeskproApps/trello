import get from "lodash/get";
import { useQueryWithClient } from "@deskpro/app-sdk";
import { getOrganizationsService } from "../../services/trello";
import { QueryKey } from "../../query";
import type { Organization } from "../../services/trello/types";

type UseHomeDeps = () => {
    isLoading: boolean,
    organizations: Organization[],
};

const useHomeDeps: UseHomeDeps = () => {
    const organizations = useQueryWithClient(
        [QueryKey.ORGANIZATIONS],
        (client) => getOrganizationsService(client),
    );

    return {
        isLoading: [organizations].some(({ isLoading }) => isLoading),
        organizations: get(organizations, ["data"], []) || [],
    };
};

export { useHomeDeps };
