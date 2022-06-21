import { useEffect } from "react";
import { useDeskproAppClient } from "@deskpro/app-sdk";
import { useStore } from "../context/StoreProvider/hooks";

const useSetBadgeCount = () => {
    const { client } = useDeskproAppClient();
    const [state] = useStore();

    useEffect(() => {
        if (!Array.isArray(state.cards)) {
            return;
        }

        client?.setBadgeCount(state.cards.length);
    }, [client, state.cards]);
};

export { useSetBadgeCount };
