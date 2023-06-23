import { FC, useState, ChangeEvent } from "react";
import noop from "lodash/noop";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useDebouncedCallback } from "use-debounce";
import { useNavigate } from "react-router-dom";
import {
    Stack,
    TwoButtonGroup,
    LoadingSpinner,
    HorizontalDivider,
    useDeskproElements,
    useDeskproAppClient,
} from "@deskpro/app-sdk";
import { useSetTitle } from "../hooks";
import { getEntityMetadata, getFilteredCards } from "../utils";
import { useStore } from "../context/StoreProvider/hooks";
import { Board, CardType } from "../services/trello/types";
import { createCardCommentService, searchByCardService } from "../services/trello";
import { setEntityCardService } from "../services/deskpro";
import {
    Cards,
    Button,
    Container,
    InputSearch,
    SingleSelect,
} from "../components/common";

type Option = {
    key: "any" | string,
    label: "Any" | string,
    type: "value",
    value: "any" | string,
};

type ObjectOptions = Record<"any" | Board["id"], Option>

const LinkCardPage: FC = () => {
    const navigate = useNavigate();
    const { client } = useDeskproAppClient();
    const [state, dispatch] = useStore();
    const [loading, setLoading] = useState<boolean>(false);
    const [searchCard, setSearchCard] = useState<string>("");
    const [cards, setCards] = useState<CardType[]>([]);
    const [selectedCards, setSelectedCards] = useState<string[]>([]);
    const [selectedBoard, setSelectedBoard] = useState<{
        key?: string,
        label?: string,
        type?: string,
        value?: string,
    }>({});
    const [boardOptions, setBoardOptions] = useState<ObjectOptions>({});
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
                const options: ObjectOptions = {
                    any: {
                        key: "any",
                        label: "Any",
                        type: "value",
                        value: "any",
                    }
                };

                setBoardOptions({
                    ...options,
                    ...cards.reduce((acc: ObjectOptions, { board }: CardType): ObjectOptions => {
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

        /* ToDo: it is necessary to be able to link several entities with one request
            example: client.getEntityAssociation(TRELLO_ENTITY, ticketId).set([cardId_1, cardId_2, ...])
         */
        Promise.all(selectedCards.map(
            (cardId) => setEntityCardService(
                client,
                ticketId,
                cardId,
                getEntityMetadata(cards.find(({ id }: CardType) => id === cardId)),
            )
        ))
            .then(() => {
                return Promise.all(selectedCards.map(
                    (cardId) => createCardCommentService(
                        client,
                        cardId,
                        `Linked to Deskpro ticket ${ticketId}${state.context?.data?.ticket?.permalinkUrl
                            ? `, ${state.context.data.ticket.permalinkUrl}`
                            : ""
                        }`,
                    )
                ))
            })
            .then(() => navigate("/home"))
            .catch((error) => dispatch({ type: "error", error }));
    };

    useSetTitle("Link Cards");

    useDeskproElements(({ clearElements, registerElement }) => {
        clearElements();
        registerElement("trelloRefreshButton", { type: "refresh_button" });
        registerElement("trelloHomeButton", {
            type: "home_button",
            payload: { type: "changePage", path: "/home" }
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

    return (
        <Container>
            <TwoButtonGroup
                selected="one"
                oneIcon={faSearch}
                oneLabel="Find Card"
                oneOnClick={noop}
                twoIcon={faPlus}
                twoLabel="Create Card"
                twoOnClick={() => navigate("/create_card")}
            />
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
                    text="Link Cards"
                    onClick={onLinkCard}
                />
                <Button
                    text="Cancel"
                    onClick={() => navigate("/home")}
                    intent="secondary"
                />
            </Stack>

            <HorizontalDivider style={{ marginBottom: "10px" }} />

            {loading
                ? (<LoadingSpinner/>)
                : (
                    <Cards
                        cards={getFilteredCards(cards, selectedBoard?.value)}
                        selectedCards={selectedCards}
                        onChange={onChangeSelectedCard}
                    />
                )}
        </Container>
    );
};

export { LinkCardPage };
