import { useMemo, useCallback, useContext, createContext } from "react";
import get from "lodash/get";
import size from "lodash/size";
import map from "lodash/map";
import has from "lodash/has";
import toLower from "lodash/toLower";
import truncate from "lodash/truncate";
import capitalize from "lodash/capitalize";
import { match } from "ts-pattern";
import { useDebouncedCallback } from "use-debounce";
import {
    useDeskproAppClient,
    useDeskproAppEvents,
    useDeskproLatestAppContext,
    useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useLinkedCards } from "./useLinkedCards";
import { getEntityListService } from "../services/deskpro";
import { createCardCommentService } from "../services/trello";
import { APP_PREFIX } from "../constants";
import type { FC, PropsWithChildren } from "react";
import type { IDeskproClient, GetStateResponse, TargetAction } from "@deskpro/app-sdk";
import type { CardType } from "../services/trello/types";
import type { TicketContext, TicketData } from "../types";

export type ReplyBoxType = "note" | "email";

export type SetSelectionState = (cardId: CardType["id"], selected: boolean, type: ReplyBoxType) => void|Promise<{ isSuccess: boolean }|void>;

export type GetSelectionState = (cardId: CardType["id"], type: ReplyBoxType) => void|Promise<Array<GetStateResponse<string>>>;

export type DeleteSelectionState = (cardId: CardType["id"], type: ReplyBoxType) => void|Promise<boolean|void>;

type ReturnUseReplyBox = {
    setSelectionState: SetSelectionState,
    getSelectionState: GetSelectionState,
    deleteSelectionState: DeleteSelectionState,
};

const getKey = (type: ReplyBoxType) => (ticketId: string, cardId: CardType["id"]|"*") => {
    return toLower(`tickets/${ticketId}/${APP_PREFIX}/${type}/selection/${cardId}`);
};

const noteKey = getKey("note");

const emailKey = getKey("email");

const registerReplyBoxAdditionsTargetAction = (type: ReplyBoxType) => (
    client: IDeskproClient,
    ticketId: TicketData["ticket"]["id"],
    cardIds: Array<CardType["id"]>,
    cardsMap: Record<CardType["id"], CardType>,
): void|Promise<void> => {
    if (!ticketId) {
        return;
    }

    if (Array.isArray(cardIds) && !size(cardIds)) {
        return client.deregisterTargetAction(`${APP_PREFIX}ReplyBox${capitalize(type)}Additions`);
    }

    return Promise
        .all(
            cardIds.map((cardId: CardType["id"]) => client.getState<{ selected: boolean }>(getKey(type)(ticketId, cardId)))
        ).then((flags) => {
            client.registerTargetAction(`${APP_PREFIX}ReplyBox${capitalize(type)}Additions`, `reply_box_${type}_item_selection`, {
                title: "Add to Trello",
                payload: cardIds.map((cardId, idx) => ({
                    id: cardId,
                    title: has(cardsMap, [cardId, "name"]) ? truncate(cardsMap[cardId].name, { length: 20 }) : cardId,
                    selected: flags[idx][0]?.data?.selected ?? false,
                })),
            });
        });
};

const registerReplyBoxNotesAdditionsTargetAction = registerReplyBoxAdditionsTargetAction("note");

const registerReplyBoxEmailsAdditionsTargetAction = registerReplyBoxAdditionsTargetAction("email");

const ReplyBoxContext = createContext<ReturnUseReplyBox>({
    setSelectionState: () => {},
    getSelectionState: () => {},
    deleteSelectionState: () => {},
});

const useReplyBox = () => useContext<ReturnUseReplyBox>(ReplyBoxContext);

