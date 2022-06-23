import { FC, useState, useEffect } from "react";
import styled from "styled-components";
import concat from "lodash/concat";
import isEmpty from "lodash/isEmpty";
import parseDate from "date-fns/parse";
import { useFormik } from "formik";
import * as yup from 'yup';
import {
    // faPlus,
    // faCheck,
    faCalendarDays,
    // faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
    Stack,
    // Dropdown,
    InputWithDisplay,
    TextAreaWithDisplay,
    // Label as LabelUI,
    // Button as ButtonUI,
} from "@deskpro/deskpro-ui";
import { useDeskproAppTheme, useDeskproAppClient } from "@deskpro/app-sdk";
import { useStore } from "../../../context/StoreProvider/hooks";
import {
    createCardService,
    getCurrentMemberService,
} from "../../../services/trello";
import { setEntityCardService } from "../../../services/entityAssociation";
import { Member, Board, List, Organization } from "../../../services/trello/types";
import { parseDateTime } from "../../../utils/date";
// import { Members } from "./Members";
import { Label, SingleSelect, Button, Loading } from "../../common";

type Option = {
    key: string,
    label: string,
    value: string,
    type: "value",
};

type Options = Option[];

const LabelDueDate = styled(Label)`
    width: calc(100% - 25px);
`;

const validationSchema = yup.object().shape({
    title: yup.string().required(),
    workspace: yup.object({
        key: yup.string().required(),
        label: yup.string().required(),
        value: yup.string().required(),
        type: yup.string().oneOf(["value"]).required(),
    }),
    board: yup.object({
        key: yup.string().required(),
        label: yup.string().required(),
        value: yup.string().required(),
        type: yup.string().oneOf(["value"]).required(),
    }),
    list: yup.object({
        key: yup.string().required(),
        label: yup.string().required(),
        value: yup.string().required(),
        type: yup.string().oneOf(["value"]).required(),
    }),
    description: yup.string(),
    labels: yup.array(yup.string()),
    // ToDo: update to date
    dueDate: yup.string().matches(/\d{2}\/\d{2}\/\d{4}/).length(10),
    // ToDo: check is string[] or number[]
    members: yup.array(yup.number()),
});

const resetValue = { key: "", label: "", value: "", type: "value" };

const getInitValues = () => ({
    title: "",
    workspace: { key: "", label: "", value: "", type: "value" },
    board: { key: "", label: "", value: "", type: "value" },
    list: { key: "", label: "", value: "", type: "value" },
    description: "",
    labels: "",
    dueDate: "",
    members: "",
});

