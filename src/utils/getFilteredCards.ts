import { Board, CardType } from "../services/trello/types";

const getFilteredCards = (cards: CardType[], boardId?: Board["id"]) => {
    let filteredCards = [];

    if (!boardId || boardId === "any") {
        filteredCards = cards;
    } else {
        filteredCards = cards.filter(({ board }) => board.id === boardId)
    }

    return filteredCards;
};

export { getFilteredCards };
