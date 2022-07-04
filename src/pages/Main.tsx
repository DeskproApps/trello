import { useEffect } from "react";
import { match } from "ts-pattern";
import { useDebouncedCallback } from "use-debounce";
import {
    Context,
    TargetAction,
    useDeskproAppClient,
    useDeskproAppEvents,
} from "@deskpro/app-sdk";
import { useStore } from "../context/StoreProvider/hooks";
import { AppElementPayload, ReplyBoxNoteSelection } from "../context/StoreProvider/types";
import { deleteEntityCardService } from "../services/entityAssociation";
import { createCardCommentService, logoutService } from "../services/trello";
import { useSetBadgeCount } from "../hooks";
import { HomePage } from "./Home";
import { LogInPage } from "./LogIn";
import { LinkCardPage } from "./LinkCard";
import { ViewCardPage } from "./ViewCard";
import { EditCardPage } from "./EditCard";
import { AddCommentPage } from "./AddComment";
import { ErrorBlock } from "../components/common";

export const Main = () => {
    const [state, dispatch] = useStore();
    const { client } = useDeskproAppClient();

    if (state._error) {
        console.error(`Trello: ${state._error}`);
    }

    useSetBadgeCount();

    const debounceTargetAction = useDebouncedCallback<(a: TargetAction<ReplyBoxNoteSelection[]>) => void>(
        (action: TargetAction) => {
            match<string>(action.name)
                .with("linkTicket", () => dispatch({ type: "changePage", page: "link_card" }))
                .run()
            ;
        },
        500,
    );

    useDeskproAppEvents({
        onShow: () => {
            client && setTimeout(() => client.resize(), 200);
        },
        onChange: (context: Context) => {
            context && dispatch({ type: "loadContext", context });
        },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        onElementEvent(id: string, type: string, payload?: AppElementPayload) {
            if (payload?.type === "changePage") {
                dispatch({type: "changePage", page: payload.page, params: payload.params})
            } else if (payload?.type === "logout") {
                if (client) {
                    logoutService(client)
                        .then(() => client.deleteUserState("oauth2/token"))
                        .then(() => dispatch({ type: "setAuth", isAuth: false }))
                        .catch((error) => dispatch({ type: "error", error }));
                }
            } else if (payload?.type === "unlinkTicket") {
                if (client) {
                    deleteEntityCardService(client, payload.ticketId, payload.cardId)
                        .then(() => createCardCommentService(
                            client,
                            payload.cardId,
                            `Unlinked from Deskpro ticket ${payload.ticketId}${state.context?.data?.ticket?.permalinkUrl
                                ? `, ${state.context.data.ticket.permalinkUrl}`
                                : ""
                            }`,
                        ))
                        .then(() => {
                            dispatch({ type: "changePage", page: "home" });
                        })
                }
            }
        },
        onTargetAction: (a) => debounceTargetAction(a as TargetAction),
    }, [client]);

    useEffect(() => {
        if (!client) {
            return;
        }

        client?.deregisterElement("trelloRefreshButton");
        client?.deregisterElement("trelloPlusButton");
        client?.deregisterElement("trelloHomeButton");
        client?.deregisterElement("trelloExternalCtaLink");
        client?.deregisterElement("trelloMenu");

        client?.registerElement("trelloRefreshButton", {
            type: "refresh_button"
        });
    }, [client]);

    useEffect(() => {
        dispatch({ type: "changePage", page: !state.isAuth ? "log_in" : "home" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.isAuth]);

    const page = !state.isAuth
        ? <LogInPage />
        : match(state.page)
            .with("home", () => <HomePage />)
            .with("log_in", () => <LogInPage />)
            .with("link_card", () => <LinkCardPage />)
            .with("view_card", () => <ViewCardPage />)
            .with("edit_card", () => <EditCardPage />)
            .with("add_comment", () => <AddCommentPage />)
            .otherwise(() => <LogInPage />);

    return (
        <>
            {state._error && (<ErrorBlock text="An error occurred" />)}
            {page}
        </>
    );
};
