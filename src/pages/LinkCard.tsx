import { FC, useState } from "react";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import {
    TwoButtonGroup,
    useDeskproElements,
    TwoButtonGroupProps,
} from "@deskpro/app-sdk";
import { useSetAppTitle } from "../hooks";
import { Container } from "../components/common";
import { FindCard, CreateCard } from "../components/LinkCard";

const LinkCardPage: FC = () => {
    const [selected, setSelected] = useState<TwoButtonGroupProps["selected"]>("one");

    useSetAppTitle("Link Cards");

    useDeskproElements(({ clearElements, registerElement }) => {
        clearElements();
        registerElement("trelloRefreshButton", { type: "refresh_button" });
        registerElement("trelloHomeButton", {
            type: "home_button",
            payload: { type: "changePage", page: "home" }
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

    const onChangeSelected = (active: TwoButtonGroupProps["selected"]) => () => setSelected(active);

    return (
        <Container>
            <TwoButtonGroup
                selected={selected}
                oneIcon={faSearch}
                oneLabel="Find Card"
                oneOnClick={onChangeSelected("one")}
                twoIcon={faPlus}
                twoLabel="Create Card"
                twoOnClick={onChangeSelected("two")}
            />
            <>
                {selected === "one" && <FindCard/>}
                {selected === "two" && <CreateCard/>}
            </>
        </Container>
    );
};

export { LinkCardPage };
