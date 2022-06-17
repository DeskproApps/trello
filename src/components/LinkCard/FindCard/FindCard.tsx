import { useState, FC, ChangeEvent } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
    HorizontalDivider, Stack,
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
import { setEntityCardService } from "../../../services/entityAssociation";
import { searchByCardService } from "../../../services/trello";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getFilteredCards = (cards: any[], boardId?: string) => {
    let filteredCards = [];
    if (!boardId || boardId === "any") {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

        searchByCardService(client, q)
            .then(({ cards }) => {
                setCards(cards);
                const options = {
                    any: {
                        key: "any",
                        label: "Any",
                        type: "value",
                        value: "any",
                    }
                };

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setBoardOptions({
                    ...options,
                    ...cards.reduce((acc: Record<any, any>, { board }: any) => {
                        if (!acc[board.id]) {
                            acc[board.id] = {
                                key: board.id,
                                label: board.name,
                                type: "value",
                                value: board.id,
                            };
                        }

                        return acc;
                    }, {})
                });
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, 500);

    const onChangeSearch = ({ target: { value: q }}: ChangeEvent<HTMLInputElement>) => {
        setSearchCard(q);
        searchInTrello(q);
    };

    const onSelectBoard = (option: object) => {
        setSelectedBoard(option);
    };

    const onLinkCard = () => {
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

            {(cards && cards.length > 0) && (
                <SingleSelect
                    label="Board"
                    value={selectedBoard?.label}
                    onChange={onSelectBoard}
                    options={Object.values(boardOptions)}
                />
            )}

            <Stack justify="space-between" style={{ paddingBottom: "4px" }}>
                <Button
                    disabled={selectedCards.length === 0}
                    text="Link Card"
                    onClick={onLinkCard}
                />
                <Button
                    text="Cancel"
                    onClick={() => dispatch({ type: "changePage", page: "home" })}
                    intent="secondary"
                />
            </Stack>

            <HorizontalDivider style={{ marginBottom: "10px" }} />

            {loading
                ? (<Loading/>)
                : (
                    <Cards
                        cards={getFilteredCards(cards, selectedBoard?.value)}
                        selectedCards={selectedCards}
                        onChange={onChangeSelectedCard}
                    />
                )}
        </>
    );
};

export { FindCard };
