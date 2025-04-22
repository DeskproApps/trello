import { Avatar, Button as ButtonUI, DivAsInputWithDisplay, Dropdown, DropdownTargetProps, DropdownValueType, InputWithDisplay, P5, Pill, Stack, TextArea, TSpan } from "@deskpro/deskpro-ui";
import { Button, Container, EmptyInlineBlock, Label, SingleSelect, TextBlockWithLabel } from "../../components/common";
import { CardType, Member } from "../../services/trello/types";
import { DateInput, LoadingSpinner, useDeskproAppClient, useDeskproAppTheme, useDeskproElements, useDeskproLatestAppContext, useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
import { faUser, faPlus, faCheck, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { getEntityMetadata, getLabelColor } from "../../utils";
import { setEntityCardService } from "../../services/deskpro";
import { Settings, TicketData } from "../../types";
import { updateCardService } from "../../services/trello";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import editCardValidationSchema from "./editCardValidationSchema";
import getCardDefaultData from "./getCardDefaultData";

const initialFormValues = {
  title: "",
  board: { key: "", label: "", value: "", type: "value" },
  list: { key: "", label: "", value: "", type: "value" },
  description: "",
  labels: [],
  dueDate: "",
  members: [],
}

type MemberOption = DropdownValueType<string> & {
  metadata: { id: string, fullName: string },
};

export function EditCardPage(): JSX.Element {

  // Set the app's header elements
  useInitialisedDeskproAppClient((client) => {
    client.setTitle("Edit Card")
  }, [])

  useDeskproElements(({ clearElements, registerElement }) => {
    clearElements();
    registerElement("trelloRefreshButton", { type: "refresh_button" });
    registerElement("trelloHomeButton", {
      type: "home_button",
      payload: { type: "changePage", path: "/home" }
    });
  })

  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Meta related state
  const [card, setCard] = useState<CardType>()
  const [member, setMember] = useState<Member | null>(null)
  const [boards, setBoards] = useState<DropdownValueType<string>[]>([])
  const [lists, setLists] = useState<DropdownValueType<string>[]>([])
  const [labels, setLabels] = useState<DropdownValueType<string>[]>([])
  const [members, setMembers] = useState<MemberOption[]>([])

  const { cardId } = useParams()
  const { client } = useDeskproAppClient();
  const { context } = useDeskproLatestAppContext<TicketData, Settings>()
  const { theme } = useDeskproAppTheme();

  const navigate = useNavigate()

  const ticketId = context?.data?.ticket.id

  const {
    values,
    errors,
    touched,
    handleSubmit,
    isSubmitting,
    getFieldProps,
    setFieldValue,
  } = useFormik({
    validationSchema: editCardValidationSchema,
    initialValues: initialFormValues,
    onSubmit: async (values) => {
      if (!client || !card?.id || !ticketId) {
        return
      }

      // Construct the edit payload to be sent
      const dueDate: unknown = values.dueDate
      const newCard = {
        name: values.title,
        desc: values.description,
        idList: values.list.value,
        due: dueDate instanceof Date ? dueDate.toISOString() : dueDate ?? "",
        idLabels: values.labels,
        idMembers: values.members,
      }

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
        .then(() => { navigate(`/view_card/${card.id}`); })
    },
  })

  useInitialisedDeskproAppClient((client) => {
    if (!cardId) {
      return
    }

    const getDefaultData = async () => {
      setIsLoading(true)
      const cardData = await getCardDefaultData(client, cardId)

      // Only update the state if a member & card were found
      if (cardData.member && cardData.card !== null) {

        setCard(cardData.card)

        setMember(cardData.member)

        setBoards((cardData.member.boards ?? [])
          .filter(({ idOrganization }) => idOrganization === cardData.card?.board.idOrganization)
          .map(({ id, name }) => ({
            key: id,
            value: id,
            type: "value",
            label: name,
          })))

        setMembers(cardData.organizationMembers.map(({ id, fullName }) => ({
          key: id,
          value: id,
          type: "value",
          metadata: { id, fullName },
          selected: cardData.card?.idMembers.includes(id),
          label: (
            <Stack key={id} gap={6}>
              <Avatar size={18} name={fullName} backupIcon={faUser} />
              <P5>{fullName}</P5>
            </Stack>
          ),
        })))

        setLabels(cardData.labels.map(({ id, name, color }): DropdownValueType<string> => ({
          key: id,
          value: id,
          type: "value",
          selected: cardData.card?.idLabels.includes(id),
          label: (
            <Pill
              key={id}
              label={name ? name : <EmptyInlineBlock />}
              {...getLabelColor(theme, color)}
            />
          ),
        })))

        // Set the default values
        await Promise.all([
          setFieldValue("title", cardData.card.name),
          setFieldValue("description", cardData.card.desc),
          setFieldValue("board", {
            type: "value",
            key: cardData.card.board.id,
            value: cardData.card.board.id,
            label: cardData.card.board.name,
          }),
          setFieldValue("list", {
            key: cardData.card.list.id,
            label: cardData.card.list.name,
            value: cardData.card.list.id,
            type: "value",
          }),
          cardData.card.due && setFieldValue("dueDate", new Date(cardData.card.due)),
          setFieldValue("labels", cardData.card.idLabels),
          setFieldValue("members", cardData.card.idMembers)
        ])

      }

      setIsLoading(false)
    }

    void getDefaultData()

  }, [cardId])

  // Reset the list options when the selected board changes
  useEffect(() => {
    if (!member) {
      return
    }
    const board = member?.boards?.find(({ id }) => id === values.board.value);

    setLists(
      board?.lists?.map(({ id, name }): DropdownValueType<string> => ({
        key: id,
        value: id,
        label: name,
        type: "value",
        selected: false,
      })) ?? []
    )
  }, [member, values.board.value])

  if (isLoading) {
    return <LoadingSpinner />
  }
  
  // Render edit form
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
          onChange={(value: DropdownValueType<string>) => setFieldValue("board", value)}
        />

        <SingleSelect
          required
          label="List"
          options={lists}
          value={values.list}
          searchPlaceholder="Select value"
          error={!!(touched.list && errors.list)}
          onChange={(value: DropdownValueType<string>) => setFieldValue("list", value)}
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
            <Label htmlFor="labels" label="Labels" />
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

                  void setFieldValue("labels", newValue)
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

              void setFieldValue("members", newValue);
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
            disabled={isSubmitting || !cardId}
            loading={isSubmitting}
          />
          <Button
            text="Cancel"
            intent="tertiary"
            onClick={() => { navigate(`/view_card/${card?.id}`); }}
          />
        </Stack>
      </form>
    </Container>
  );
}