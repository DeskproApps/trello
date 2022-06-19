import {FC, useEffect, useState} from "react";
import { useDeskproAppClient } from "@deskpro/app-sdk";
import { useStore } from "../context/StoreProvider/hooks";
import { getCardService } from "../services/trello";
import { findEntityById } from "../utils";
import { ViewCard } from "../components/ViewCard";
import { Loading, NoFound } from "../components/common";

const ViewCardPage: FC = () => {
    const [state, dispatch] = useStore();
    const { client } = useDeskproAppClient();
    const [card, setCard] = useState<any | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!client) {
            return;
        }
    }, [client]);

    useEffect(() => {
        if (!client || !state?.pageParams?.cardId) {
            return;
        }

        const card = findEntityById(state.cards, state.pageParams.cardId);

        if (card) {
            setCard(card);
            setLoading(false);
        } else {
            getCardService(client, state.pageParams.cardId)
                .then((card) => setCard(card))
                .finally(() => setLoading(false));
        }
    }, [state?.pageParams?.cardId]);

    console.log(">>> view:", card);

    if (!loading && !card) {
        return (<NoFound/>);
    }

    return loading
        ? (<Loading/>)
        : (<ViewCard {...card} />);
};

export { ViewCardPage };