const ReplyBoxProvider: FC<PropsWithChildren> = ({ children }) => {
    const { context } = useDeskproLatestAppContext() as { context: TicketContext };
    const { client } = useDeskproAppClient();
    const { cards } = useLinkedCards();
    const cardsMap = useMemo(() => {
        return (Array.isArray(cards) ? cards : []).reduce<Record<CardType["id"], CardType>>((acc, card) => {
            acc[card.id] = card;
            return acc;
        }, {});
    }, [cards]);

    const ticketId = useMemo(() => get(context, ["data", "ticket", "id"]), [context]);
    const isCommentOnNote = useMemo(() => get(context, ["settings", "default_comment_on_ticket_note"]), [context]);
    const isCommentOnEmail = useMemo(() => get(context, ["settings", "default_comment_on_ticket_reply"]), [context]);

    const setSelectionState: SetSelectionState = useCallback((cardId, selected, type) => {
        if (!ticketId || !client) {
            return
        }

        if (type === "note" && isCommentOnNote) {
            return client.setState(noteKey(ticketId, cardId), { id: cardId, selected })
                .then(() => getEntityListService(client, ticketId))
                .then((cardIds) => registerReplyBoxNotesAdditionsTargetAction(client, ticketId, cardIds, cardsMap))
                .catch(() => {})
        }

        if (type === "email" && isCommentOnEmail) {
            return client?.setState(emailKey(ticketId, cardId), { id: cardId, selected })
                .then(() => getEntityListService(client, ticketId))
                .then((taskIds) => registerReplyBoxEmailsAdditionsTargetAction(client, ticketId, taskIds, cardsMap))
                .catch(() => {})
        }
    }, [client, ticketId, isCommentOnNote, isCommentOnEmail, cardsMap]);

    const getSelectionState: GetSelectionState = useCallback((cardId, type) => {
        if (!ticketId) {
            return
        }

        return client?.getState<string>(getKey(type)(ticketId, cardId))
    }, [client, ticketId]);

    const deleteSelectionState: DeleteSelectionState = useCallback((cardId, type) => {
        if (!ticketId || !client) {
            return;
        }

        return client.deleteState(getKey(type)(ticketId, cardId))
            .then(() => getEntityListService(client, ticketId))
            .then((cardIds) => registerReplyBoxAdditionsTargetAction(type)(client, ticketId, cardIds, cardsMap))
    }, [client, ticketId, cardsMap]);

    useInitialisedDeskproAppClient((client) => {
        if (isCommentOnNote) {
            registerReplyBoxNotesAdditionsTargetAction(client, ticketId, map(cards, "id"), cardsMap);
            client.registerTargetAction(`${APP_PREFIX}OnReplyBoxNote`, "on_reply_box_note");
        }

        if (isCommentOnEmail) {
            registerReplyBoxEmailsAdditionsTargetAction(client, ticketId, map(cards, "id"), cardsMap);
            client.registerTargetAction(`${APP_PREFIX}OnReplyBoxEmail`, "on_reply_box_email");
        }
    }, [cards, ticketId, isCommentOnNote, isCommentOnEmail, cardsMap]);

    const debounceTargetAction = useDebouncedCallback<(a: TargetAction) => void>((action: TargetAction) => match<string>(action.name)
            .with(`${APP_PREFIX}OnReplyBoxEmail`, () => {
                const subjectTicketId = action.subject;
                const email = action.payload.email;

                if (!ticketId || !email || !client) {
                    return;
                }

                if (subjectTicketId !== ticketId) {
                    return;
                }

                client.setBlocking(true);
                client.getState<{ id: string; selected: boolean }>(emailKey(ticketId, "*"))
                    .then((selections) => {
                        const cardIds = selections
                            .filter(({ data }) => data?.selected)
                            .map(({ data }) => data?.id as CardType["id"]);

                        return Promise.all(cardIds.map((cardId) => createCardCommentService(client, cardId, email)))
                    })
                    .finally(() => client.setBlocking(false));
            })
            .with(`${APP_PREFIX}OnReplyBoxNote`, () => {
                const subjectTicketId = action.subject;
                const note = action.payload.note;

                if (!ticketId || !note || !client) {
                    return;
                }

                if (subjectTicketId !== ticketId) {
                    return;
                }

                client.setBlocking(true);
                client.getState<{ id: string; selected: boolean }>(noteKey(ticketId, "*"))
                    .then((selections) => {
                        const cardIds = selections
                            .filter(({ data }) => data?.selected)
                            .map(({ data }) => data?.id as CardType["id"]);

                        return Promise.all(cardIds.map((cardId) => createCardCommentService(client, cardId, note)));
                    })
                    .finally(() => client.setBlocking(false));
            })
            .with(`${APP_PREFIX}ReplyBoxEmailAdditions`, () => {
                (action.payload ?? []).forEach((selection: { id: string; selected: boolean; }) => {
                    const subjectTicketId = action.subject;

                    if (ticketId) {
                        client?.setState(
                            emailKey(subjectTicketId, selection.id),
                            { id: selection.id, selected: selection.selected },
                        )
                            .then((result) => {
                                if (result.isSuccess) {
                                    registerReplyBoxEmailsAdditionsTargetAction(client, ticketId, map(cards, "id"), cardsMap);
                                }
                            });
                    }
                })
            })
            .with(`${APP_PREFIX}ReplyBoxNoteAdditions`, () => {
                (action.payload ?? []).forEach((selection: { id: string; selected: boolean; }) => {
                    const subjectTicketId = action.subject;

                    if (ticketId) {
                        client?.setState(
                            noteKey(subjectTicketId, selection.id),
                            { id: selection.id, selected: selection.selected },
                        )
                            .then((result) => {
                                if (result.isSuccess) {
                                    registerReplyBoxNotesAdditionsTargetAction(client, subjectTicketId, map(cards, "id"), cardsMap);
                                }
                            });
                    }
                })
            })
            .run(),
        200
    );

    useDeskproAppEvents({
        onTargetAction: debounceTargetAction,
    }, [context?.data]);

    return (
        <ReplyBoxContext.Provider value={{
            setSelectionState,
            getSelectionState,
            deleteSelectionState,
        }}>
            {children}
        </ReplyBoxContext.Provider>
    );
};

export { useReplyBox, ReplyBoxProvider };
