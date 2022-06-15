import { FC, useEffect, useState } from "react";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { TabBar, TabBarItemType } from "@deskpro/deskpro-ui";
import { useDeskproAppClient } from "@deskpro/app-sdk";
import { FindCard, CreateCard } from "../components/LinkCard";

const tabs: TabBarItemType[] = [
    {
        label: "Find Card",
        icon: faSearch,
    },
    {
        label: "Crete Card",
        icon: faPlus,
    },
];

const LinkCard: FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const { client } = useDeskproAppClient();

    useEffect(() => {
        if (!client) {
            return;
        }

        client?.deregisterElement("trelloPlusButton");

        client?.setTitle("Link Cards");
    }, [client]);

    return (
        <>
            <TabBar
                type="tab"
                tabs={tabs}
                activeIndex={activeIndex}
                style={{ marginBottom: 14 }}
                onClickTab={(index) => setActiveIndex(index)}
            />
            <>
                {activeIndex === 0 && <FindCard/>}
                {activeIndex === 1 && <CreateCard/>}
            </>
        </>
    );
};

export { LinkCard };
