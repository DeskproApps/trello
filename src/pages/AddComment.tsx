import { FC } from "react";
import isEmpty from "lodash/isEmpty";
import * as yup from "yup";
import { useFormik } from "formik";
import {
    Stack,
    useDeskproElements,
    useDeskproAppClient,
} from "@deskpro/app-sdk";
import { useStore } from "../context/StoreProvider/hooks";
import { useSetAppTitle } from "../hooks";
import {
    createAttachService,
    createCardCommentService,
} from "../services/trello";
import { Button, Label, TextArea, Attach, Container } from "../components/common";

const validationSchema = yup.object().shape({
    comment: yup.string(),
});

const initValues = {
    comment: "",
    files: [],
};

const AddCommentPage: FC = () => {
    const [state, dispatch] = useStore();
    const { client } = useDeskproAppClient();
    const cardId = state.pageParams?.cardId;
    const {
        handleSubmit,
        isSubmitting,
        setFieldValue,
        getFieldProps,
    } = useFormik({
        validationSchema,
        initialValues: initValues,
        onSubmit: async (values) => {
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

            await Promise.all(promises)
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

    useDeskproElements(({ clearElements, registerElement }) => {
        clearElements();
        registerElement("trelloRefreshButton", { type: "refresh_button" });
        registerElement("trelloHomeButton", {
            type: "home_button",
            payload: { type: "changePage", page: "home" }
        });
    });

    return (
        <Container>
            <form onSubmit={handleSubmit}>
                <Label htmlFor="comment" label="New comment" marginBottom={17}>
                    <TextArea
                        minWidth="auto"
                        placeholder="Enter comment"
                        {...getFieldProps("comment")}
                    />
                </Label>

                <Label label="Attachments">
                    <Attach
                        onFiles={(files) => {
                            setFieldValue("files", files);
                        }}
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
        </Container>
    );
};

export { AddCommentPage };
