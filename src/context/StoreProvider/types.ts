import { Reducer } from "react";
import { Context } from "@deskpro/app-sdk";

export type ErrorType = Error | string | unknown;

export type Page =
    | "home"
    | "log_in"
    | "link_card";

export type PageParams = {
    activeTab?: "find" | "create",
};

export interface State {
    isAuth: boolean,
    page?: Page;
    pageParams?: PageParams,
    context?: Context,
    cards?: any[],
    _error?: ErrorType,
}

export type Action =
    | { type: "changePage", page: Page, params?: PageParams }
    | { type: "loadContext", context: Context }
    | { type: "error", error: ErrorType }
    | { type: "setAuth", isAuth: boolean }
    | { type: "linkedTrelloCards", cards: any[] };

export type Dispatch = (action: Action) => void;

export type StoreReducer = Reducer<State, Action>;

export type AppElementPayload = {
    type: "changePage",
    page: Page,
    params?: PageParams,
};
