import { Reducer } from "react";
import { Context } from "@deskpro/app-sdk";

export type ErrorType = Error | string | unknown;

export type Page =
    | "home"
    | "log_in"
    | "link_card"
    | "view_card";

export type PageParams = {
    activeTab?: "find" | "create",
    cardId?: string,
};

export interface State {
    isAuth: boolean,
    page?: Page;
    pageParams?: PageParams,
    context?: Context,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cards: any[],
    _error?: ErrorType,
}

export type Action =
    | { type: "changePage", page: Page, params?: PageParams }
    | { type: "loadContext", context: Context }
    | { type: "error", error: ErrorType }
    | { type: "setAuth", isAuth: boolean }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | { type: "linkedTrelloCards", cards: any[] };

export type Dispatch = (action: Action) => void;

export type StoreReducer = Reducer<State, Action>;

export type AppElementPayload = {
    type: "changePage",
    page: Page,
    params?: PageParams,
};
