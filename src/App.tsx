import { Suspense } from "react";
import { match } from "ts-pattern";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import {
    Context,
    TargetAction,
    LoadingSpinner,
    useDeskproAppClient,
    useDeskproAppEvents,
} from "@deskpro/app-sdk";
import { useStore } from "./context/StoreProvider/hooks";
import { ReplyBoxNoteSelection } from "./context/StoreProvider/types";
import { deleteEntityCardService } from "./services/deskpro";
import { createCardCommentService, logoutService } from "./services/trello";
import { useSetBadgeCount } from "./hooks";
import { isNavigatePayload } from "./utils";
import {
    AddCommentPage,
    AdminCallbackPage,
    CreateCardPage,
    EditCardPage,
    HomePage,
    LinkCardPage,
    LoadingAppPage,
    LogInPage,
    ViewCardPage,
} from "./pages";
import { ErrorBlock } from "./components/common";
import type { EventPayload } from "./types";

const App = () => {
    console.log(">>> app:");
    const navigate = useNavigate();
    const [state, dispatch] = useStore();
    const { client } = useDeskproAppClient();

    if (state._error) {
        console.error(`Trello: ${state._error}`);
    }

    useSetBadgeCount();

    const debounceTargetAction = useDebouncedCallback<(a: TargetAction<ReplyBoxNoteSelection[]>) => void>(
        (action: TargetAction) => {
            match<string>(action.name)
                .with("linkTicket", () => navigate("/link_card"))
                .run()
            ;
        },
        500,
    );

    useDeskproAppEvents({
        onChange: (context: Context) => {
            context && dispatch({ type: "loadContext", context });
        },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        onElementEvent(id: string, type: string, payload?: EventPayload) {
            if (payload?.type === "changePage" && isNavigatePayload(payload)) {
                console.log(">>> changePage", payload);
                navigate(payload.path);
            } else if (payload?.type === "logout") {
                if (client) {
                    logoutService(client)
                        .then(() => {
                            dispatch({ type: "setAuth", isAuth: false });
                            navigate("/log_in");
                        })
                        .catch((error) => dispatch({ type: "error", error }));
                }
            } else if (payload?.type === "unlinkTicket") {
                if (client) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    deleteEntityCardService(client, payload?.ticketId, payload.cardId)
                        .then(() => createCardCommentService(
                            client,
                            payload.cardId,
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            `Unlinked from Deskpro ticket ${payload?.ticketId}${state.context?.data?.ticket?.permalinkUrl
                                ? `, ${state.context.data.ticket.permalinkUrl}`
                                : ""
                            }`,
                        ))
                        .then(() => {
                            navigate("/home");
                        })
                }
            }
        },
        onTargetAction: (a) => debounceTargetAction(a as TargetAction),
    }, [client]);

    return (
        <Suspense fallback={<LoadingSpinner/>}>
            <h1>APP</h1>
            {state._error && (<ErrorBlock text="An error occurred" />)}
            <Routes>
                <Route path="/home" element={<HomePage />}/>)
                <Route path="/log_in" element={<LogInPage />}/>)
                <Route path="/link_card" element={<LinkCardPage />}/>)
                <Route path="/create_card" element={<CreateCardPage/>}/>)
                <Route path="/view_card/:cardId" element={<ViewCardPage />}/>)
                <Route path="/edit_card/:cardId" element={<EditCardPage />}/>)
                <Route path="/add_comment/:cardId" element={<AddCommentPage />}/>)
                <Route path="/admin/callback" element={<AdminCallbackPage/>}/>)
                <Route index element={<LoadingAppPage/>} />
            </Routes>
        </Suspense>
    );
};

export { App };
