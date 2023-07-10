import { FC, PropsWithChildren } from "react"
import styled from "styled-components";
import { P5 } from "@deskpro/app-sdk";

const OverflowText: FC<PropsWithChildren> = styled(P5)`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export { OverflowText };
