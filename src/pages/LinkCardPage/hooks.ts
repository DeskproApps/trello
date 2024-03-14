import { useState, useCallback } from "react";
import get from "lodash/get";
import noop from "lodash/noop";
import { useDebouncedCallback } from "use-debounce";
import {
    useQueryWithClient,
    useDeskproAppClient,
} from "@deskpro/app-sdk";
import { searchByCardService, getOrganizationsService } from "../../services/trello";
import { QueryKey } from "../../query";
import { getOption } from "../../utils";
import type { ChangeEvent } from "react";
import type { Option } from "../../types";
import type { CardType, Board, Organization } from "../../services/trello/types";

type BoardOptionsMap = Record<"any"|Board["id"], Option>

type UseSearch = () => {
    loading: boolean,
    cards: CardType[],
    searchCard: string,
    boardOptions: BoardOptionsMap,
    onClearSearch: () => void,
    onChangeSearch: (e: ChangeEvent<HTMLInputElement>) => void,
    organizations: Organization[],
};

const useSearch: UseSearch = () => {
    const { client } = useDeskproAppClient();
    const [loading, setLoading] = useState<boolean>(false);
    const [boardOptions, setBoardOptions] = useState<BoardOptionsMap>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        any: getOption("any", "Any") as any,
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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const options: BoardOptionsMap = { any: getOption("any", "Any") as any };

                setBoardOptions({
                    ...options,
                    ...cards.reduce((acc: BoardOptionsMap, { board }: CardType): BoardOptionsMap => {
                        if (!acc[board.id]) {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            acc[board.id] = getOption(board.id, board.name) as Option<any>;
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

    const organizations = useQueryWithClient(
        [QueryKey.ORGANIZATIONS],
        (client) => getOrganizationsService(client),
    );

    return {
        cards,
        loading,
        searchCard,
        boardOptions,
        onClearSearch,
        onChangeSearch,
        organizations: get(organizations, ["data"], []) || [],
    };
};

export { useSearch };
