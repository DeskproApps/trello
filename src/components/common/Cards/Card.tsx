import { FC } from "react";
import styled from "styled-components";
import { Checkbox, HorizontalDivider } from "@deskpro/app-sdk";
import { CardInfo } from "./CardInfo";

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Card: FC<any> = ({ checked, onChange, ...props }) => (
    <>
        <CardUI>
            <CardMedia>
                <Checkbox
                    size={12}
                    checked={checked}
                    onChange={onChange}
                />
            </CardMedia>
            <CardBody>
                <CardInfo {...props} />
            </CardBody>
        </CardUI>
        <HorizontalDivider style={{ marginBottom: 9 }} />
    </>
);

export { Card };
