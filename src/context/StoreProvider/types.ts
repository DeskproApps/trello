import { Reducer } from "react";
import { Context } from "@deskpro/app-sdk";

export type ErrorType = Error | string | unknown;

export type Page =
    | "home"
    | "log_in";

export type PageParams = {
    //...
};

export interface State {
    isAuth: boolean,
    page?: Page;
    pageParams?: PageParams,
    context?: Context,
    _error?: ErrorType,
}

export type Action =
    | { type: "changePage", page: Page, params?: PageParams }
    | { type: "loadContext", context: Context }
    | { type: "error", error: ErrorType }
    | { type: "setAuth", isAuth: boolean };

export type Dispatch = (action: Action) => void;

export type StoreReducer = Reducer<State, Action>;
