import { useState, FC } from "react";
import {
    faCheck,
    faCaretDown,
    faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Dropdown, InputWithDisplay } from "@deskpro/deskpro-ui";
import { Label } from "../Label";

const SingleSelect: FC<{ options: any, label: any }> = ({ options, label }) => {
    const [input, setInput] = useState("");
    const [isVisibleInput, setIsVisibleInput] = useState(false);

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
                <Label
                    required
                    label={label}
                    onBlur={() => {
                        setIsVisibleInput(false);
                    }}
                    onClick={() => {
                        setIsVisibleInput(true);
                    }}
                >
                    <InputWithDisplay
                        ref={inputRef}
                        {...inputProps}
                        rightIcon={faCaretDown}
                        placeholder="Select Value"
                        isVisibleInput={isVisibleInput}
                    />
                </Label>
            )}
        </Dropdown>
    );
};

export { SingleSelect };
