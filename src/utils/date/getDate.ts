import { DateTime } from "../../types";

const getDate = (date?: DateTime): string => {
    if (!date) {
        return "-";
    }

    // @todo: to formatting via date-fns
    return (new Date(date)).toLocaleDateString()
};

export { getDate };
