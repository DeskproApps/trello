import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Label } from "./types";
import type { Dict } from "../../types";

const createLabelService = (
    client: IDeskproClient,
    label: Pick<Label, "name"|"color"|"idBoard">,
) => {
    return baseRequest<Label>(client, {
        url: "/labels",
        method: "POST",
        queryParams: label as Dict<string>,
    });
};

export { createLabelService };
