import size from "lodash/size";
import toLower from "lodash/toLower";
import { DESKPRO_LABEL } from "../constants";
import type { Label } from "../services/trello/types";
import type { Maybe } from "../types";

const findDeskproLabel = (labels: Maybe<Label[]>): Label|void => {
    if (Array.isArray(labels) && size(labels)) {
      return labels.find(({ name }) => {
        return toLower(name) === toLower(DESKPRO_LABEL.name);
      });
    }
};

export { findDeskproLabel };
