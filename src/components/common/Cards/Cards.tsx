import { FC } from "react";
import { NoFound } from "../NoFound";
import { Card } from "./Card";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Cards: FC<any> = ({ onChange, cards, selectedCards }) => {
    if (!Array.isArray(cards)) {
        return (<NoFound />);
    }

    if (cards.length === 0) {
        return (<NoFound text="No Trello cards found" />);
    }

    return (
        <>
            {cards.map(({ id, ...card }) => (
                <Card
                    key={id}
                    id={id}
                    checked={selectedCards.includes(id)}
                    onChange={() => onChange(id)} {...card}/>
            ))}
        </>
    );
}

export { Cards };
