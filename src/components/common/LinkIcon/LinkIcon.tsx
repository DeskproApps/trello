import { FC } from "react";
import styled from "styled-components";
import { Icon } from "@deskpro/deskpro-ui";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { Props } from "./types";
import { DeskproAppTheme } from "@deskpro/app-sdk";

const Link = styled.a<DeskproAppTheme>`
    color: ${({ theme, color }) => color || theme.colors.grey40 };
`;

const LinkIcon: FC<Props> = ({ size, ...props }) => (
    <Link target="_blank" {...props}>
        <Icon size={size} icon={faArrowUpRightFromSquare} />
    </Link>
);

export { LinkIcon };
