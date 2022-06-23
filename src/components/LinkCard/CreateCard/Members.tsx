import { useState } from "react";
import {
    faCheck,
    faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Dropdown, DropdownTargetProps, InputWithDisplay} from "@deskpro/deskpro-ui";
import {Label} from "../../common";

const members = [
    {
        key: "1",
        label: "Workspace 1",
        type: "value",
        value: "workspace1",
    },
    {
        key: "2",
        label: "Workspace 2",
        type: "value",
        value: "workspace2",
    },
    {
        key: "3",
        label: "Workspace 3",
        type: "value",
        value: "workspace3",
    }
];

const Members = () => {
    const [selected, setSelected] = useState<string[]>([]);
    const multiSelectOptions = members.map((member) => ({
        ...member,
        selected: !!member.value && selected.includes(member.value),
    }));

    return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        /* @ts-ignore */
        <Dropdown options={multiSelectOptions}
            fetchMoreText={"Fetch more"}
            autoscrollText={"Autoscroll"}
            selectedIcon={faCheck}
            externalLinkIcon={faExternalLinkAlt}
            placement="bottom-start"
            onSelectOption={(option) => {
                if (option.value) {
                    selected.includes(option.value)
                        ? setSelected(selected.filter((s) => s !== option.value))
                        : setSelected([...selected, option.value]);
                }
            }}
            closeOnSelect={false}
        >
            {({ inputProps, inputRef }: DropdownTargetProps<HTMLButtonElement>) => (
                <Label htmlFor="members" label="Members">
                    <InputWithDisplay
                        ref={inputRef}
                        type="text"
                        id="members"
                        placeholder="Select value"
                        inputsize="small"
                        {...inputProps}
                    />
                </Label>
            )}
        </Dropdown>
    );
}

export { Members };
