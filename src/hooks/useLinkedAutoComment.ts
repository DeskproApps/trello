import { useCallback, useState } from "react";
import get from "lodash/get";
import {
    useDeskproAppClient,
    useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { createCardCommentService } from "../services/trello";
import type { CardType, Comment } from "../services/trello/types";
import type { TicketContext } from "../types";

export type Result = {
    isLoading: boolean,
    addLinkComment: (cardId: CardType["id"]) => Promise<void|Comment>,
    addUnlinkComment: (taskId: CardType["id"]) => Promise<void|Comment>,
};

const getLinkedMessage = (ticketId: string, link?: string): string => {
    return `Linked to Deskpro ticket ${ticketId}${link ? `, ${link}` : ""}`
};

const getUnlinkedMessage = (ticketId: string, link?: string): string => {
    return `Unlinked from Deskpro ticket ${ticketId}${link ? `, ${link}` : ""}`
};

const useLinkedAutoComment = (): Result => {
    const { client } = useDeskproAppClient();
    const { context } = useDeskproLatestAppContext() as { context: TicketContext };
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const isEnable = get(context, ["settings", "add_comment_when_linking"], false);
    const ticketId = get(context, ["data", "ticket", "id"]);
    const permalink = get(context, ["data", "ticket", "permalinkUrl"]);

    const addLinkComment = useCallback((cardId: CardType["id"]) => {
        if (!client || !isEnable) {
            return Promise.resolve();
        }

        setIsLoading(true);
        return createCardCommentService(client, cardId, getLinkedMessage(ticketId as string, permalink as string))
            .finally(() => setIsLoading(false));
    }, [client, isEnable, ticketId, permalink]);

    const addUnlinkComment = useCallback((cardId: CardType["id"]) => {
        if (!client || !isEnable) {
            return Promise.resolve();
        }

        setIsLoading(true)
        return createCardCommentService(client, cardId, getUnlinkedMessage(ticketId, permalink))
            .finally(() => setIsLoading(false));
    }, [client, isEnable, ticketId, permalink]);

    return { isLoading, addLinkComment, addUnlinkComment };
};

export {
    getLinkedMessage,
    getUnlinkedMessage,
    useLinkedAutoComment,
};
