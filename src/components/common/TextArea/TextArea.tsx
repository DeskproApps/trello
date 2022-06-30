import { FC } from "react";
import styled from "styled-components";
import {
    TextAreaWithDisplay,
    TextAreaWithDisplayProps,
} from "@deskpro/deskpro-ui";

const TextArea: FC<TextAreaWithDisplayProps> = styled(TextAreaWithDisplay)`
    font-size: 11px;
    font-family: ${({ theme }) => theme.fonts.primary};
`;

export { TextArea };
