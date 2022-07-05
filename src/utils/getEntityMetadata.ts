import isEmpty from "lodash/isEmpty";
import { EntityMetadata } from "../context/StoreProvider/types";
import {CardType, Board, List, Member} from "../services/trello/types";
import { parseDateTime } from "../utils/date";

type Card = Omit<CardType, "list" | "board" | "members"> & {
    list: Pick<List, "id" | "name">,
    board: Pick<Board, "id" | "name">,
    members: Array<Pick<Member, "id" | "fullName">>
};

const getEntityMetadata = (card?: Card): undefined|EntityMetadata => {
    if (!card || isEmpty(card)) {
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
