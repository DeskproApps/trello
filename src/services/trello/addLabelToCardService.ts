import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { CardType, Label } from "./types";

const addLabelToCardService = (
    client: IDeskproClient,
    cardId: CardType["id"],
    labelId: Label["id"],
) => {
    return baseRequest(client, {
        url: `/cards/${cardId}/idLabels`,
        method: "POST",
        queryParams: {
            value: labelId,
        },
    });
};

export { addLabelToCardService };
