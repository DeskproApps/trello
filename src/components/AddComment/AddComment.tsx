import * as yup from "yup";
// @ts-expect-error
import { useFormik } from "formik";
import { Stack } from "@deskpro/deskpro-ui";
import { Button, Label, TextArea, Attach, Container } from "../common";
import type { FC } from "react";
import type { Values } from "./types";

type Props = {
    onSubmit: (values: Values) => void;
    onCancel: () => void;
};

const validationSchema = yup.object().shape({
    comment: yup.string(),
});

const initialValues = {
    comment: "",
    files: [],
};

const AddComment: FC<Props> = ({ onSubmit, onCancel }) => {
    const {
        handleSubmit,
        isSubmitting,
        setFieldValue,
        getFieldProps,
    } = useFormik<Values>({ validationSchema, initialValues, onSubmit });

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
                        onClick={onCancel}
                    />
                </Stack>
            </form>
        </Container>
    );
};

export { AddComment };
