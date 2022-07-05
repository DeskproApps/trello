import { DateTime } from "../../services/trello/types";

const parseDateTime = (date?: any): DateTime => {
    if (date instanceof Date) {
        return date.toISOString();
    }

    return date;
};

export { parseDateTime };
