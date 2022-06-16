import { FC } from "react";
import {
    faCheck,
    faCaretDown,
    faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Dropdown, Input } from "@deskpro/deskpro-ui";
import { Label } from "../Label";

const SingleSelect: FC<any> = ({ options, label, onChange, value }) => {
    return (
        <Dropdown
            fetchMoreText={"Fetch more"}
            autoscrollText={"Autoscroll"}
            selectedIcon={faCheck}
            externalLinkIcon={faExternalLinkAlt}
            placement="bottom-start"
            inputValue={value}
            options={options}
            onSelectOption={onChange}
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
