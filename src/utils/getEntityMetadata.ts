import isEmpty from "lodash/isEmpty";
import { EntityMetadata } from "../context/StoreProvider/types";
import { CardType } from "../services/trello/types";
import { parseDateTime } from "../utils/date";

const getEntityMetadata = (card?: CardType): undefined|EntityMetadata => {
    if (isEmpty(card)) {
        return undefined;
    }

    return {
        cardId: card.id,
        description: card.desc,
        dueDate: parseDateTime(card.due),
        boardId: card.board.id,
        boardName: card.board.name,
        listId: card.list.id,
        listName: card.list.name,
        labels: card.labels.map(({ id, name }) => ({ id, name })),
        members: card.members.map(({ id, fullName }) => ({ id, name: fullName })),
    };
};

export { getEntityMetadata };
