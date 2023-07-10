import { DateTime } from "../../types";

// @todo: rewrite to use date-fns
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseDateTime = (date?: any): DateTime => {
    if (date instanceof Date) {
        return date.toISOString();
    }

    return date;
};

export { parseDateTime };
