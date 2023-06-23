import { FC, useEffect, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import {
    LoadingSpinner,
    HorizontalDivider,
    useDeskproElements,
    useDeskproAppClient,
} from "@deskpro/app-sdk";
import { useStore } from "../context/StoreProvider/hooks";
import { useSetTitle } from "../hooks";
import { getEntityCardListService } from "../services/deskpro";
import { getCardService } from "../services/trello";
import { CardType } from "../services/trello/types";
import { CardInfo, NoFound, InputSearch, Container } from "../components/common";

const getFilteredCards = (cards: CardType[], searchValue: string) => {
    let filteredCards = [];
    if (!searchValue) {
        filteredCards = cards;
    } else {
        filteredCards = cards.filter(({ id, name }) => {
            const cardTitle = name.toLowerCase();
            const search = searchValue.toLowerCase();

            return cardTitle.includes(search) || id.includes(search);
        })
    }

    return filteredCards;
};

const HomePage: FC = () => {
    const navigate = useNavigate();
    const { client } = useDeskproAppClient();
    const [state, dispatch] = useStore();
    const [loading, setLoading] = useState<boolean>(true);
    const [searchCard, setSearchCard] = useState<string>("");
    const ticketId = state.context?.data.ticket.id

    useSetTitle("Trello Cards");

    useDeskproElements(({ clearElements, registerElement }) => {
        clearElements();
        registerElement("trelloRefreshButton", { type: "refresh_button" });
        registerElement("trelloPlusButton", {
            type: "plus_button",
            payload: { type: "changePage", path: "/link_card" },
        });
        registerElement("trelloMenu", {
            type: "menu",
            items: [{
                title: "Log Out",
                payload: {
                    type: "logout",
                },
            }],
        });
    });

    useEffect(() => {
        if (!client || !ticketId) {
            return;
        }

        setLoading(true);

        getEntityCardListService(client, ticketId)
            .then((cardIds) => {
                if (Array.isArray(cardIds)) {
                    if (cardIds.length > 0) {
                        // ToDo: fix fetch in array
                        return Promise.all(cardIds.map((cardId) => {
                            return getCardService(client, cardId);
                        }))
                    } else {
                        navigate("/link_card");
                    }
                } else {
                    return Promise.reject(false);
                }
            })
            // @ts-ignore
            .then((cards) => dispatch({ type: "linkedTrelloCards", cards }))
            .catch((error) => dispatch({ type: "error", error }))
            .finally(() => setLoading(false));

    }, [client, ticketId]);

    const onPageChangeToViewCard = (cardId: string) => {
        navigate(`/view_card/${cardId}`);
    };

    if (loading) {
        return (
            <LoadingSpinner/>
        );
    }

    return (
        <Container>
            <InputSearch
                value={searchCard}
                onClear={() => setSearchCard("")}
                onChange={(e) => setSearchCard(e.target.value)}
            />
            <HorizontalDivider style={{ marginBottom: 9 }}/>
            {state.cards.length === 0
                ? (<NoFound/>)
                : getFilteredCards(state.cards, searchCard).map(({ id, ...card }) => (
                    <Fragment key={id}>
                        <CardInfo
                            id={id}
                            onTitleClick={() => onPageChangeToViewCard(id)}
                            {...card}
                        />
                        <HorizontalDivider style={{ marginBottom: 9 }}/>
                    </Fragment>
                ))
            }
        </Container>
    )
};

export { HomePage };
