import { FC, useCallback } from "react";
import get from "lodash/get";
import { useNavigate, useParams } from "react-router-dom";
import {
    LoadingSpinner,
    useDeskproElements,
    useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { useSetTitle } from "../../hooks";
import { CardType } from "../../services/trello/types";
import { ViewCard } from "../../components";
import { useCard } from "./hooks";
import type { TicketContext } from "../../types";

const ViewCardPage: FC = () => {
    const navigate = useNavigate();
    const { cardId } = useParams();
    const { context } = useDeskproLatestAppContext() as { context: TicketContext };
    const { card, comments, loading, onChangeChecklistItem } = useCard(cardId);

    const ticketId = get(context, ["data", "ticket", "id"]);
    const shortUrl = get(card, ["shortUrl"]);

    useSetTitle("View Card");

    useDeskproElements(({ clearElements, registerElement }) => {
        clearElements();
        registerElement("trelloRefreshButton", { type: "refresh_button" });
        registerElement("trelloHomeButton", {
            type: "home_button",
            payload: { type: "changePage", path: "/home" }
        });

        if (cardId) {
            registerElement("trelloEditButton", {
                type: "edit_button",
                payload: { type: "changePage", path: `/edit_card/${cardId}` },
            });
        }
        if (cardId && ticketId) {
            registerElement("trelloMenu", {
                type: "menu",
                items: [{
                    title: "Unlink Ticket",
                    payload: { type: "unlinkTicket", cardId, ticketId },
                }],
            });
        }
        if (shortUrl) {
            registerElement("trelloExternalCtaLink", {
                type: "cta_external_link",
                url: shortUrl,
                hasIcon: true,
            });
        }
    }, [cardId, ticketId, shortUrl]);

    const onNavigateToAddNewComment = useCallback(() => {
        navigate(`/add_comment/${cardId}`);
    }, [cardId, navigate]);

    if (loading) {
        return (
            <LoadingSpinner/>
        );
    }

    return (
        <ViewCard
            card={card as CardType}
            comments={comments}
            onNavigateToAddNewComment={onNavigateToAddNewComment}
            onChangeChecklistItem={onChangeChecklistItem}
        />
    );
};

export { ViewCardPage };
