/** Common */
export const UNKNOWN_ERROR = "An error occurred";

/** Deskpro */
export const TRELLO_ENTITY = 'linkedTrelloCards';

/** Trello */
export const placeholders = {
    KEY: "__api_key__",
    OAUTH_TOKEN_PATH: "oauth2/token",
    TOKEN: `[user[oauth2/token]]`,
};

export const requireQeuryParams = {
    key: placeholders.KEY,
    token: placeholders.TOKEN,
};

export const BASE_URL = "https://api.trello.com/1";
