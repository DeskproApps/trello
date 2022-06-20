export const placeholders: Record<string, string> = {
    KEY: "__client_key__",
    TOKEN: "[user[oauth2/token]]",
};

export const requireQeuryParams: Record<string, string> = {
    key: placeholders.KEY,
    token: placeholders.TOKEN,
};

export const BASE_URL = "https://api.trello.com/1";
