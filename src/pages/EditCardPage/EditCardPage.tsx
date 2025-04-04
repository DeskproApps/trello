import { FC, useMemo, useState, useEffect } from "react";
import get from "lodash/get";
import has from "lodash/has";
import * as yup from "yup";
import { useFormik } from "formik";
import isEmpty from "lodash/isEmpty";
import {
  faUser,
  faPlus,
  faCheck,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import {
  P5,
  Pill,
  Stack,
  TSpan,
  Avatar,
  Dropdown,
  InputWithDisplay,
  Label as LabelUI,
  DropdownValueType,
  Button as ButtonUI,
  DropdownTargetProps,
  DivAsInputWithDisplay,
} from "@deskpro/deskpro-ui";
import {
  DateInput,
  LoadingSpinner,
  useDeskproAppTheme,
  useDeskproElements,
  useDeskproAppClient,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { setEntityCardService } from "../../services/deskpro";
import {
  getCardService,
  updateCardService,
  getCurrentMemberService,
  getLabelsOnBoardService,
  getMembersOfOrganizationService,
} from "../../services/trello";
import { getLabelColor, getEntityMetadata } from "../../utils";
import { useAsyncError } from "../../hooks";
import {
  Label,
  Button,
  TextArea,
  Container,
  ErrorBlock,
  SingleSelect,
  EmptyInlineBlock,
  TextBlockWithLabel,
} from "../../components/common";
import type { Board, CardType, Member } from "../../services/trello/types";
import type { TicketContext } from "../../types";

export type Option = DropdownValueType<string>;

export type Options = Option[];

type MemberOption = Option & {
  metadata: { id: string, fullName: string },
};

const validationSchema = yup.object().shape({
  title: yup.string().required(),
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

const initValues = {
  title: "",
  board: { key: "", label: "", value: "", type: "value" },
  list: { key: "", label: "", value: "", type: "value" },
  description: "",
  labels: [],
  dueDate: "",
  members: [],
};

const EditCardPage: FC = () => {
  const navigate = useNavigate();
  const { cardId } = useParams();
  const { theme } = useDeskproAppTheme();
  const { client } = useDeskproAppClient();
  const { context } = useDeskproLatestAppContext() as { context: TicketContext };
  const { asyncErrorHandler } = useAsyncError();
  const ticketId = useMemo(() => get(context, ["data", "ticket", "id"]), [context]);

  const [error] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [card, setCard] = useState<CardType>();

  const [member, setMember] = useState<Member | null>(null);
  const [boards, setBoards] = useState<Options>([]);
  const [lists, setLists] = useState<Options>([]);
  const [labels, setLabels] = useState<Options>([]);
  const [members, setMembers] = useState<MemberOption[]>([]);

  const {
    values,
    errors,
    touched,
    handleSubmit,
    isSubmitting,
    getFieldProps,
    setFieldValue,
  } = useFormik({
    validationSchema,
    initialValues: initValues,
    onSubmit: async (values) => {
      if (!client || !card?.id || !ticketId) {
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

      await updateCardService(client, card.id, newCard)
        .then((card) => {
          return setEntityCardService(client, ticketId, card.id, getEntityMetadata({
            ...card,
            board: { id: values.board.value, name: values.board.label },
            list: { id: values.list.key, name: values.list.label },
            labels: card.labels,
            members: members
              .filter(({ metadata }) => card.idMembers.includes(metadata.id))
              .map(({ metadata }) => metadata),
          }))
        })
        .then(() => navigate(`/view_card/${card.id}`))
        .catch(asyncErrorHandler);
    },
  });

  useDeskproElements(({ clearElements, registerElement }) => {
    clearElements();
    registerElement("trelloRefreshButton", { type: "refresh_button" });
    registerElement("trelloHomeButton", {
      type: "home_button",
      payload: { type: "changePage", path: "/home" }
    });
  });

  /* Set title */
  useEffect(() => {
    if (!client || !card?.shortLink) {
      return;
    }

    client.setTitle(`Edit Card`);
  }, [client, card?.shortLink]);

  /* get member */
  useEffect(() => {
    if (!client) {
      return;
    }

    setLoading(true);

    getCurrentMemberService(client)
      .then((member) => {
        has(member, ["error"])
          ? asyncErrorHandler(get(member, ["error"]))
          : setMember(member);
      })
      .finally(() => setLoading(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  /* get dependent data */
  useEffect(() => {
    if (!client || !cardId) {
      return;
    }

    setLoading(true);

    getCurrentMemberService(client)
      .then((member) => has(member, ["error"])
        ? asyncErrorHandler(get(member, ["error"]))
        : setMember(member)
      )
      .then(() => getCardService(client, cardId))
      .then((card) => {
        setCard(card);
        setFieldValue("title", card.name);
        setFieldValue("description", card.desc);
        setFieldValue("board", {
          type: "value",
          key: card.board.id,
          value: card.board.id,
          label: card.board.name,
        });
        setFieldValue("list", {
          key: card.list.id,
          label: card.list.name,
          value: card.list.id,
          type: "value",
        });
        card.due && setFieldValue("dueDate", new Date(card.due));
        setFieldValue("labels", card.idLabels);
        setFieldValue("members", card.idMembers);

        return Promise.all([
          getMembersOfOrganizationService(client, card.board.idOrganization)
            .then((members) => {
              setMembers(members.map(({ id, fullName }) => ({
                key: id,
                value: id,
                type: "value",
                metadata: { id, fullName },
                selected: card.idMembers.includes(id),
                label: (
                  <Stack key={id} gap={6}>
                    <Avatar size={18} name={fullName} backupIcon={faUser} />
                    <P5>{fullName}</P5>
                  </Stack>
                ),
              })));

              return Promise.resolve();
            }),
          getLabelsOnBoardService(client, card.idBoard)
            .then((labels) => {
              if (!isEmpty(labels)) {
                setLabels(labels.map(({ id, name, color }): Option => ({
                  key: id,
                  value: id,
                  type: "value",
                  selected: card.idLabels.includes(id),
                  label: (
                    <Pill
                      key={id}
                      label={name ? name : <EmptyInlineBlock />}
                      {...getLabelColor(theme, color)}
                    />
                  ),
                })));
              }
              return Promise.resolve();
            }),
        ])
      })
      .catch(() => { })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, cardId]);

  /* Set boards */
  useEffect(() => {
    if (!isEmpty(member?.boards) && card?.board?.idOrganization) {
      setBoards(
        (member?.boards as Board[])
          .filter(({ idOrganization }) => idOrganization === card.board.idOrganization)
          .map(({ id, name }) => ({
            key: id,
            value: id,
            type: "value",
            label: name,
          }))
      );
    }
  }, [member?.boards, card?.board?.idOrganization]);

  /* set lists & labels if change board */
  useEffect(() => {
    if (!client || !values.board.value) {
      return;
    }

    const board = member?.boards?.find(({ id }) => id === values.board.value) as Board;

    if (!isEmpty(board)) {
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
              selected: values.labels.includes(id as never),
              label: (
                <Pill
                  key={id}
                  label={name ? name : <EmptyInlineBlock />}
                  {...getLabelColor(theme, color)}
                />
              ),
            })));
          }
        })
        .catch(() => { });

      setFieldValue("list", resetValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.board.value]);

  /* mark selected labels */
  useEffect(() => {
    setLabels(labels.map((label) => ({
      ...label,
      selected: values.labels.includes(label.value as never),
    })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.labels]);

  /* mark Selected members */
  useEffect(() => {
    setMembers(members.map((member) => ({
      ...member,
      selected: values.members.includes(member.value as never)
    })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.members])

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorBlock text="An error occurred" />
  }

  return (
    <Container>
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
            placeholder="Enter description"
            {...getFieldProps("description")}
          />
        </Label>

        <Label htmlFor="dueDate" label="Due Date">
          <DateInput
            id="dueDate"
            label="Due date"
            error={!!(touched.dueDate && errors.dueDate)}
            {...getFieldProps("dueDate")}
            onChange={(date: [Date]) => setFieldValue("dueDate", date[0])}
          />
        </Label>

        {values.board.value && (
          <>
            <LabelUI htmlFor="labels" label="Labels" />
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
                        {members
                          .filter(({ selected }) => selected)
                          .map(({ label }) => label)
                        }
                      </Stack>
                    )}
                  placeholder="Select value"
                  variant="inline"
                />
              )}
            />
          )}
        </Dropdown>

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
            onClick={() => navigate(`/view_card/${card?.id}`)}
          />
        </Stack>
      </form>
    </Container>
  );
};

export { EditCardPage };
