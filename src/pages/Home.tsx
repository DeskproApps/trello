import { FC, useEffect, useState } from "react";
import { useDeskproAppClient } from "@deskpro/app-sdk";
import { useStore } from "../context/StoreProvider/hooks";
import { useSetAppTitle } from "../hooks";
import { checkIsLinkedCardsService } from "../services/entityAssociation";
import { Loading } from "../components/common";

const Home: FC = () => {
    const { client } = useDeskproAppClient();
    const [state, dispatch] = useStore();
    const [loading, setLoading] = useState<boolean>(false);
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

        checkIsLinkedCardsService(client, ticketId)
            .then((isLinked) => {
                if (!isLinked) {
                    dispatch({ type: "changePage", page: "link_card" });
                }
            })
            .catch((error) => {
                dispatch({ type: "error", error })
            })
            .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [client, ticketId]);

    return loading
        ? (<Loading/>)
        : (
            <>
                HomePage
            </>
        );
};

export { Home };
