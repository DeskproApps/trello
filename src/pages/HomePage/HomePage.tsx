import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    LoadingSpinner,
    useDeskproElements,
} from "@deskpro/app-sdk";
import { useSetTitle, useSetBadgeCount, useLinkedCards } from "../../hooks";
import { useHomeDeps } from "./hooks";
import { getFilteredCards } from "../../utils";

import { Home } from "../../components";
import type { FC, ChangeEvent } from "react";
import type { CardType } from "../../services/trello/types";

const HomePage: FC = () => {
    const navigate = useNavigate();
    const [searchCard, setSearchCard] = useState<string>("");
    const { cards, isLoading } = useLinkedCards();
    const { organizations } = useHomeDeps()

    const onChangeSearchCard = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setSearchCard(e.target.value);
    }, []);

    const onClearSearchCard = useCallback(() => {
        setSearchCard("");
    }, []);

    useSetTitle("Trello Cards");

    useSetBadgeCount(cards);

    useDeskproElements(({ clearElements, registerElement }) => {
        clearElements();
        registerElement("trelloRefreshButton", { type: "refresh_button" });
        registerElement("trelloPlusButton", {
            type: "plus_button",
            payload: { type: "changePage", path: "/link_card" },
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

    const onNavigateToViewCard = useCallback((cardId: CardType["id"]) => {
        navigate(`/view_card/${cardId}`);
    }, [navigate]);

    if (isLoading) {
        return (
            <LoadingSpinner/>
        );
    }

    return (
        <Home
            searchCard={searchCard}
            organizations={organizations}
            onChangeSearchCard={onChangeSearchCard}
            onClearSearchCard={onClearSearchCard}
            onNavigateToViewCard={onNavigateToViewCard}
            cards={getFilteredCards(cards, { query: searchCard })}
        />
    )
};

export { HomePage };
