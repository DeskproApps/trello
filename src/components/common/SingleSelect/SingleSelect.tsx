import { useState, FC } from "react";
import {
    faCheck,
    faCaretDown,
    faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Dropdown, Input } from "@deskpro/deskpro-ui";
import { Label } from "../Label";

const SingleSelect: FC<{ options: any, label: any }> = ({ options, label }) => {
    const [input, setInput] = useState("");

    return (
        <Dropdown
            fetchMoreText={"Fetch more"}
            autoscrollText={"Autoscroll"}
            selectedIcon={faCheck}
            externalLinkIcon={faExternalLinkAlt}
            placement="bottom-start"
            inputValue={input}
            onInputChange={setInput}
            options={options}
            onSelectOption={(option) => {
                // @ts-ignore
                option.value && setInput(option.value);
            }}
            hideIcons
        >
            {({ inputProps, inputRef }) => (
                <Label label={label}>
                    <Input
                        ref={inputRef}
                        {...inputProps}
                        variant="inline"
                        rightIcon={faCaretDown}
                        placeholder="Select Value"
                    />
                </Label>
            )}
        </Dropdown>
    );
};

export { SingleSelect };
