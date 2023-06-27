import { FC, useState, useEffect } from "react";
import noop from "lodash/noop";
import concat from "lodash/concat";
import isEmpty from "lodash/isEmpty";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from 'yup';
import {
    faUser,
    faPlus,
    faCheck,
    faSearch,
    faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
    TSpan,
    Avatar,
    InputWithDisplay,
    DropdownTargetProps,
    DivAsInputWithDisplay,
} from "@deskpro/deskpro-ui";
import {
    P5,
    Pill,
    Stack,
    Dropdown,
    LoadingSpinner,
    TwoButtonGroup,
    Label as LabelUI,
    Button as ButtonUI,
    useDeskproAppTheme,
    useDeskproElements,
    useDeskproAppClient,
} from "@deskpro/app-sdk";
import { useLinkedAutoComment } from "../../hooks";
import { useStore } from "../../context/StoreProvider/hooks";
import {
    createCardService,
    getCurrentMemberService,
    getLabelsOnBoardService,
    getMembersOfOrganizationService,
} from "../../services/trello";
import { setEntityCardService } from "../../services/deskpro";
import {
    Label,
    Button,
    TextArea,
    DateField,
    Container,
    SingleSelect,
    EmptyInlineBlock,
    TextBlockWithLabel,
} from "../../components/common";
import {
    getOption,
    getLabelColor,
    getEntityMetadata,
} from "../../utils";
import { useSetTitle } from "../../hooks";
import type { Option } from "../../types";
import type { Member, Board, List, Organization, Label as LabelType } from "../../services/trello/types";

export type MemberOption = Option<Member["id"]> & {
    metadata: {
        id: Member["id"]
        fullName: Member["fullName"],
    },
};

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

const resetValue = getOption("", "");

const getInitValues = () => ({
    title: "",
    workspace: resetValue,
    board: resetValue,
    list: resetValue,
    description: "",
    labels: [],
    dueDate: "",
    members: [],
});

const CreateCardPage: FC = () => {
    const navigate = useNavigate();
    const { theme } = useDeskproAppTheme();
    const { client } = useDeskproAppClient();
    const [state, dispatch] = useStore();
    const { addLinkComment } = useLinkedAutoComment();
    const ticketId = state.context?.data.ticket.id;

    const [loading, setLoading] = useState<boolean>(false);
    const [member, setMember] = useState<Member|null>(null);
    const [organizations, setOrganizations] = useState<Array<Option<Organization["id"]>>>([]);
    const [boards, setBoards] = useState<Array<Option<Board["id"]>>>([]);
    const [lists, setLists] = useState<Array<Option<List["id"]>>>([]);
    const [labels, setLabels] = useState<Array<Option<LabelType["id"]>>>([]);
    const [members, setMembers] = useState<MemberOption[]>([]);

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
                // @todo: change to the formatting via date-fns
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                due: !values.dueDate ? "" : values.dueDate.toISOString(),
                idLabels: values.labels,
                idMembers: values.members,
            };

            await createCardService(client, newCard)
                .then((card) => {
                    const { id: cardId, idMembers } = card;
                    const metadata = getEntityMetadata({
                        ...card,
                        board: { id: values.board.value, name: values.board.label as Board["name"] },
                        list: { id: values.list.key, name: values.list.label as List["name"] },
                        labels: card.labels,
                        members: members
                            .filter(({ metadata }) => idMembers.includes(metadata.id))
                            .map(({ metadata }) => metadata) as Member[],
                    });

                    return Promise.all([
                        setEntityCardService(client, ticketId, cardId, metadata),
                        addLinkComment(cardId),
                    ]);
                })
                .then(() => navigate("/home"))
                .catch((error) => dispatch({ type: "error", error }));
        }
    });

    useSetTitle("Link Cards");

    useDeskproElements(({ clearElements, registerElement }) => {
        clearElements();
        registerElement("trelloRefreshButton", { type: "refresh_button" });
        registerElement("trelloHomeButton", {
            type: "home_button",
            payload: { type: "changePage", path: "/home" }
        });
        registerElement("trelloMenu", {
            type: "menu",
            items: [{
                title: "Log Out",
                payload: {
                    type: "logout",
                },
            }],
        });
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
                    selected: false,
                    metadata: { id, fullName },
                    ...getOption(id, (
                        <Stack gap={6}>
                            <Avatar size={18} name={fullName} backupIcon={faUser} />
                            <P5>{fullName}</P5>
                        </Stack>
                    )),
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
            setOrganizations((member?.organizations as Organization[])
                .map(({ id, displayName }) => getOption(id, displayName))
            );
        }
    }, [member?.organizations]);

    useEffect(() => {
        if (!isEmpty(member?.boards)) {
            setBoards((member?.boards as Board[]).map(({ id, name }) => getOption(id, name)));

            const lists = (member?.boards as Board[])
                .reduce<Array<Option<List["id"]>>>((acc, { lists = [] }) => {
                    if (!isEmpty(lists)) {
                        return concat(acc, lists?.map(({ id, name }: List) => getOption(id, name)));
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
                .map(({ id, name }) => getOption(id, name)));


            const lists = (member?.boards as Board[])
                .reduce<Array<Option<List["id"]>>>((acc, { idOrganization, lists = [] }) => {
                    if (!isEmpty(lists) && idOrganization === values.workspace.value) {
                        return concat(acc, lists?.map(({ id, name }: List) => getOption(id, name)));
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
            board.lists?.map(({ id, name }) => ({
                ...getOption(id, name),
                selected: false,
            })) as Array<Option<List["id"]>>
        );

        getLabelsOnBoardService(client, values.board.value)
            .then((labels) => {
                if (!isEmpty(labels)) {
                    setLabels(labels.map(({ id, name, color }) => getOption(id, (
                        <Pill
                            label={name ? name : <EmptyInlineBlock/>}
                            {...getLabelColor(theme, color)}
                        />
                    ))));
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
        return <LoadingSpinner/>
    }

    return (
        <Container>
            <TwoButtonGroup
                selected="two"
                oneIcon={faSearch}
                oneLabel="Find Card"
                oneOnClick={() => navigate("/link_card")}
                twoIcon={faPlus}
                twoLabel="Create Card"
                twoOnClick={noop}
            />
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
                    <TextArea
                        minWidth="auto"
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
                                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                                    {/* @ts-ignore */}
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
                        onClick={() => navigate("/home")}
                    />
                </Stack>
            </form>
        </Container>
    );
};

export { CreateCardPage };
