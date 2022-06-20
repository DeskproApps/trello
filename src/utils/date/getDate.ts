import { DateTime } from "../../services/trello/types";

const getDate = (date?: DateTime): string => {
    if (!date) {
        return "-";
    }

    return (new Date(date)).toLocaleDateString()
};

export { getDate };
