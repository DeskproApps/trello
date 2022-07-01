import { FC, useState, useEffect } from "react";
import concat from "lodash/concat";
import isEmpty from "lodash/isEmpty";
import { useFormik } from "formik";
import * as yup from 'yup';
import {
    faUser,
    faPlus,
    faCheck,
    faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
    TSpan,
    Avatar,
    InputWithDisplay,
    DropdownTargetProps,
    TextAreaWithDisplay,
    DivAsInputWithDisplay,
} from "@deskpro/deskpro-ui";
import {
    P5,
    Pill,
    Stack,
    Dropdown,
    DropdownValueType,
    Label as LabelUI,
    Button as ButtonUI,
    useDeskproAppTheme,
    useDeskproAppClient,
} from "@deskpro/app-sdk";
import { useStore } from "../../../context/StoreProvider/hooks";
import {
    createCardService,
    getCurrentMemberService,
    getLabelsOnBoardService,
    createCardCommentService,
    getMembersOfOrganizationService,
} from "../../../services/trello";
import { setEntityCardService } from "../../../services/entityAssociation";
import { Member, Board, List, Organization } from "../../../services/trello/types";
import {
    Label,
    Button,
    Loading,
    DateField,
    SingleSelect,
    EmptyInlineBlock,
    TextBlockWithLabel,
} from "../../common";
import { getLabelColor } from "../../../utils";

type Option = DropdownValueType<string>;

type Options = Option[];

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
    members: yup.array(yup.string()),
    dueDate: yup.date(),
});

const resetValue = { key: "", label: "", value: "", type: "value" };

const getInitValues = () => ({
    title: "",
    workspace: { key: "", label: "", value: "", type: "value" },
    board: { key: "", label: "", value: "", type: "value" },
    list: { key: "", label: "", value: "", type: "value" },
    description: "",
    labels: [],
    dueDate: "",
    members: [],
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
    const [labels, setLabels] = useState<Options>([]);
    const [members, setMembers] = useState<Options>([]);

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
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                due: !values.dueDate ? "" : values.dueDate.toISOString(),
                idLabels: values.labels,
                idMembers: values.members,
            };

            await createCardService(client, newCard)
                .then(({ id: cardId }) => {
                    return Promise.all([
                        setEntityCardService(client, ticketId, cardId),
                        createCardCommentService(
                            client,
                            cardId,
                            `Linked to Deskpro ticket ${ticketId}${state.context?.data?.ticket?.permalinkUrl
                                ? `, ${state.context.data.ticket.permalinkUrl}`
                                : ""
                            }`,
                        ),
                    ]);
                })
                .then(() => dispatch({ type: "changePage", page: "home" }))
                .catch((error) => dispatch({ type: "error", error }));
        }
    });

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
        if (!client || !values.workspace.value) {
            return;
        }

        getMembersOfOrganizationService(client, values.workspace.value)
            .then((members) => {
                setMembers(members.map(({ id, fullName }) => ({
                    key: id,
                    value: id,
                    type: "value",
                    selected: false,
                    label: (
                        <Stack gap={6}>
                            <Avatar size={18} name={fullName} backupIcon={faUser} />
                            <P5>{fullName}</P5>
                        </Stack>
                    ),
                })));
            });
    }, [client, values.workspace.value]);

    useEffect(() => {
        setMembers(members.map((member) => ({
            ...member,
            selected: values.members.includes(member.value as never)
        })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values.members])

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
            setFieldValue("board", resetValue);
            setFieldValue("list", resetValue);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values.workspace]);

    useEffect(() => {
        if (!client || !values.board.value) {
            return;
        }

        const board = member?.boards?.find(({ id }) => id === values.board.value) as Board;

        setLists(
            board.lists?.map(({ id, name }): Option => ({
                key: id,
                value: id,
                label: name,
                type: "value",
                selected: false,
            })) as Options
        );

        getLabelsOnBoardService(client, values.board.value)
            .then((labels) => {
                if (!isEmpty(labels)) {
                    setLabels(labels.map(({ id, name, color }): Option => ({
                        key: id,
                        value: id,
                        type: "value",
                        label: (
                            <Pill
                                label={name ? name : <EmptyInlineBlock/>}
                                {...getLabelColor(theme, color)}
                            />
                        ),
                    })));
                }
            })
            .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values.board.value]);

    useEffect(() => {
        setLabels(labels.map((label) => ({
            ...label,
            selected: values.labels.includes(label.value as never),
        })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values.labels]);

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

            <DateField
                id="dueDateSdk"
                label="Due date"
                error={!!(touched.dueDate && errors.dueDate)}
                onChange={(date: [Date]) => setFieldValue("dueDate", date[0])}
            />

            {values.board.value && (
                <>
                    <LabelUI htmlFor="labels" label="Labels"/>
                    <Dropdown
                        fetchMoreText={"Fetch more"}
                        autoscrollText={"Autoscroll"}
                        selectedIcon={faCheck}
                        externalLinkIcon={faExternalLinkAlt}
                        placement="bottom-start"
                        options={labels}
                        onSelectOption={(option) => {
                            if (option.value) {
                                const newValue = values.labels.includes(option.value as never)
                                    ? values.labels.filter((labelId) => labelId !== option.value)
                                    : [...values.labels, option.value]

                                setFieldValue("labels", newValue);
                            }
                        }}
                        closeOnSelect={false}
                    >
                        {({ active, targetProps, targetRef }) => (
                            <Stack gap={6} wrap="wrap" align="baseline" style={{ marginBottom: 10 }}>
                                <ButtonUI
                                    id="labels"
                                    ref={targetRef}
                                    {...targetProps}
                                    active={active}
                                    text="Add"
                                    icon={faPlus}
                                    minimal
                                />
                                {labels.filter(({ selected }) => selected).map(({ label }) => label)}
                            </Stack>
                        )}
                    </Dropdown>
                </>
            )}

            {values.workspace.value && (
                <Dropdown
                    fetchMoreText="Fetch more"
                    autoscrollText="Autoscroll"
                    selectedIcon={faCheck}
                    externalLinkIcon={faExternalLinkAlt}
                    placement="bottom-start"
                    searchPlaceholder="Select value"
                    options={members}
                    onSelectOption={(option) => {
                        if (option.value) {
                            const newValue = values.members.includes(option.value as never)
                                ? values.members.filter((labelId) => labelId !== option.value)
                                : [...values.members, option.value]

                            setFieldValue("members", newValue);
                        }
                    }}
                    closeOnSelect={false}
                >
                    {({ targetProps, targetRef }: DropdownTargetProps<HTMLDivElement>) => (
                        <TextBlockWithLabel
                            label="Members"
                            text={(
                                <DivAsInputWithDisplay
                                    ref={targetRef}
                                    {...targetProps}
                                    value={!values.members.length
                                        ? (
                                            <TSpan
                                                overflow={"ellipsis"}
                                                type={"p1"}
                                                style={{ color: theme.colors.grey40 }}
                                            >
                                                Select value
                                            </TSpan>
                                        )
                                        : (
                                            <Stack gap={6} wrap="wrap">
                                                {members.filter(({ selected }) => selected).map(({ label }) => label)}
                                            </Stack>
                                        )}
                                    placeholder="Select value"
                                    variant="inline"
                                />
                            )}
                        />
                    )}
                </Dropdown>
            )}

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
