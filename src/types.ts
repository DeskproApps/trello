import type { To, ParamKeyValuePair } from "react-router-dom";
import type { Context, IDeskproClient } from "@deskpro/app-sdk";
import type { CardType } from "./services/trello/types";

export type Maybe<T> = T | undefined | null;

export type Dict<T> = Record<string, T>;

/**
 * An ISO-8601 encoded UTC date time string. Example value: `""2019-09-07T15:50:00Z"`.
 */
export type DateTime = string;

/** Request types */
export type ApiRequestMethod = "GET" | "POST" | "PUT" | "DELETE";

export type RequestParams = {
    url: string,
    method?: ApiRequestMethod,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any,
    headers?: Dict<string>,
    queryParams?: string|Dict<string>|ParamKeyValuePair[],
};

export type Request = <T>(
    client: IDeskproClient,
    params: RequestParams,
) => Promise<T>;

/** Deskpro types */
export type Settings = {
    //..
};

export type TicketData = {
    ticket: {
        id: string,
        subject: string,
        permalinkUrl: string,
    },
};

export type TicketContext = Context<TicketData, Maybe<Settings>>;

export type RouterPaths =
    | "/home"
    | "/log_in"
    | "/link_card"
    | "/view_card"
    | "/edit_card"
    | "/create_card"
    | "/add_comment"
    | "/admin/callback"
;

export type NavigateToChangePage = { type: "changePage", path: To };

export type EventPayload =
    | NavigateToChangePage
    | { type: "logout" }
    | { type: "unlinkTicket", cardId: CardType["id"] }
;
