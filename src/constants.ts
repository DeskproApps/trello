import type { LabelColor } from "./services/trello/types";

/** Common */
export const UNKNOWN_ERROR = "An error occurred";

/** Deskpro */
export const APP_PREFIX = "trello";

export const TRELLO_ENTITY = 'linkedTrelloCards';

export const DESKPRO_LABEL: { name: string, color: LabelColor } = {
    name: "Deskpro",
    color: "blue",
};

/** Trello */
export const placeholders = {
    KEY: "__api_key__",
    OAUTH_TOKEN_PATH: "oauth2/token",
    TOKEN: `[user[oauth2/token]]`,
};

export const BASE_URL = "https://api.trello.com/1";
