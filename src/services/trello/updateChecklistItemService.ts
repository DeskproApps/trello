import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "./baseRequest";
import { CardType, ChecklistItem, ChecklistItemState } from "./types";

const updateChecklistItemService = (
    client: IDeskproClient,
    cardId: CardType["id"],
    checklistItemId: ChecklistItem["id"],
    queryParams: {
        state: ChecklistItemState,
    },
) => {
    return baseRequest<ChecklistItem>(client, {
        url: `/cards/${cardId}/checkItem/${checklistItemId}`,
        method: "PUT",
        queryParams,
    });
};

export { updateChecklistItemService };
