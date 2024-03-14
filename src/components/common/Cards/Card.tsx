import styled from "styled-components";
import { Checkbox } from "@deskpro/deskpro-ui";
import { HorizontalDivider } from "@deskpro/app-sdk";
import { CardInfo } from "./CardInfo";
import type { FC } from "react";
import type { CardType, Organization } from "../../../services/trello/types";

type Props = {
    card: CardType,
    onChange: () => void,
    checked: boolean,
    organizations: Organization[],
};

const CardUI = styled.div`
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    gap: 8px;
    width: 100%;
`;

const CardMedia = styled.div``;

const CardBody = styled.div`
    width: calc(100% - 12px - 8px);
`;

const Card: FC<Props> = ({ checked, onChange, card, organizations }) => (
    <>
        <CardUI>
            <CardMedia>
                <Checkbox
                    size={12}
                    checked={checked}
                    onChange={onChange}
                    containerStyle={{ marginTop: 4 }}
                />
            </CardMedia>
            <CardBody>
                <CardInfo
                    card={card}
                    organizations={organizations}
                    onTitleClick={onChange}
                />
            </CardBody>
        </CardUI>
        <HorizontalDivider style={{ marginBottom: 9 }} />
    </>
);

export { Card };
