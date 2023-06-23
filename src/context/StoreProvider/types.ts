import { Reducer } from "react";
import {
    Context,
    HasOAuth2Token,
    OAuth2CallbackUrlPoll,
} from "@deskpro/app-sdk";
import { CardType, Board, List, Label, Member } from "../../services/trello/types";

export type ErrorType = Error | string | unknown;

// export type Page =
//     | "home"
//     | "log_in"
//     | "link_card"
//     | "view_card"
//     | "edit_card"
//     | "create_card"
//     | "add_comment"
//     | "admin/callback"
// ;

export type PageParams = {
    activeTab?: "find" | "create",
    cardId?: CardType["id"],
};

export interface State {
    isAuth: boolean,
    // page?: Page;
    // pageParams?: PageParams,
    context?: Context,
    cards: CardType[],
    _error?: ErrorType,
}

export type Action =
    // | { type: "changePage", page: Page, params?: PageParams }
    | { type: "loadContext", context: Context }
    | { type: "error", error: ErrorType }
    | { type: "setAuth", isAuth: boolean }
    | { type: "linkedTrelloCards", cards: CardType[] };

export type Dispatch = (action: Action) => void;

export type StoreReducer = Reducer<State, Action>;

// export type AppElementPayload =
//     | { type: "logout" }
//     // | { type: "changePage", page: Page, params?: PageParams }
//     | { type: "unlinkTicket", cardId: CardType["id"], ticketId: string };

export interface ReplyBoxNoteSelection {
    id: string;
    selected: boolean;
}

export type OAuthCallback = undefined | {
    callbackUrl: string,
    poll: OAuth2CallbackUrlPoll,
    hasToken?: HasOAuth2Token,
};

export type EntityMetadata = {
    cardId: CardType["id"],
    boardId: Board["id"],
    boardName: Board["name"],
    listId: List["id"],
    listName: List["name"],
    description: CardType["desc"],
    labels: Array<{ id: Label["id"], name: Label["name"] }>,
    members: Array<{ id: Member["id"], name: Member["fullName"] }>,
    dueDate: CardType["due"],
};
