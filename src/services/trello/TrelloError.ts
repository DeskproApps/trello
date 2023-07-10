import type { TrelloAPIError } from "./types";

export type InitData = {
    status: number,
    data: TrelloAPIError,
};

class TrelloError extends Error {
    status: number;
    data: TrelloAPIError;

    constructor({ status, data }: InitData) {
        const message = "Trello Api Error";
        super(message);

        this.data = data;
        this.status = status;
    }
}

export { TrelloError };
