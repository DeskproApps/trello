import { useState, useCallback } from "react";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { useNavigate } from "react-router-dom";
import {
    useDeskproAppClient,
    useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { deleteEntityCardService } from "../services/deskpro";
import { useAsyncError } from "./useAsyncError";
import { useLinkedAutoComment } from "./useLinkedAutoComment";
import type { TicketContext } from "../types";
import type { CardType } from "../services/trello/types";

type UseUnlinkCard = () => {
    isLoading: boolean,
    unlink: (card: CardType) => void,
};

const useUnlinkCard: UseUnlinkCard = () => {
    const navigate = useNavigate();
    const { client } = useDeskproAppClient();
    const { context } = useDeskproLatestAppContext() as { context: TicketContext };
    const { asyncErrorHandler } = useAsyncError();
    const { addUnlinkComment } = useLinkedAutoComment();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const ticketId = get(context, ["data", "ticket", "id"]);

    const unlink = useCallback((card?: CardType) => {
        if (!client || !ticketId || isEmpty(card)) {
            return;
        }

        setIsLoading(true);

        return Promise.all([
            deleteEntityCardService(client, ticketId, card.id),
            addUnlinkComment(card.id),
        ])
            .catch(asyncErrorHandler)
            .finally(() => {
                setIsLoading(false);
                navigate("/home");
            });
    }, [client, navigate, asyncErrorHandler, ticketId, addUnlinkComment]);

    return { isLoading, unlink };
};

export { useUnlinkCard };
