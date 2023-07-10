import { useCallback } from "react";
import isEmpty from "lodash/isEmpty";
import { useNavigate, useParams } from "react-router-dom";
import {
    useDeskproElements,
    useDeskproAppClient,
} from "@deskpro/app-sdk";
import { useSetTitle, useAsyncError } from "../../hooks";
import {
    createAttachService,
    createCardCommentService,
} from "../../services/trello";
import { AddComment } from "../../components";
import type { FC } from "react";
import type { Values } from "../../components/AddComment";

const AddCommentPage: FC = () => {
    const navigate = useNavigate();
    const { cardId } = useParams();
    const { client } = useDeskproAppClient();
    const { asyncErrorHandler } = useAsyncError();

    const onCancel = useCallback(() => {
        navigate(`/view_card/${cardId}`)
    }, [navigate, cardId]);

    const  onSubmit = useCallback((values: Values) => {
        if (!client || !cardId) {
            return
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const promises: Promise<any>[] = [];

        if (!isEmpty(values.comment)) {
            promises.push(createCardCommentService(client, cardId, values.comment));
        }

        if (Array.isArray(values.files) && values.files.length) {
            promises.concat(values.files.map(({ file }) => {
                const form = new FormData();
                form.append("file", file);
                return createAttachService(client, cardId, form);
            }))
        }

        return Promise.all(promises)
            .then(() => navigate(`/view_card/${cardId}`))
            .catch(asyncErrorHandler);
    }, [client, cardId, asyncErrorHandler, navigate]);

    useSetTitle("Add Comment");

    useDeskproElements(({ clearElements, registerElement }) => {
        clearElements();
        registerElement("trelloRefreshButton", { type: "refresh_button" });
        registerElement("trelloHomeButton", {
            type: "home_button",
            payload: { type: "changePage", path: "/home" }
        });
    });

    return (
        <AddComment onSubmit={onSubmit} onCancel={onCancel} />
    );
};

export { AddCommentPage };
