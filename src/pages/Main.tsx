import { useEffect } from "react";
import { match } from "ts-pattern";
import {
    Context,
    useDeskproAppClient,
    useDeskproAppEvents,
} from "@deskpro/app-sdk";
import { useStore } from "../context/StoreProvider/hooks";
import { AppElementPayload } from "../context/StoreProvider/types";
import { deleteEntityCardService } from "../services/entityAssociation";
import { createCardCommentService } from "../services/trello";
import { useSetBadgeCount } from "../hooks";
import { HomePage } from "./Home";
import { LogInPage } from "./LogIn";
import { LinkCardPage } from "./LinkCard";
import { ViewCardPage } from "./ViewCard";
import { EditCardPage } from "./EditCard";
import { ErrorBlock } from "../components/common";

export const Main = () => {
    const [state, dispatch] = useStore();
    const { client } = useDeskproAppClient();

    if (state._error) {
        console.error(`Trello: ${state._error}`);
    }

    useSetBadgeCount();

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
                dispatch({ type: "changePage", page: payload.page, params: payload.params })
            } else if (payload?.type === "unlinkTicket") {
                if (client) {
                    deleteEntityCardService(client, payload.ticketId, payload.cardId)
                        .then(() => createCardCommentService(
                            client,
                            payload.cardId,
                            `Unlinked from Deskpro ticket ${payload.ticketId}, ${state.context?.data?.ticket?.permalinkUrl}`
                        ))
                        .then(() => {
                            dispatch({ type: "changePage", page: "home" });
                        })
                }
            }
        },
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
            .otherwise(() => <LogInPage />);

    return (
        <>
            {state._error && (<ErrorBlock text="An error occurred" />)}
            {page}
        </>
    );
};
