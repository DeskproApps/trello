import { FC, useState, useCallback } from "react";
import get from "lodash/get";
import { useNavigate } from "react-router-dom";
import {
    useDeskproElements,
    useDeskproAppClient,
    useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { useSetTitle } from "../../hooks";
import { getEntityMetadata, getFilteredCards } from "../../utils";
import { useStore } from "../../context/StoreProvider/hooks";
import { createCardCommentService } from "../../services/trello";
import { setEntityCardService } from "../../services/deskpro";
import { getOption } from "../../utils";
import { useSearch } from "./hooks";
import { LinkCard } from "../../components";
import type { Option, TicketContext } from "../../types";
import type { Board, CardType } from "../../services/trello/types";

const LinkCardPage: FC = () => {
    const navigate = useNavigate();
    const { context } = useDeskproLatestAppContext() as { context: TicketContext };
    const { client } = useDeskproAppClient();
    const [state, dispatch] = useStore();
    const [selectedCards, setSelectedCards] = useState<Array<CardType["id"]>>([]);
    const [selectedBoard, setSelectedBoard] = useState<Option<"any"|Board["id"]>>(getOption("any", "Any"));
    const {
        cards,
        loading,
        searchCard,
        boardOptions,
        onClearSearch,
        onChangeSearch,
    } = useSearch();

    const ticketId = get(context, ["data", "ticket", "id"]);

    const onChangeSelectedCard = (cardId: CardType["id"]) => {
        let newSelectedCards = [...selectedCards];
        if (selectedCards.includes(cardId)) {
            newSelectedCards = selectedCards.filter((selectedCardId) => selectedCardId !== cardId);
        } else {
            newSelectedCards.push(cardId);
        }
        setSelectedCards(newSelectedCards);
    };

    const onSelectBoard = (option: Option<CardType["id"]>) => {
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

    const onNavigateToCreateCard = useCallback(() => navigate("/create_card"), [navigate]);

    const onNavigateToHome = useCallback(() => navigate("/home"), [navigate]);

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
        <LinkCard
            loading={loading}
            searchCard={searchCard}
            onClearSearch={onClearSearch}
            onChangeSearch={onChangeSearch}
            onNavigateToCreateCard={onNavigateToCreateCard}
            cards={getFilteredCards(cards, { boardId: selectedBoard?.value })}
            selectedBoard={selectedBoard}
            onSelectBoard={onSelectBoard}
            boardOptions={boardOptions}
            selectedCards={selectedCards}
            onLinkCard={onLinkCard}
            onNavigateToHome={onNavigateToHome}
            onChangeSelectedCard={onChangeSelectedCard}
        />
    );
};

export { LinkCardPage };