const CreateCard: FC = () => {
    const { theme } = useDeskproAppTheme();
    const { client } = useDeskproAppClient();
    const [state, dispatch] = useStore();
    const ticketId = state.context?.data.ticket.id;

    const [loading, setLoading] = useState<boolean>(false);
    const [member, setMember] = useState<Member|null>(null);
    const [organizations, setOrganizations] = useState<Options>([]);
    const [boards, setBoards] = useState<Options>([]);
    const [lists, setLists] = useState<Options>([]);

    const {
        values,
        errors,
        touched,
        handleSubmit,
        getFieldProps,
        setFieldValue,
        isSubmitting,
    } = useFormik({
        initialValues: getInitValues(),
        validationSchema,
        onSubmit: async (values) => {

            if (!client || !ticketId) {
                return
            }

            const newCard = {
                name: values.title,
                desc: values.description,
                idList: values.list.value,
                due: parseDateTime(parseDate(values.dueDate, "dd/MM/yyyy", new Date())),
                // labels: "",
                // members: "",
            };

            await createCardService(client, newCard)
                .then(({ id: cardId }) => {
                    return setEntityCardService(client, ticketId, cardId);
                })
                .then(() => dispatch({ type: "changePage", page: "home" }))
                .catch((error) => dispatch({ type: "error", error }))
        }
    });

    /*const labelsOptions = [
        {
            key: "1",
            label: "Label 1",
            type: "value",
            value: "label1",
            selected:  selected.includes("label1"),
        },
        {
            key: "2",
            label: "Label 2",
            type: "value",
            value: "label2",
            selected:  selected.includes("label2"),
        },
        {
            key: "3",
            label: "Label 3",
            type: "value",
            value: "label3",
            selected:  selected.includes("label3"),
        },
    ];*/

    useEffect(() => {
        if (!client) {
            return;
        }

        setLoading(true);

        getCurrentMemberService(client)
            .then((member) => {
                (member?.error)
                    ? dispatch({ type: "error", error: member.error })
                    : setMember(member);
            })
            .finally(() => setLoading(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [client]);

    useEffect(() => {
        if (!isEmpty(member?.organizations)) {
            setOrganizations((member?.organizations as Organization[]).map(({ id, displayName }) => ({
                key: id,
                value: id,
                type: "value",
                label: displayName,
            })));
        }
    }, [member?.organizations]);

    useEffect(() => {
        if (!isEmpty(member?.boards)) {
            setBoards((member?.boards as Board[]).map(({ id, name }) => ({
                key: id,
                value: id,
                type: "value",
                label: name,
            })));

            const lists: Options = (member?.boards as Board[]).reduce((acc: Options, { lists = [] }) => {
                if (!isEmpty(lists)) {
                    return concat(acc, lists?.map(({ id, name }: List) => ({
                        key: id,
                        value: id,
                        type: "value",
                        label: name,
                    })));
                }

                return acc;
            }, []);

            setLists(lists);
        }
    }, [member?.boards]);

    useEffect(() => {
        if (values.workspace.value && !isEmpty(member?.boards)) {
            setBoards((member?.boards as Board[])
                .filter(({ idOrganization }) => (idOrganization === values.workspace.value))
                .map(({ id, name }) => ({
                    key: id,
                    value: id,
                    type: "value",
                    label: name,
                })));


            const lists: Options = (member?.boards as Board[]).reduce((acc: Options, { idOrganization, lists = [] }) => {
                if (!isEmpty(lists) && idOrganization === values.workspace.value) {
                    return concat(acc, lists?.map(({ id, name }: List) => ({
                        key: id,
                        value: id,
                        type: "value",
                        label: name,
                    })));
                }

                return acc;
            }, []);

            setLists(lists);
            setFieldValue("board", resetValue)
            setFieldValue("list", resetValue)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values.workspace]);

    if (loading) {
        return <Loading/>
    }

    return (
        <form onSubmit={handleSubmit}>
            <Label htmlFor="title" label="Title" required>
                <InputWithDisplay
                    type="text"
                    id="title"
                    {...getFieldProps("title")}
                    error={!!(touched.title && errors.title)}
                    placeholder="Enter title"
                    inputsize="small"
                />
            </Label>

            <SingleSelect
                required
                label="Workspace"
                options={organizations}
                value={values.workspace}
                searchPlaceholder="Select value"
                error={!!(touched.workspace && errors.workspace)}
                onChange={(value: Option) => setFieldValue("workspace", value)}
            />

            <SingleSelect
                required
                label="Board"
                options={boards}
                value={values.board}
                searchPlaceholder="Select value"
                error={!!(touched.board && errors.board)}
                onChange={(value: Option) => setFieldValue("board", value)}
            />

            <SingleSelect
                required
                label="List"
                options={lists}
                value={values.list}
                searchPlaceholder="Select value"
                error={!!(touched.list && errors.list)}
                onChange={(value: Option) => setFieldValue("list", value)}
            />

            <Label htmlFor="description" label="Description">
                <TextAreaWithDisplay
                    placeholder="Enter description"
                    {...getFieldProps("description")}
                />
            </Label>

            {/*<LabelUI htmlFor="labels" label="Labels"/>
            <Dropdown fetchMoreText={"Fetch more"} autoscrollText={"Autoscroll"} selectedIcon={faCheck} externalLinkIcon={faExternalLinkAlt} placement="bottom-start" options={labelsOptions}
                onSelectOption={(option) => {
                    if (option.value) {
                        selected.includes(option.value)
                            ? setSelected(selected.filter((s) => s !== option.value))
                            : setSelected([...selected, option.value]);
                    }
                }}
                closeOnSelect={false}
            >
                {({ active, targetProps, targetRef }) => (
                    <ButtonUI
                        id="labels"
                        ref={targetRef}
                        {...targetProps}
                        active={active}
                        text="Add"
                        icon={faPlus}
                        minimal
                        style={{ marginBottom: 10 }}
                    />
                )}
            </Dropdown>*/}

            <LabelDueDate htmlFor="dueDate" label="Due date">
                <InputWithDisplay
                    type="text"
                    {...getFieldProps("dueDate")}
                    placeholder="DD/MM/YYYY"
                    error={!!(touched.dueDate && errors.dueDate)}
                    leftIcon={{
                        icon: faCalendarDays,
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        style: { color: theme.colors.grey40 }
                    }}
                />
            </LabelDueDate>

            {/*<Members />*/}

            <Stack justify="space-between">
                <Button
                    type="submit"
                    text="Create"
                    disabled={isSubmitting}
                    loading={isSubmitting}
                />
                <Button
                    text="Cancel"
                    intent="tertiary"
                    onClick={() => dispatch({ type: "changePage", page: "home" })}
                />
            </Stack>
        </form>
    );
};

export { CreateCard };
