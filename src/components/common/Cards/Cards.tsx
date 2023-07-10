import { FC } from "react";
import { NoFound } from "../NoFound";
import { Card } from "./Card";
import type { CardType, Organization } from "../../../services/trello/types";

type Props = {
    cards: CardType[],
    organizations: Organization[],
    selectedCards: Array<CardType["id"]>,
    onChange: (cardId: CardType["id"]) => void,
};

const Cards: FC<Props> = ({
    cards,
    onChange,
    organizations,
    selectedCards,
}) => {
    if (!Array.isArray(cards)) {
        return (<NoFound />);
    }

    if (cards.length === 0) {
        return (<NoFound text="No Trello cards found" />);
    }

    return (
        <>
            {cards.map((card) => (
                <Card
                    key={card.id}
                    card={card}
                    organizations={organizations}
                    checked={selectedCards.includes(card.id)}
                    onChange={() => onChange(card.id)}
                />
            ))}
        </>
    );
}

export { Cards };
