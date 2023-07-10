import { useMemo } from "react";
import get from "lodash/get";
import size from "lodash/size";
import { useNavigate } from "react-router-dom";
import {
    useDeskproLatestAppContext,
    useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { getEntityListService } from "../../services/deskpro";
import { getCurrentMemberService } from "../../services/trello";
import type { TicketContext } from "../../types";

const useCheckIsAuth = () => {
    const navigate = useNavigate();
    const { context } = useDeskproLatestAppContext() as { context: TicketContext };
    const ticketId = useMemo(() => get(context, ["data", "ticket", "id"]), [context]);

    useInitialisedDeskproAppClient((client) => {
        if (!ticketId) {
            return;
        }

        getCurrentMemberService(client)
            .then(() => getEntityListService(client, ticketId))
            .then((entityIds) => navigate(size(entityIds) ? "/home" : "/link_card"))
            .catch(() => navigate("/log_in"))
    }, [ticketId]);
};

export { useCheckIsAuth };
