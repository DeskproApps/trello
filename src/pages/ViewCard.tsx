import { FC, useEffect } from "react";
import { useDeskproAppClient } from "@deskpro/app-sdk";
import { useStore } from "../context/StoreProvider/hooks";

const ViewCard: FC = () => {
    const [state, dispatch] = useStore();
    const { client } = useDeskproAppClient();

    useEffect(() => {
        if (!client) {
            return;
        }

    }, [client]);

    return (
        <>
            ViewCard
        </>
    );
};

export { ViewCard };
