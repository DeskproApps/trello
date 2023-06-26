import { useState, useCallback } from "react";
import noop from "lodash/noop";
import { useDebouncedCallback } from "use-debounce";
import { useDeskproAppClient } from "@deskpro/app-sdk";
import { searchByCardService } from "../../services/trello";
import { getOption } from "../../utils";
import type { ChangeEvent } from "react";
import type { Option } from "../../types";
import type { CardType, Board } from "../../services/trello/types";

type BoardOptionsMap = Record<"any"|Board["id"], Option>

type UseSearch = () => {
    loading: boolean,
    cards: CardType[],
    searchCard: string,
    boardOptions: BoardOptionsMap,
    onClearSearch: () => void,
    onChangeSearch: (e: ChangeEvent<HTMLInputElement>) => void,
};

const useSearch: UseSearch = () => {
    const { client } = useDeskproAppClient();
    const [loading, setLoading] = useState<boolean>(false);
    const [boardOptions, setBoardOptions] = useState<BoardOptionsMap>({
        any: getOption("any", "Any"),
    });

    const [searchCard, setSearchCard] = useState<string>("");
    const [cards, setCards] = useState<CardType[]>([]);

    const searchInTrello = useDebouncedCallback<(q: string) => void>((q) => {
        if (!client) {
            return;
        }

        if (!q || q.length < 2) {
            setCards([]);
            return;
        }

        setLoading(true);

        searchByCardService(client, q)
            .then(({ cards }) => {
                setCards(cards);
                const options: BoardOptionsMap = { any: getOption("any", "Any") };

                setBoardOptions({
                    ...options,
                    ...cards.reduce((acc: BoardOptionsMap, { board }: CardType): BoardOptionsMap => {
                        if (!acc[board.id]) {
                            acc[board.id] = getOption(board.id, board.name);
                        }
                        return acc;
                    }, {})
                });
            })
            .catch(noop)
            .finally(() => setLoading(false));
    }, 500);

    const onClearSearch = useCallback(() => {
        setSearchCard("");
        setCards([]);
    }, []);

    const onChangeSearch = ({ target: { value: q }}: ChangeEvent<HTMLInputElement>) => {
        setSearchCard(q);
        searchInTrello(q);
    };

    return {
        cards,
        loading,
        searchCard,
        boardOptions,
        onClearSearch,
        onChangeSearch,
    };
};

export { useSearch };
