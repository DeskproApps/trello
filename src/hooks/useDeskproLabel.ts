import { useCallback, useMemo } from "react";
import get from "lodash/get";
import noop from "lodash/noop";
import { useDeskproAppClient, useDeskproLatestAppContext } from "@deskpro/app-sdk";
import {
    createLabelService,
    addLabelToCardService,
    getLabelsOnBoardService,
    removeLabelFromCardService,
} from "../services/trello";
import { findDeskproLabel } from "../utils";
import { DESKPRO_LABEL } from "../constants";
import type { TicketContext } from "../types";
import type { CardType, Label } from "../services/trello/types";

type UseDeskproLabel = () => {
    addDeskproLabel: (card: CardType) => Promise<void|Array<Label["id"]>>,
    removeDeskproLabel: (card: CardType) => Promise<void>,
};

const useDeskproLabel: UseDeskproLabel = () => {
    const { client } = useDeskproAppClient();
    const { context } = useDeskproLatestAppContext() as { context: TicketContext };

    const isAddDeskproLabel = useMemo(() => {
        return get(context, ["settings", "add_deskpro_label"]) === true
    }, [context]);

    const addDeskproLabel = useCallback((card: CardType) => {
        if (!client || !isAddDeskproLabel) {
            return Promise.resolve();
        }

        if (findDeskproLabel(get(card, ["labels"]))) {
          return Promise.resolve();
        }

        return getLabelsOnBoardService(client, card.idBoard)
          .then((labels) => {
            const dpLabel = findDeskproLabel(labels);
            return dpLabel
              ? Promise.resolve(dpLabel)
              : createLabelService(client, { ...DESKPRO_LABEL, idBoard: card.idBoard });
          })
          .then((dpLabel) => addLabelToCardService(client, card.id, dpLabel.id))
          .catch(noop);
    }, [client, isAddDeskproLabel]);

    const removeDeskproLabel = useCallback((card: CardType) => {
        if (!client || !isAddDeskproLabel) {
            return Promise.resolve();
        }

        const cardId = get(card, ["id"]);
        const dpLabelId = get(findDeskproLabel(get(card, ["labels"])), ["id"]);

        return ((!cardId || !dpLabelId)
          ? Promise.resolve()
          : removeLabelFromCardService(client, cardId, dpLabelId)
        ).catch(noop);
    }, [client, isAddDeskproLabel]);

    return { addDeskproLabel, removeDeskproLabel };
};

export { useDeskproLabel };
