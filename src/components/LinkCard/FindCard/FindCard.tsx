import { useState, FC, ChangeEvent } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
    HorizontalDivider,
    useDeskproAppClient,
} from "@deskpro/app-sdk";
import { useStore } from "../../../context/StoreProvider/hooks";
import {
    Cards,
    Button,
    Loading,
    InputSearch,
    SingleSelect,
} from "../../common";
import { baseRequest } from "../../../services/trello/baseRequest";
import { setEntityCardService } from "../../../services/entityAssociation";
import { getQueryParams } from "../../../utils";

const getFilteredCards = (cards: any[], boardId?: string) => {
    let filteredCards = [];
    if (!boardId) {
        filteredCards = cards;
    } else {
        filteredCards = cards.filter(({ board }) => board.id === boardId)
    }

    return filteredCards;
};

const FindCard: FC = () => {
    const { client } = useDeskproAppClient();
    const [state, dispatch] = useStore();
    const [loading, setLoading] = useState<boolean>(false);
    const [searchCard, setSearchCard] = useState<string>("");
    const [cards, setCards] = useState<any[]>([]);
    const [selectedCards, setSelectedCards] = useState<string[]>([]);
    const [selectedBoard, setSelectedBoard] = useState<{
        key?: string,
        label?: string,
        type?: string,
        value?: string,
    }>({});
    const [boardOptions, setBoardOptions] = useState([]);
    const ticketId = state.context?.data.ticket.id;

    const onClearSearch = () => {
        setSearchCard('');
        setCards([]);
    };

    const onChangeSelectedCard = (cardId: string) => {
        let newSelectedCards = [...selectedCards];
        if (selectedCards.includes(cardId)) {
            newSelectedCards = selectedCards.filter((selectedCardId) => selectedCardId !== cardId);
        } else {
            newSelectedCards.push(cardId);
        }
        setSelectedCards(newSelectedCards);
    };

    const searchInTrello = useDebouncedCallback<(q: string) => void>((q) => {
        if (!client) {
            return;
        }

        if (!q || q.length < 2) {
            dispatch({ type: "linkedTrelloCards", cards: [] });
            return;
        }

        setLoading(true);

        return baseRequest(
            client,
            `https://api.trello.com/1/search?${getQueryParams({
                key: "__client_key__",
                token: "[user[oauth2/token]]",
                modelTypes: "cards",
                card_board: true,
                card_list: true,
                card_members: true,
                cards_limit: 1000,
                query: q,
            })}`,
        )
            .then(({ cards }) => {
                setCards(cards);
                setBoardOptions(cards.reduce((acc: Record<any, any>, { board }: any) => {
                    if (!acc[board.id]) {
                        acc[board.id] = {
                            key: board.id,
                            label: board.name,
                            type: "value",
                            value: board.id,
                        };
                    }

                    return acc;
                }, {}));
            })
            .catch((err) => {
                console.log(">>> search:catch:", { err });
            })
            .finally(() => setLoading(false));
    }, 500);

    const onChangeSearch = ({ target: { value: q }}: ChangeEvent<HTMLInputElement>) => {
        setSearchCard(q);
        searchInTrello(q);
    };

    const onSelectBoard = (option: object) => setSelectedBoard(option);

    const onLinkCard = () => {
        console.log(">>> linkCards:", { selectedCards });
        if (!client || !ticketId) {
            return;
        }

        Promise.all(selectedCards.map(
            (cardId) => setEntityCardService(client, ticketId, cardId)
        ))
            .then(() => dispatch({ type: "changePage", page: "home" }))
            .catch((error) => dispatch({ type: "error", error }));
    };

    return (
        <>
            <InputSearch
                value={searchCard}
                onClear={onClearSearch}
                onChange={onChangeSearch}
            />

            <SingleSelect
                label="Board"
                value={selectedBoard?.label}
                onChange={onSelectBoard}
                options={Object.values(boardOptions)}
            />

            <HorizontalDivider style={{ marginBottom: 10 }} />

            {loading
                ? (<Loading/>)
                : (
                    <Cards
                        cards={getFilteredCards(cards, selectedBoard?.value)}
                        selectedCards={selectedCards}
                        onChange={onChangeSelectedCard}
                    />
                )}

            <Button
                disabled={selectedCards.length === 0}
                text="Link Card"
                onClick={onLinkCard}
            />
        </>
    );
};

export { FindCard };
