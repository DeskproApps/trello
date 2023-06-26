import { Fragment } from "react";
import size from "lodash/size";
import { HorizontalDivider } from "@deskpro/app-sdk";
import { CardInfo, NoFound, InputSearch, Container } from "../common";
import type { FC } from "react";
import type { Props as SearchProps } from "../common/InputSearch";
import type { CardType } from "../../services/trello/types";

type Props = {
    cards: CardType[],
    searchCard: string,
    onChangeSearchCard: SearchProps["onChange"],
    onClearSearchCard: () => void,
    onNavigateToViewCard: (cardId: CardType["id"]) => void,
};

const Home: FC<Props> = ({
    cards,
    searchCard,
    onClearSearchCard,
    onChangeSearchCard,
    onNavigateToViewCard,
}) => {
    return (
        <Container>
            <InputSearch
                value={searchCard}
                onClear={onClearSearchCard}
                onChange={onChangeSearchCard}
            />
            <HorizontalDivider style={{ marginBottom: 9 }}/>
            {!size(cards)
                ? (<NoFound/>)
                : cards.map(({ id, ...card }) => (
                    <Fragment key={id}>
                        <CardInfo
                            id={id}
                            onTitleClick={() => onNavigateToViewCard(id)}
                            {...card}
                        />
                        <HorizontalDivider style={{ marginBottom: 9 }}/>
                    </Fragment>
                ))
            }
        </Container>
    );
};

export { Home };
