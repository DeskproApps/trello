import get from "lodash/get";
import size from "lodash/size";
import toLower from "lodash/toLower";
import { DESKPRO_LABEL } from "../constants";
import type { CardType, Label } from "../services/trello/types";

const findDeskproLabel = (card?: CardType): Label|void => {
    const labels = get(card, ["labels"]);

    if (Array.isArray(labels) && size(labels)) {
      return labels.find(({ name }) => {
        return toLower(name) === toLower(DESKPRO_LABEL.name);
      });
    }
};

export { findDeskproLabel };
