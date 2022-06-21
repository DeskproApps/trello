import { FC, useEffect/*, useState*/ } from "react";
// import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import {
    // TwoButtonGroup,
    // TwoButtonGroupProps,
    useDeskproAppClient,
} from "@deskpro/app-sdk";
import { FindCard/*, CreateCard*/ } from "../components/LinkCard";

const LinkCardPage: FC = () => {
    // const [selected, setSelected] = useState<TwoButtonGroupProps["selected"]>("one");
    const { client } = useDeskproAppClient();

    useEffect(() => {
        if (!client) {
            return;
        }

        client?.deregisterElement("trelloPlusButton");
        client?.deregisterElement("trelloHomeButton");
        client?.deregisterElement("trelloExternalCtaLink");

        client?.setTitle("Link Cards");
    }, [client]);

    // const onChangeSelected = (active: TwoButtonGroupProps["selected"]) => () => setSelected(active);

    return (
        <>
            {/*<TwoButtonGroup
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
            </>*/}
            <FindCard/>
        </>
    );
};

export { LinkCardPage };
