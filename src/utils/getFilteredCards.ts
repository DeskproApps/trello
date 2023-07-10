import get from "lodash/get";
import toLower from "lodash/toLower";
import type { Board, CardType } from "../services/trello/types";

type Options = {
    query?: string,
    boardId?: Board["id"],
};

const getFilteredCards = (cards: CardType[], options: Options) => {
    const query = get(options, ["query"]);
    const boardId = get(options, ["boardId"]);

    if (!query && !boardId) {
        return cards;
    }

    let filteredCards = [];

    if (!boardId || boardId === "any") {
        filteredCards = cards;
    } else {
        filteredCards = cards.filter(({ board }) => board.id === boardId)
    }

    if (query) {
        filteredCards = cards.filter(({ id, name }) => {
            const cardTitle = toLower(name);
            const search = toLower(query);

            return cardTitle.includes(search) || id.includes(search);
        })
    }

    return filteredCards;
};

export { getFilteredCards };
