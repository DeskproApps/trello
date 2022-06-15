import { useState, FC, ChangeEvent } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
    HorizontalDivider,
    useDeskproAppClient,
} from "@deskpro/app-sdk";
import { InputSearch, SingleSelect } from "../../common";
import { Cards } from "../../common/Cards";

const boardOptions = [
    { key: "board1", label: "Board 1", type: "value", value: "board1" },
    { key: "board2", label: "Board 2", type: "value", value: "board2" },
    { key: "board3", label: "Board 3", type: "value", value: "board3" },
];

const FindCard: FC = () => {
    const { client } = useDeskproAppClient();
    const [loading, setLoading] = useState<boolean>(false);
    const [searchCard, setSearchCard] = useState<string>("");

    const onClearSearch = () => {
        setSearchCard('');
    };

    const onChangeSearch = ({ target: { value: q }}: ChangeEvent<HTMLInputElement>) => {
        setSearchCard(q);
    };

    const searchInTrello = useDebouncedCallback<(q: string) => void>((q) => {
        if (!client) {
            return;
        }

        if (!q || q.length < 2) {
            // setCustomers([]);
            return;
        }

        setLoading(true);

        // getCustomers(client, { querySearch: q })
        //     .then(({ customers }) => {
        //         if (Array.isArray(customers)) {
        //             setCustomers(customers);
        //         }
        //     })
        //     .catch(() => {})
        //     .finally(() => setLoading(false));

        setLoading(false);
    }, 500);

    return (
        <>
            <InputSearch
                value={searchCard}
                onClear={onClearSearch}
                onChange={onChangeSearch}
            />

            <SingleSelect label="Board" options={boardOptions} />

            <HorizontalDivider style={{ marginBottom: 10 }} />

            <Cards />
        </>
    );
};

export { FindCard };
