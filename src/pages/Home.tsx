import { FC, useEffect, useState, Fragment } from "react";
import {
    HorizontalDivider,
    useDeskproAppClient,
} from "@deskpro/app-sdk";
import { useStore } from "../context/StoreProvider/hooks";
import { useSetAppTitle } from "../hooks";
import { getEntityCardListService } from "../services/entityAssociation";
import { getCardService } from "../services/trello";
import { Loading, CardInfo, NoFound, InputSearch } from "../components/common";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getFilteredCards = (cards: any[], searchValue: string) => {
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

const Home: FC = () => {
    const { client } = useDeskproAppClient();
    const [state, dispatch] = useStore();
    const [loading, setLoading] = useState<boolean>(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [cards, setCards] = useState<any[]>([]);
    const [searchCard, setSearchCard] = useState<string>("");
    const ticketId = state.context?.data.ticket.id

    useSetAppTitle("Trello Cards");

    useEffect(() => {
        if (!client) {
            return;
        }

        client?.deregisterElement("trelloPlusButton");

        client?.registerElement("trelloPlusButton", {
            type: "plus_button",
            payload: { type: "changePage", page: "link_card" },
        });
    }, [client]);

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
                        dispatch({ type: "changePage", page: "link_card" });
                    }
                } else {
                    return Promise.reject(false);
                }
            })
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            .then((cards) => setCards(cards))
            .catch((error) => dispatch({ type: "error", error }))
            .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [client, ticketId]);

    return loading
        ? (<Loading/>)
        : (
            <>
                <InputSearch
                    value={searchCard}
                    onClear={() => setSearchCard("")}
                    onChange={(e) => setSearchCard(e.target.value)}
                />
                <HorizontalDivider style={{ marginBottom: 9 }}/>
                {cards.length === 0
                    ? (<NoFound/>)
                    : getFilteredCards(cards, searchCard).map(({ id, ...card }) => (
                        <Fragment key={id}>
                            <CardInfo {...({...card, id})} />
                            <HorizontalDivider style={{ marginBottom: 9 }}/>
                        </Fragment>
                    ))
                }
            </>
        )
};

export { Home };
