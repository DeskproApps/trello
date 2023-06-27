import type { To, ParamKeyValuePair } from "react-router-dom";
import type {
    Context,
    IDeskproClient,
    DropdownValueType,
} from "@deskpro/app-sdk";
import type { CardType } from "./services/trello/types";

/** Common types */
export type Maybe<T> = T | undefined | null;

export type Dict<T> = Record<string, T>;

export type Option<Value = unknown> = Omit<DropdownValueType<Value>, "subItems">;

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

export type Request = <T = void>(
    client: IDeskproClient,
    params: RequestParams,
) => Promise<T>;

/** Deskpro types */
export type Settings = {
    api_key?: string,
    add_comment_when_linking?: boolean,
    default_comment_on_ticket_reply?: boolean,
    default_comment_on_ticket_note?: boolean,
    add_deskpro_label?: boolean,
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
    | { type: "unlink", card: CardType }
;
