import { FC, useState } from "react";
import { TabBar, TabBarItemType } from "@deskpro/deskpro-ui";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
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
    const [activeIndex, setActiveIndex] = useState(1);

    return (
        <>
            <TabBar
                type="tab"
                tabs={tabs}
                activeIndex={activeIndex}
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
