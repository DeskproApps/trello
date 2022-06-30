import { FC, useEffect } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import {
    Stack,
    useDeskproAppClient,
} from "@deskpro/app-sdk";
import { useStore } from "../context/StoreProvider/hooks";
import { useSetAppTitle } from "../hooks";
import { createCardCommentService } from "../services/trello";
import { Button, Label, TextArea } from "../components/common";

const validationSchema = yup.object().shape({
    comment: yup.string(),
});

const initValues = {
    comment: "",
};

const AddCommentPage: FC = () => {
    const [state, dispatch] = useStore();
    const { client } = useDeskproAppClient();
    const cardId = state.pageParams?.cardId;
    const {
        handleSubmit,
        isSubmitting,
        getFieldProps,
    } = useFormik({
        validationSchema,
        initialValues: initValues,
        onSubmit: async (values) => {
            if (!client || !cardId) {
                return
            }

            await createCardCommentService(client, cardId, values.comment)
                .then(() => {
                    dispatch({
                        type: "changePage",
                        page: "view_card",
                        params: { cardId },
                    })
                })
                .catch((error) => {
                    dispatch({ type: "error", error })
                });
        },
    });

    useSetAppTitle("Add Comment");

    useEffect(() => {
        if (!client) {
            return;
        }

        client?.deregisterElement("trelloPlusButton");
        client?.deregisterElement("trelloHomeButton");
        client?.deregisterElement("trelloExternalCtaLink");
        client?.deregisterElement("trelloMenu");
        client?.deregisterElement("trelloEditButton");

        client?.registerElement("trelloHomeButton", {
            type: "home_button",
            payload: { type: "changePage", page: "home" }
        });
    }, [client]);

    return (
        <form onSubmit={handleSubmit}>
            <Label htmlFor="comment" label="New comment" marginBottom={17}>
                <TextArea
                    minWidth="auto"
                    placeholder="Enter comment"
                    {...getFieldProps("comment")}
                />
            </Label>

            <Stack justify="space-between">
                <Button
                    type="submit"
                    text="Save"
                    disabled={isSubmitting}
                    loading={isSubmitting}
                />
                <Button
                    text="Cancel"
                    intent="tertiary"
                    onClick={() => dispatch({
                        type: "changePage",
                        page: "view_card",
                        params: { cardId },
                    })}
                />
            </Stack>
        </form>
    );
};

export { AddCommentPage };
