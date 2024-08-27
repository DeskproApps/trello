import { match } from "ts-pattern";
import get from "lodash/get";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import {
    LoadingSpinner,
    useDeskproAppClient,
    useDeskproAppEvents,
} from "@deskpro/app-sdk";
import { useLogout, useUnlinkCard } from "./hooks";
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
import type { EventPayload } from "./types";

const App = () => {
    const navigate = useNavigate();
    const { logout, isLoading: isLoadingLogout } = useLogout();
    const { unlink, isLoading: isLoadingUnlink } = useUnlinkCard();
    const { client } = useDeskproAppClient();
    const isLoading = [isLoadingLogout, isLoadingUnlink].some((isLoading) => isLoading);

    const debounceElementEvent = useDebouncedCallback((_, __, payload: EventPayload) => {
        match(payload.type)
            .with("changePage", () => {
                if (isNavigatePayload(payload)) {
                    navigate(payload.path);
                }
            })
            .with("logout", logout)
            .with("unlink", () => unlink(get(payload, ["card"])))
            .run();
    }, 500);

    useDeskproAppEvents({
        onShow: () => client && setTimeout(() => client.resize(), 200),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        onElementEvent: debounceElementEvent,
    }, [client]);

    if (isLoading) {
        return (
            <LoadingSpinner />
        );
    }

    return (
        <Routes>
            <Route path="/home" element={<HomePage />} />
            <Route path="/log_in" element={<LogInPage />} />
            <Route path="/link_card" element={<LinkCardPage />} />
            <Route path="/create_card" element={<CreateCardPage />} />
            <Route path="/view_card/:cardId" element={<ViewCardPage />} />
            <Route path="/edit_card/:cardId" element={<EditCardPage />} />
            <Route path="/add_comment/:cardId" element={<AddCommentPage />} />
            <Route path="/admin/callback" element={<AdminCallbackPage />} />
            <Route index element={<LoadingAppPage />} />
        </Routes>
    );
};

export { App };
