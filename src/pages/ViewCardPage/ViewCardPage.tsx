import { FC, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  LoadingSpinner,
  useDeskproElements,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { useSetTitle } from "../../hooks";
import { ViewCard } from "../../components";
import { useCard } from "./hooks";
import type { Settings, TicketData } from "../../types";

const ViewCardPage: FC = () => {
  const navigate = useNavigate();
  const { cardId } = useParams();
  const { context } = useDeskproLatestAppContext<TicketData, Settings>();
  const {
    card,
    loading,
    comments,
    organizations,
    onChangeChecklistItem,
  } = useCard(cardId);

  const ticketId = context?.data?.ticket?.id;

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
          payload: { type: "unlink", card },
        }],
      });
    }
  }, [cardId, ticketId, card]);

  const onNavigateToAddNewComment = useCallback(() => {
    navigate(`/add_comment/${cardId}`);
  }, [cardId, navigate]);

  if (loading) {
    return (
      <LoadingSpinner />
    );
  }

  return (
    <ViewCard
      card={card}
      comments={comments ?? []}
      organizations={organizations}
      onNavigateToAddNewComment={onNavigateToAddNewComment}
      onChangeChecklistItem={onChangeChecklistItem}
    />
  );
};

export { ViewCardPage };
