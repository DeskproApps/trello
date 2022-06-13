import { useEffect } from "react";
import { match } from "ts-pattern";
import {
    Context,
    useDeskproAppClient,
    useDeskproAppEvents,
} from "@deskpro/app-sdk";
import { useStore } from "../context/StoreProvider/hooks";
import { Home } from "./Home";
import { LogIn } from "./LogIn";
import { ErrorBlock } from "../components/common";

export const Main = () => {
    const [state, dispatch] = useStore();
    const { client } = useDeskproAppClient();

    if (state._error) {
        console.error(`Trello: ${state._error}`);
    }

    useDeskproAppEvents({
        onChange: (context: Context) => {
            context && dispatch({ type: "loadContext", context });
        },
    });

    useEffect(() => {
        if (!client) {
            return;
        }

        client?.deregisterElement("trelloRefreshButton");

        client?.registerElement("trelloRefreshButton", {
            type: "refresh_button"
        });
    }, [client]);

    useEffect(() => {
        dispatch({ type: "changePage", page: !state.isAuth ? "log_in" : "home" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.isAuth]);

    const page = !state.isAuth
        ? <LogIn />
        : match(state.page)
            .with("home", () => <Home />)
            .with("log_in", () => <LogIn />)
            .otherwise(() => <LogIn />);

    return (
        <>
            {state._error && (<ErrorBlock text="An error occurred" />)}
            {page}
        </>
    );
};
