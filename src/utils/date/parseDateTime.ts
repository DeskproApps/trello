import { DateTime } from "../../services/trello/types";

// eslint-disable-next-line
const parseDateTime = (date?: any): DateTime => {
    if (date instanceof Date) {
        return date.toISOString();
    }

    return date;
};

export { parseDateTime };
