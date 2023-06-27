import { FC, useState, useCallback } from "react";
import get from "lodash/get";
import { useNavigate } from "react-router-dom";
import {
    useDeskproElements,
    useDeskproAppClient,
    useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import {
  useSetTitle,
  useReplyBox,
  useDeskproLabel,
  useLinkedAutoComment,
} from "../../hooks";
import { getEntityMetadata, getFilteredCards } from "../../utils";
import { useStore } from "../../context/StoreProvider/hooks";
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, dispatch] = useStore();
    const { addLinkComment } = useLinkedAutoComment();
    const { addDeskproLabel } = useDeskproLabel();
    const { setSelectionState } = useReplyBox();
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

        Promise.all([
            ...selectedCards.map((cardId) => setEntityCardService(
                    client,
                    ticketId,
                    cardId,
                    getEntityMetadata(cards.find(({ id }: CardType) => id === cardId)),
                )
            ),
            ...selectedCards.map((cardId) => addLinkComment(cardId)),
            ...selectedCards.map((cardId) => setSelectionState(cardId, true, "note")),
            ...selectedCards.map((cardId) => setSelectionState(cardId, true, "email")),
            ...selectedCards.map((cardId) => {
                const card = cards.find(({ id }: CardType) => id === cardId);
                return card ? addDeskproLabel(card) : Promise.resolve();
            }),
        ])
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
