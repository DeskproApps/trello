import { FC } from "react";
import { NoFound } from "../NoFound";
import { Card } from "./Card";

const Cards: FC<any> = ({ onChange, cards, selectedCards }) => {
    if (!Array.isArray(cards)) {
        return <NoFound/>
    }

    if (cards.length === 0) {
        return <NoFound/>
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
