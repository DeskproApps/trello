import { DateTime } from "../../services/trello/types";

const parseDateTime = (date?: Date): DateTime => {
    if (!date) {
        return (new Date()).toISOString();
    }

    return date.toISOString();
};

export { parseDateTime };
