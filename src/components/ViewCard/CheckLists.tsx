import size from "lodash/size";
import { Title } from "@deskpro/app-sdk";
import { H3, Stack, Checkbox } from "@deskpro/deskpro-ui";
import { Container } from "../common";
import type { FC } from "react";
import type { Maybe } from "../../types";
import type { CardType, ChecklistItem } from "../../services/trello/types";

type Props =  {
    checklists: Maybe<CardType["checklists"]>,
    onChangeChecklistItem: (
        itemId: ChecklistItem["id"],
        state: ChecklistItem["state"],
    ) => void,
};

const CheckLists: FC<Props> = ({ checklists, onChangeChecklistItem }) => {
    return (
        <Container>
            {(Array.isArray(checklists) && size(checklists)) && (
                <>
                    <Title title="Checklist" />

                    {checklists.map(({ id, name, checkItems }) => (
                        <Stack key={id} vertical style={{ marginBottom: 10 }}>
                            <H3 style={{ marginBottom: 10 }}>{name}</H3>
                            {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                checkItems.map(({ id, name, state }: any) => (
                                    <Checkbox
                                        id={id}
                                        key={id}
                                        checked={state === "complete"}
                                        label={name}
                                        onChange={() => {
                                            onChangeChecklistItem(id, state === "complete" ? "incomplete" : "complete")
                                        }}
                                        labelProps={{ style: { alignItems: "baseline" }}}
                                    />
                                ))
                            }
                        </Stack>
                    ))}
                </>
            )}
        </Container>
    );
};

export { CheckLists };
